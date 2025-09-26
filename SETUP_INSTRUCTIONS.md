# Attendify Face Recognition Setup

## Complete Architecture
```
React Frontend → Node.js API → FastAPI (Face Recognition) → PostgreSQL
```

## Setup Steps

### 1. Database Setup (PostgreSQL)
```bash
# Install PostgreSQL
# Create database
psql -U postgres
CREATE DATABASE attendify;
\c attendify

# Run schema
psql -U postgres -d attendify -f database_schema.sql
```

### 2. FastAPI Face Recognition Service
```bash
# Install Python dependencies
pip install -r requirements.txt

# Update database connection in face_recognition_service.py
DATABASE_URL = "postgresql://username:password@localhost:5432/attendify"

# Run FastAPI service
python face_recognition_service.py
# Service runs on http://localhost:8000
```

### 3. Node.js API Server
```bash
# Install dependencies
npm install

# Update database connection in server.js
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'attendify',
    password: 'your_password',
    port: 5432,
});

# Run Node.js server
npm start
# API runs on http://localhost:5000
```

### 4. React Frontend
```bash
# Your existing React app
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### FastAPI (Port 8000)
- `POST /recognize-faces` - Face recognition and attendance marking
- `GET /attendance/{class_id}` - Get attendance records
- `GET /students/{class_id}` - Get students in class
- `POST /clear-attendance/{class_id}` - Clear attendance
- `GET /health` - Health check

### Node.js API (Port 5000)
- `GET /api/classes` - Get all classes
- `GET /api/classes/:classId/students` - Get students in class
- `POST /api/classes/:classId/attendance` - Take attendance (with image)
- `GET /api/classes/:classId/attendance` - Get attendance records
- `GET /api/classes/:classId/stats` - Get attendance statistics
- `GET /api/parent/:parentId/dashboard` - Parent dashboard data

## Face Recognition Flow

1. **Teacher clicks "Take Attendance"**
2. **React** → Opens camera, captures image
3. **React** → Sends image to Node.js API
4. **Node.js** → Forwards to FastAPI with class_id
5. **FastAPI** → Processes image, recognizes faces
6. **FastAPI** → Updates PostgreSQL attendance table
7. **Node.js** → Returns updated attendance to React
8. **React** → Shows success message with recognized students

## Database Schema

### Tables:
- `classes` - Class information
- `students` - Student details with face embeddings
- `attendance` - Daily attendance records
- `parents` - Parent login information
- `teachers` - Teacher login information
- `face_embeddings` - Face recognition data

### Key Features:
- Face recognition using InsightFace Buffalo_L model
- FAISS for fast similarity search
- Real-time attendance marking
- Parent dashboard with attendance tracking
- Teacher dashboard with class management

## Environment Variables

Create `.env` files:

### FastAPI (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/attendify
```

### Node.js (.env)
```
DB_USER=your_username
DB_HOST=localhost
DB_NAME=attendify
DB_PASSWORD=your_password
DB_PORT=5432
FASTAPI_URL=http://localhost:8000
```

## Testing

1. **Start all services** in order: PostgreSQL → FastAPI → Node.js → React
2. **Test face recognition** by clicking "Take Attendance" button
3. **Check parent dashboard** for real-time attendance updates
4. **Verify database** records are being created

## Troubleshooting

- **Camera access**: Ensure HTTPS or localhost for camera permissions
- **Database connection**: Check PostgreSQL is running and credentials
- **Face recognition**: Ensure face images are in the correct directory
- **CORS issues**: Check FastAPI CORS settings for React frontend
