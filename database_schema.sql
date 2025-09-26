-- Attendify Database Schema
-- PostgreSQL Database for Face Recognition Attendance System

-- Create database
CREATE DATABASE attendify;

-- Connect to database
\c attendify;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    room VARCHAR(50),
    period VARCHAR(50),
    time_slot VARCHAR(50),
    teacher_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    classroom VARCHAR(50),
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    face_embedding_path VARCHAR(255),
    student_roll_number VARCHAR(20) UNIQUE,
    parent_email VARCHAR(100),
    parent_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    recognition_confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Parents table (for parent login)
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    student_ids INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Teachers table (for teacher login)
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    class_ids INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Face embeddings table (for FAISS integration)
CREATE TABLE face_embeddings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    embedding_vector REAL[],
    face_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_name ON students(name);

-- Create unique constraint for daily attendance
CREATE UNIQUE INDEX idx_unique_daily_attendance 
ON attendance(student_id, date) 
WHERE status = 'Present';

-- Insert sample data
INSERT INTO classes (name, subject, room, period, time_slot, teacher_name) VALUES
('Mathematics 101', 'Mathematics', 'Room 204', '1st Period', '8:00 AM - 9:00 AM', 'Mrs. Sharma'),
('Advanced Algebra', 'Mathematics', 'Room 204', '3rd Period', '10:30 AM - 11:30 AM', 'Mr. Patel'),
('Geometry Basics', 'Mathematics', 'Room 204', '5th Period', '1:00 PM - 2:00 PM', 'Ms. Gupta'),
('Statistics', 'Mathematics', 'Room 204', '7th Period', '3:00 PM - 4:00 PM', 'Dr. Singh');

INSERT INTO students (name, classroom, class_id, student_roll_number, parent_email, parent_phone) VALUES
('Priya Sharma', 'A-203', 1, 'MATH001', 'parent1@example.com', '+91-9876543210'),
('Arjun Patel', 'A-203', 1, 'MATH002', 'parent2@example.com', '+91-9876543211'),
('Kavya Reddy', 'A-203', 1, 'MATH003', 'parent3@example.com', '+91-9876543212'),
('Rohan Singh', 'A-203', 1, 'MATH004', 'parent4@example.com', '+91-9876543213'),
('Ananya Gupta', 'A-203', 1, 'MATH005', 'parent5@example.com', '+91-9876543214'),
('Vikram Kumar', 'A-203', 2, 'ALG001', 'parent6@example.com', '+91-9876543215'),
('Sneha Joshi', 'A-203', 2, 'ALG002', 'parent7@example.com', '+91-9876543216'),
('Rahul Verma', 'A-203', 2, 'ALG003', 'parent8@example.com', '+91-9876543217');

INSERT INTO parents (name, email, phone, student_ids) VALUES
('Mr. Sharma', 'parent1@example.com', '+91-9876543210', ARRAY[1]),
('Mrs. Patel', 'parent2@example.com', '+91-9876543211', ARRAY[2]),
('Mr. Reddy', 'parent3@example.com', '+91-9876543212', ARRAY[3]),
('Mrs. Singh', 'parent4@example.com', '+91-9876543213', ARRAY[4]),
('Mr. Gupta', 'parent5@example.com', '+91-9876543214', ARRAY[5]);

INSERT INTO teachers (name, email, phone, class_ids) VALUES
('Mrs. Sharma', 'teacher1@school.edu', '+91-9876543201', ARRAY[1]),
('Mr. Patel', 'teacher2@school.edu', '+91-9876543202', ARRAY[2]),
('Ms. Gupta', 'teacher3@school.edu', '+91-9876543203', ARRAY[3]),
('Dr. Singh', 'teacher4@school.edu', '+91-9876543204', ARRAY[4]);

-- Create views for easy querying
CREATE VIEW attendance_summary AS
SELECT 
    s.name as student_name,
    s.classroom,
    c.name as class_name,
    c.subject,
    a.date,
    a.time,
    a.status
FROM attendance a
JOIN students s ON a.student_id = s.id
JOIN classes c ON a.class_id = c.id
ORDER BY a.date DESC, a.time DESC;

CREATE VIEW student_attendance_stats AS
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.classroom,
    COUNT(a.id) as total_days,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
    ROUND(
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / COUNT(a.id), 2
    ) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.name, s.classroom;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_student_attendance(student_name VARCHAR, class_id INTEGER)
RETURNS TABLE (
    date DATE,
    time TIME,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.date, a.time, a.status
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE s.name = student_name AND a.class_id = class_id
    ORDER BY a.date DESC, a.time DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE attendify TO your_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
