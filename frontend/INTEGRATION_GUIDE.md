# RadFlow Compass - Full Stack Integration Guide

This guide will help you set up the complete RadFlow Compass application with both frontend and backend integrated with MySQL database.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Quick Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd radflow-compass/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env file with your MySQL credentials

# Set up MySQL database
mysql -u root -p < database/schema.sql

# Start backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (root of radflow-compass)
cd radflow-compass

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Environment Configuration

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=radflow_compass

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=radflow_compass_super_secret_jwt_key_2025
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE radflow_compass;
   ```

2. **Run Schema:**
   ```bash
   mysql -u root -p radflow_compass < backend/database/schema.sql
   ```

3. **Verify Setup:**
   ```sql
   USE radflow_compass;
   SHOW TABLES;
   SELECT * FROM users;
   SELECT * FROM patients;
   ```

## Demo Users

The system comes with pre-configured demo users:

| Username    | Password | Role        | Name                |
|-------------|----------|-------------|---------------------|
| consultant  | demo123  | Consultant  | Dr. Sarah Johnson   |
| resident    | demo123  | Resident    | Dr. Michael Chen    |
| physicist   | demo123  | Physicist   | Dr. Emily Rodriguez |
| radiographer| demo123  | Radiographer| John Smith          |

## Testing the Integration

### 1. Health Check
Visit `http://localhost:5000/health` - should return:
```json
{
  "status": "OK",
  "timestamp": "2025-01-21T...",
  "environment": "development"
}
```

### 2. Frontend Login
1. Go to `http://localhost:5173`
2. Use any demo credentials to login
3. You should see the dashboard with patient data

### 3. API Testing
Test the API endpoints using curl or Postman:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"consultant","password":"demo123"}'

# Get patients (requires token from login)
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Features

### ✅ Completed Integration
- **Authentication**: JWT-based login/logout
- **Patient Management**: CRUD operations via API
- **Workflow Stages**: Update patient stages
- **Role-based Access**: Different views for different roles
- **Real-time Updates**: Data refreshes after changes
- **Error Handling**: Proper error messages and loading states

### 🔄 Data Flow
1. **Frontend** → API calls → **Backend** → **MySQL Database**
2. **Authentication** → JWT tokens → Protected routes
3. **Real-time Updates** → API calls → Database updates → UI refresh

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in backend `.env`
   - Ensure database exists

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check frontend is running on correct port

3. **API Connection Failed**
   - Verify backend is running on port 5000
   - Check `VITE_API_URL` in frontend `.env`
   - Test backend health endpoint

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token format in network tab

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in backend `.env`

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use environment variables for all secrets
3. Set up proper MySQL production database
4. Use PM2 or similar for process management

### Frontend
1. Build for production: `npm run build`
2. Serve static files with nginx or similar
3. Update API URL for production backend

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `GET /api/patients/role/:role` - Get patients by role
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Add new patient
- `PUT /api/patients/:id/stage` - Update patient stage

### Health Check
- `GET /health` - Server health status

## Support

If you encounter issues:
1. Check the console logs in browser and terminal
2. Verify all environment variables are set correctly
3. Ensure MySQL is running and accessible
4. Test API endpoints individually

The integration maintains the same UI and functionality as the original localStorage version while providing a robust backend with persistent data storage.
