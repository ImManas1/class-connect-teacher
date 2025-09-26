import os
import cv2
import numpy as np
import faiss
import pickle
import asyncio
import base64
from datetime import datetime
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
from insightface.app import FaceAnalysis
import uvicorn

# ---------- 1️⃣ Initialize FastAPI ----------
app = FastAPI(title="Face Recognition API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- 2️⃣ Initialize Buffalo_L Model ----------
face_app = FaceAnalysis(name='buffalo_l')
face_app.prepare(ctx_id=0, det_size=(640, 640))

# ---------- 3️⃣ Database Connection ----------
DATABASE_URL = "postgresql://username:password@localhost:5432/attendify"

async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# ---------- 4️⃣ Load FAISS Database ----------   
dataset_path = r'C:\MANAS\SIH\FACEDET\database'
emb_file = 'embeddings.npy'
labels_file = 'labels.pkl'

if os.path.exists(emb_file) and os.path.exists(labels_file):
    embeddings_array = np.load(emb_file)
    with open(labels_file, 'rb') as f:
        labels = pickle.load(f)
    print("Loaded cached embeddings and labels.")
else:
    labels, embeddings = [], []
    for cls in os.listdir(dataset_path):
        cls_folder = os.path.join(dataset_path, cls)
        if not os.path.isdir(cls_folder):
            continue
        for img_file in os.listdir(cls_folder):
            if img_file.lower().endswith(('.jpg', '.png')):
                img_path = os.path.join(cls_folder, img_file)
                img_bgr = cv2.imread(img_path)
                if img_bgr is None:
                    continue
                faces = face_app.get(img_bgr)
                if faces:
                    face = max(faces, key=lambda f: f.det_score)
                    emb = face.embedding / np.linalg.norm(face.embedding)
                    embeddings.append(emb.astype('float32'))
                    labels.append(cls)
    embeddings_array = np.vstack(embeddings)
    np.save(emb_file, embeddings_array)
    with open(labels_file, 'wb') as f:
        pickle.dump(labels, f)
    print(f"FAISS database built with {len(labels)} faces.")

# ---------- 5️⃣ Build FAISS Index ----------
d = embeddings_array.shape[1]
index = faiss.IndexFlatIP(d)
index.add(embeddings_array)

# ---------- 6️⃣ Pydantic Models ----------
class AttendanceRecord(BaseModel):
    student_id: int
    name: str
    classroom: str
    date: str
    time: str
    status: str

class ImageData(BaseModel):
    image_base64: str
    class_id: int

class RecognitionResult(BaseModel):
    recognized_faces: List[Dict]
    attendance_marked: List[str]

# ---------- 7️⃣ Attendance Marking Function ----------
async def mark_attendance(name: str, class_id: int):
    conn = await get_db_connection()
    try:
        # Get student ID
        student_id = await conn.fetchval(
            "SELECT id FROM students WHERE name = $1 AND class_id = $2", 
            name, class_id
        )
        
        if not student_id:
            return False
            
        # Check if already marked today
        today = datetime.now().strftime("%Y-%m-%d")
        existing = await conn.fetchval(
            "SELECT id FROM attendance WHERE student_id = $1 AND date = $2", 
            student_id, today
        )
        
        if not existing:
            now = datetime.now().strftime("%H:%M:%S")
            await conn.execute(
                "INSERT INTO attendance (student_id, class_id, date, time, status) VALUES ($1, $2, $3, $4, $5)",
                student_id, class_id, today, now, "Present"
            )
            return True
        return False
    finally:
        await conn.close()

# ---------- 8️⃣ Face Recognition Function ----------
async def recognize_faces_in_image(image_base64: str, class_id: int) -> RecognitionResult:
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        # Resize for detection
        det_frame = cv2.resize(frame, (640, 640))
        faces = face_app.get(det_frame)
        
        scale_x = frame.shape[1] / 640
        scale_y = frame.shape[0] / 640
        
        recognized_faces = []
        attendance_marked = []
        threshold = 0.5
        
        for face in faces:
            # Get face coordinates
            x1, y1, x2, y2 = face.bbox.astype(int)
            x1 = int(x1 * scale_x)
            y1 = int(y1 * scale_y)
            x2 = int(x2 * scale_x)
            y2 = int(y2 * scale_y)
            
            # Get embedding and search
            emb = face.embedding / np.linalg.norm(face.embedding)
            D, I = index.search(np.expand_dims(emb.astype('float32'), axis=0), 1)
            
            if D[0][0] > threshold:
                name = labels[I[0][0]]
                recognized_faces.append({
                    "name": name,
                    "confidence": float(D[0][0]),
                    "bbox": [x1, y1, x2, y2]
                })
                
                # Mark attendance
                marked = await mark_attendance(name, class_id)
                if marked:
                    attendance_marked.append(name)
        
        return RecognitionResult(
            recognized_faces=recognized_faces,
            attendance_marked=attendance_marked
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")

# ---------- 9️⃣ FastAPI Endpoints ----------
@app.post("/recognize-faces")
async def recognize_faces(image_data: ImageData):
    """Recognize faces in uploaded image and mark attendance"""
    result = await recognize_faces_in_image(image_data.image_base64, image_data.class_id)
    return result

@app.get("/attendance/{class_id}")
async def get_attendance(class_id: int):
    """Get attendance records for a specific class"""
    conn = await get_db_connection()
    try:
        records = await conn.fetch("""
            SELECT s.name, s.classroom, a.date, a.time, a.status
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.class_id = $1
            ORDER BY a.date DESC, a.time DESC
        """, class_id)
        
        return [dict(record) for record in records]
    finally:
        await conn.close()

@app.get("/students/{class_id}")
async def get_students(class_id: int):
    """Get all students in a class"""
    conn = await get_db_connection()
    try:
        students = await conn.fetch("""
            SELECT id, name, classroom, face_embedding_path
            FROM students 
            WHERE class_id = $1
        """, class_id)
        
        return [dict(student) for student in students]
    finally:
        await conn.close()

@app.post("/clear-attendance/{class_id}")
async def clear_attendance(class_id: int):
    """Clear attendance for a specific class"""
    conn = await get_db_connection()
    try:
        await conn.execute("DELETE FROM attendance WHERE class_id = $1", class_id)
        return {"status": "success", "message": f"Attendance cleared for class {class_id}"}
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "face-recognition"}

# ---------- 🔟 Start Server ----------
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
