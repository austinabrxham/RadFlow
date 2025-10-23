#!/usr/bin/env node

// Simple test script to verify backend setup
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testSetup() {
  console.log('🧪 Testing RadFlow Compass Backend Setup...\n');

  // Test 1: Database Connection
  console.log('1. Testing database connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'radflow_compass'
    });

    console.log('✅ Database connection successful');
    await connection.end();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('   Please check your MySQL credentials and ensure the database exists');
    return;
  }

  // Test 2: Check Tables
  console.log('\n2. Checking database tables...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'radflow_compass'
    });

    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    const expectedTables = ['users', 'patients', 'patient_stages'];
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist:', tableNames.join(', '));
    } else {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('   Please run the schema.sql file to create the tables');
      await connection.end();
      return;
    }

    // Test 3: Check Demo Data
    console.log('\n3. Checking demo data...');
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [patients] = await connection.execute('SELECT COUNT(*) as count FROM patients');
    const [stages] = await connection.execute('SELECT COUNT(*) as count FROM patient_stages');

    console.log(`✅ Users: ${users[0].count} records`);
    console.log(`✅ Patients: ${patients[0].count} records`);
    console.log(`✅ Patient Stages: ${stages[0].count} records`);

    if (users[0].count === 0) {
      console.log('⚠️  No users found. Demo users should be created by schema.sql');
    }

    await connection.end();
  } catch (error) {
    console.log('❌ Table check failed:', error.message);
    return;
  }

  // Test 4: Environment Variables
  console.log('\n4. Checking environment variables...');
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.log('⚠️  Missing environment variables:', missingEnvVars.join(', '));
    console.log('   Please check your .env file');
  }

  console.log('\n🎉 Backend setup test completed!');
  console.log('\nNext steps:');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Test the health endpoint: http://localhost:5000/health');
  console.log('3. Start the frontend and test login');
}

testSetup().catch(console.error);
