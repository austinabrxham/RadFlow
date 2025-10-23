-- RadFlow Compass Database Schema
-- MySQL Database for Radiation Therapy Workflow Management

CREATE DATABASE IF NOT EXISTS radflow_compass;
USE radflow_compass;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Consultant', 'Resident', 'Physicist', 'Radiographer') NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    diagnosis TEXT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patient stages table (normalized approach for better querying)
CREATE TABLE patient_stages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id VARCHAR(36) NOT NULL,
    stage ENUM('Registration', 'Mask Moulding', 'CT Simulation', 'Contouring', 'Approval', 'Planning', 'Treatment', 'Review') NOT NULL,
    status ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Pending',
    assigned_to ENUM('Consultant', 'Resident', 'Physicist', 'Radiographer') NOT NULL,
    completed_at TIMESTAMP NULL,
    completed_by VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    UNIQUE KEY unique_patient_stage (patient_id, stage)
);

-- Insert demo users
INSERT INTO users (id, username, password, role, name) VALUES
('1', 'consultant', '$2b$10$rQZ8K9mP2nL3oI7uY6vBwOeF4gH8jK2lM5nP7qR9sT1uV3wX5yZ8', 'Consultant', 'Dr. Sarah Johnson'),
('2', 'resident', '$2b$10$rQZ8K9mP2nL3oI7uY6vBwOeF4gH8jK2lM5nP7qR9sT1uV3wX5yZ8', 'Resident', 'Dr. Michael Chen'),
('3', 'physicist', '$2b$10$rQZ8K9mP2nL3oI7uY6vBwOeF4gH8jK2lM5nP7qR9sT1uV3wX5yZ8', 'Physicist', 'Dr. Emily Rodriguez'),
('4', 'radiographer', '$2b$10$rQZ8K9mP2nL3oI7uY6vBwOeF4gH8jK2lM5nP7qR9sT1uV3wX5yZ8', 'Radiographer', 'John Smith');

-- Insert sample patients
INSERT INTO patients (id, patient_id, name, age, gender, diagnosis, registered_at) VALUES
('p1', 'RT2025001', 'Robert Anderson', 58, 'Male', 'Prostate Cancer', '2025-01-15 10:00:00'),
('p2', 'RT2025002', 'Maria Garcia', 45, 'Female', 'Breast Cancer', '2025-01-18 10:00:00'),
('p3', 'RT2025003', 'James Wilson', 62, 'Male', 'Lung Cancer', '2025-01-20 10:00:00');

-- Insert patient stages for sample patients
INSERT INTO patient_stages (patient_id, stage, status, assigned_to, completed_at, completed_by) VALUES
-- Robert Anderson stages
('p1', 'Registration', 'Completed', 'Radiographer', '2025-01-15 10:00:00', 'John Smith'),
('p1', 'Mask Moulding', 'Completed', 'Radiographer', '2025-01-16 14:00:00', 'John Smith'),
('p1', 'CT Simulation', 'Completed', 'Radiographer', '2025-01-17 11:00:00', 'John Smith'),
('p1', 'Contouring', 'Completed', 'Resident', '2025-01-19 16:00:00', 'Dr. Michael Chen'),
('p1', 'Approval', 'Completed', 'Consultant', '2025-01-20 09:00:00', 'Dr. Sarah Johnson'),
('p1', 'Planning', 'Pending', 'Physicist', NULL, NULL),
('p1', 'Treatment', 'Pending', 'Radiographer', NULL, NULL),
('p1', 'Review', 'Pending', 'Consultant', NULL, NULL),

-- Maria Garcia stages
('p2', 'Registration', 'Completed', 'Radiographer', '2025-01-18 10:00:00', 'John Smith'),
('p2', 'Mask Moulding', 'Completed', 'Radiographer', '2025-01-19 14:00:00', 'John Smith'),
('p2', 'CT Simulation', 'Pending', 'Radiographer', NULL, NULL),
('p2', 'Contouring', 'Pending', 'Resident', NULL, NULL),
('p2', 'Approval', 'Pending', 'Consultant', NULL, NULL),
('p2', 'Planning', 'Pending', 'Physicist', NULL, NULL),
('p2', 'Treatment', 'Pending', 'Radiographer', NULL, NULL),
('p2', 'Review', 'Pending', 'Consultant', NULL, NULL),

-- James Wilson stages
('p3', 'Registration', 'Completed', 'Radiographer', '2025-01-20 10:00:00', 'John Smith'),
('p3', 'Mask Moulding', 'Pending', 'Radiographer', NULL, NULL),
('p3', 'CT Simulation', 'Pending', 'Radiographer', NULL, NULL),
('p3', 'Contouring', 'Pending', 'Resident', NULL, NULL),
('p3', 'Approval', 'Pending', 'Consultant', NULL, NULL),
('p3', 'Planning', 'Pending', 'Physicist', NULL, NULL),
('p3', 'Treatment', 'Pending', 'Radiographer', NULL, NULL),
('p3', 'Review', 'Pending', 'Consultant', NULL, NULL);

-- Create indexes for better performance
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patient_stages_patient_id ON patient_stages(patient_id);
CREATE INDEX idx_patient_stages_stage ON patient_stages(stage);
CREATE INDEX idx_patient_stages_status ON patient_stages(status);
CREATE INDEX idx_patient_stages_assigned_to ON patient_stages(assigned_to);
CREATE INDEX idx_users_username ON users(username);
