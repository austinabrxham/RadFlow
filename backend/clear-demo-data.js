#!/usr/bin/env node

// Script to clear demo patient data for testing
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function clearDemoData() {
  console.log('🧹 Clearing demo patient data...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'radflow_compass'
    });

    // Clear patient stages first (due to foreign key constraint)
    await connection.execute('DELETE FROM patient_stages');
    console.log('✅ Cleared patient_stages table');

    // Clear patients
    await connection.execute('DELETE FROM patients');
    console.log('✅ Cleared patients table');

    // Keep users table intact
    console.log('✅ Users table preserved');

    await connection.end();
    console.log('\n🎉 Demo data cleared successfully!');
    console.log('You can now test adding new patients without ID conflicts.');

  } catch (error) {
    console.error('❌ Error clearing demo data:', error.message);
  }
}

clearDemoData();
