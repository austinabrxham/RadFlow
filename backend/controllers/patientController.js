import pool from '../config/database.js';

// Get all patients with their stages
export const getAllPatients = async (req, res) => {
  try {
    // First get all patients
    const [patients] = await pool.execute(`
      SELECT id, patient_id, name, age, gender, diagnosis, registered_at
      FROM patients 
      ORDER BY registered_at DESC
    `);

    // Then get all stages for all patients
    const [stages] = await pool.execute(`
      SELECT patient_id, stage, status, assigned_to, completed_at, completed_by
      FROM patient_stages
    `);

    // Group stages by patient_id
    const stagesByPatient = {};
    stages.forEach(stage => {
      if (!stagesByPatient[stage.patient_id]) {
        stagesByPatient[stage.patient_id] = {};
      }
      stagesByPatient[stage.patient_id][stage.stage] = {
        status: stage.status,
        assignedTo: stage.assigned_to,
        completedAt: stage.completed_at,
        completedBy: stage.completed_by
      };
    });

    // Combine patients with their stages
    const patientsWithStages = patients.map(patient => ({
      ...patient,
      stages: stagesByPatient[patient.id] || {}
    }));

    res.json(patientsWithStages);
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get patients by role (pending tasks for specific role)
export const getPatientsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Get patients that have pending stages assigned to this role
    const [patients] = await pool.execute(`
      SELECT DISTINCT p.id, p.patient_id, p.name, p.age, p.gender, p.diagnosis, p.registered_at
      FROM patients p
      INNER JOIN patient_stages ps ON p.id = ps.patient_id
      WHERE ps.assigned_to = ? AND ps.status = 'Pending'
      ORDER BY p.registered_at DESC
    `, [role]);

    // Get stages for these patients
    if (patients.length > 0) {
      const patientIds = patients.map(p => p.id);
      const placeholders = patientIds.map(() => '?').join(',');
      
      const [stages] = await pool.execute(`
        SELECT patient_id, stage, status, assigned_to, completed_at, completed_by
        FROM patient_stages
        WHERE patient_id IN (${placeholders})
      `, patientIds);

      // Group stages by patient_id
      const stagesByPatient = {};
      stages.forEach(stage => {
        if (!stagesByPatient[stage.patient_id]) {
          stagesByPatient[stage.patient_id] = {};
        }
        stagesByPatient[stage.patient_id][stage.stage] = {
          status: stage.status,
          assignedTo: stage.assigned_to,
          completedAt: stage.completed_at,
          completedBy: stage.completed_by
        };
      });

      // Combine patients with their stages
      const patientsWithStages = patients.map(patient => ({
        ...patient,
        stages: stagesByPatient[patient.id] || {}
      }));

      res.json(patientsWithStages);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Get patients by role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add new patient
export const addPatient = async (req, res) => {
  try {
    const { patientId, name, age, gender, diagnosis } = req.body;

    if (!patientId || !name || !age || !gender || !diagnosis) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if patient ID already exists
    const [existingPatients] = await pool.execute(
      'SELECT id FROM patients WHERE patient_id = ?',
      [patientId]
    );

    if (existingPatients.length > 0) {
      return res.status(400).json({ error: 'Patient ID already exists' });
    }

    // Insert patient (qr_code removed)
    const [result] = await pool.execute(
      'INSERT INTO patients (patient_id, name, age, gender, diagnosis) VALUES (?, ?, ?, ?, ?)',
      [patientId, name, age, gender, diagnosis]
    );

    // Get the inserted patient's ID
    const [insertedPatient] = await pool.execute(
      'SELECT id FROM patients WHERE patient_id = ?',
      [patientId]
    );
    const patientId_db = insertedPatient[0].id;

    // Insert default stages for the patient
    const stages = [
      { stage: 'Registration', assignedTo: 'Radiographer', status: 'Completed' },
      { stage: 'Mask Moulding', assignedTo: 'Radiographer', status: 'Pending' },
      { stage: 'CT Simulation', assignedTo: 'Radiographer', status: 'Pending' },
      { stage: 'Contouring', assignedTo: 'Resident', status: 'Pending' },
      { stage: 'Approval', assignedTo: 'Consultant', status: 'Pending' },
      { stage: 'Planning', assignedTo: 'Physicist', status: 'Pending' },
      { stage: 'Treatment', assignedTo: 'Radiographer', status: 'Pending' },
      { stage: 'Review', assignedTo: 'Consultant', status: 'Pending' }
    ];

    for (const stage of stages) {
      await pool.execute(
        'INSERT INTO patient_stages (patient_id, stage, status, assigned_to, completed_at, completed_by) VALUES (?, ?, ?, ?, ?, ?)',
        [
          patientId_db,
          stage.stage,
          stage.status,
          stage.assignedTo,
          stage.status === 'Completed' ? new Date() : null,
          stage.status === 'Completed' ? req.user.name : null
        ]
      );
    }

    res.status(201).json({ 
      message: 'Patient added successfully',
      patientId: patientId_db
    });
  } catch (error) {
    console.error('Add patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update patient stage
export const updatePatientStage = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { stage, status } = req.body;

    if (!stage || !status) {
      return res.status(400).json({ error: 'Stage and status are required' });
    }

    const validStages = ['Registration', 'Mask Moulding', 'CT Simulation', 'Contouring', 'Approval', 'Planning', 'Treatment', 'Review'];
    const validStatuses = ['Pending', 'Completed'];

    if (!validStages.includes(stage) || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid stage or status' });
    }

    // Check if patient exists
    const [patients] = await pool.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Update the stage
    const updateData = {
      status,
      completed_at: status === 'Completed' ? new Date() : null,
      completed_by: status === 'Completed' ? req.user.name : null
    };

    await pool.execute(
      'UPDATE patient_stages SET status = ?, completed_at = ?, completed_by = ? WHERE patient_id = ? AND stage = ?',
      [updateData.status, updateData.completed_at, updateData.completed_by, patientId, stage]
    );

    res.json({ message: 'Patient stage updated successfully' });
  } catch (error) {
    console.error('Update patient stage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient
    const [patients] = await pool.execute(`
      SELECT id, patient_id, name, age, gender, diagnosis, registered_at
      FROM patients 
      WHERE id = ?
    `, [patientId]);

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get stages for this patient
    const [stages] = await pool.execute(`
      SELECT stage, status, assigned_to, completed_at, completed_by
      FROM patient_stages
      WHERE patient_id = ?
    `, [patientId]);

    // Group stages
    const stagesObj = {};
    stages.forEach(stage => {
      stagesObj[stage.stage] = {
        status: stage.status,
        assignedTo: stage.assigned_to,
        completedAt: stage.completed_at,
        completedBy: stage.completed_by
      };
    });

    const patient = {
      ...patients[0],
      stages: stagesObj
    };

    res.json(patient);
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
