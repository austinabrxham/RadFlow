import express from 'express';
import { 
  getAllPatients, 
  getPatientsByRole, 
  addPatient, 
  updatePatientStage, 
  getPatientById 
} from '../controllers/patientController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all patients
router.get('/', getAllPatients);

// Get patients by role (pending tasks for specific role)
router.get('/role/:role', getPatientsByRole);

// Get patient by ID
router.get('/:patientId', getPatientById);

// Add new patient (requires authentication)
router.post('/', addPatient);

// Update patient stage (requires authentication)
router.put('/:patientId/stage', updatePatientStage);

export default router;
