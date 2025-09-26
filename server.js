const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- 1️⃣ Database Connection ----------
const pool = new Pool({
    user: 'username',
    host: 'localhost',
    database: 'attendify',
    password: 'password',
    port: 5432,
});

// ---------- 2️⃣ Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ---------- 3️⃣ FastAPI Service URL ----------
const FASTAPI_URL = 'http://localhost:8000';

// ---------- 4️⃣ Helper Functions ----------
const executeQuery = async (query, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } finally {
        client.release();
    }
};

// ---------- 5️⃣ API Routes ----------

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'nodejs-api' });
});

// Get all classes for teacher
app.get('/api/classes', async (req, res) => {
    try {
        const classes = await executeQuery(`
            SELECT id, name, subject, room, period, time_slot, teacher_name
            FROM classes
            ORDER BY id
        `);
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});

// Get students for a specific class
app.get('/api/classes/:classId/students', async (req, res) => {
    try {
        const { classId } = req.params;
        const students = await executeQuery(`
            SELECT id, name, classroom, student_roll_number
            FROM students
            WHERE class_id = $1
            ORDER BY name
        `, [classId]);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Take attendance using face recognition
app.post('/api/classes/:classId/attendance', upload.single('image'), async (req, res) => {
    try {
        const { classId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Convert image to base64
        const imageBase64 = req.file.buffer.toString('base64');

        // Call FastAPI face recognition service
        const response = await axios.post(`${FASTAPI_URL}/recognize-faces`, {
            image_base64: imageBase64,
            class_id: parseInt(classId)
        });

        const { recognized_faces, attendance_marked } = response.data;

        // Get updated attendance records
        const attendanceRecords = await executeQuery(`
            SELECT s.name, s.classroom, a.date, a.time, a.status
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.class_id = $1
            ORDER BY a.date DESC, a.time DESC
        `, [classId]);

        res.json({
            success: true,
            recognized_faces,
            attendance_marked,
            attendance_records: attendanceRecords
        });

    } catch (error) {
        console.error('Error processing attendance:', error);
        res.status(500).json({ error: 'Failed to process attendance' });
    }
});

// Get attendance records for a class
app.get('/api/classes/:classId/attendance', async (req, res) => {
    try {
        const { classId } = req.params;
        const { date } = req.query;

        let query = `
            SELECT s.name, s.classroom, a.date, a.time, a.status
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.class_id = $1
        `;
        let params = [classId];

        if (date) {
            query += ` AND a.date = $2`;
            params.push(date);
        }

        query += ` ORDER BY a.date DESC, a.time DESC`;

        const records = await executeQuery(query, params);
        res.json(records);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

// Get attendance statistics for a class
app.get('/api/classes/:classId/stats', async (req, res) => {
    try {
        const { classId } = req.params;
        
        const stats = await executeQuery(`
            SELECT 
                COUNT(DISTINCT s.id) as total_students,
                COUNT(DISTINCT a.student_id) as students_present_today,
                COUNT(a.id) as total_attendance_records,
                ROUND(AVG(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100, 2) as attendance_percentage
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id AND a.class_id = $1
            WHERE s.class_id = $1
        `, [classId]);

        res.json(stats[0] || {});
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get parent dashboard data
app.get('/api/parent/:parentId/dashboard', async (req, res) => {
    try {
        const { parentId } = req.params;
        
        // Get parent's students
        const students = await executeQuery(`
            SELECT s.id, s.name, s.classroom, s.student_roll_number
            FROM students s
            JOIN parents p ON s.id = ANY(p.student_ids)
            WHERE p.id = $1
        `, [parentId]);

        if (students.length === 0) {
            return res.json({ students: [], attendance: [] });
        }

        const studentIds = students.map(s => s.id);

        // Get attendance records for parent's students
        const attendance = await executeQuery(`
            SELECT 
                s.name,
                s.classroom,
                c.name as class_name,
                c.subject,
                a.date,
                a.time,
                a.status
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN classes c ON a.class_id = c.id
            WHERE s.id = ANY($1)
            ORDER BY a.date DESC, a.time DESC
            LIMIT 50
        `, [studentIds]);

        // Get attendance statistics
        const stats = await executeQuery(`
            SELECT 
                s.id,
                s.name,
                COUNT(a.id) as total_days,
                COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
                ROUND(
                    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / 
                    NULLIF(COUNT(a.id), 0), 2
                ) as attendance_percentage
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id
            WHERE s.id = ANY($1)
            GROUP BY s.id, s.name
        `, [studentIds]);

        res.json({
            students,
            attendance,
            stats
        });
    } catch (error) {
        console.error('Error fetching parent dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch parent dashboard' });
    }
});

// Clear attendance for a class
app.delete('/api/classes/:classId/attendance', async (req, res) => {
    try {
        const { classId } = req.params;
        
        await executeQuery('DELETE FROM attendance WHERE class_id = $1', [classId]);
        
        res.json({ success: true, message: 'Attendance cleared successfully' });
    } catch (error) {
        console.error('Error clearing attendance:', error);
        res.status(500).json({ error: 'Failed to clear attendance' });
    }
});

// ---------- 6️⃣ Error Handling ----------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ---------- 7️⃣ Start Server ----------
app.listen(PORT, () => {
    console.log(`Node.js API server running on port ${PORT}`);
    console.log(`FastAPI service expected at: ${FASTAPI_URL}`);
});

module.exports = app;
