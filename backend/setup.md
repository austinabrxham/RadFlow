# Backend Setup Instructions

## Quick Setup Guide

### 1. Install Dependencies
```bash
cd radflow-compass/backend
npm install
```

### 2. Create Environment File
Create a `.env` file in the `backend` directory with the following content:

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

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### 3. Set Up MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Connect to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql
```

#### Option B: Using MySQL Workbench or phpMyAdmin
1. Open MySQL Workbench or phpMyAdmin
2. Create a new database named `radflow_compass`
3. Run the SQL commands from `database/schema.sql`

### 4. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the Setup
Visit `http://localhost:5000/health` in your browser. You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-21T...",
  "environment": "development"
}
```

## Demo Users
The system comes with pre-configured demo users:

| Username    | Password | Role        |
|-------------|----------|-------------|
| consultant  | demo123  | Consultant  |
| resident    | demo123  | Resident    |
| physicist   | demo123  | Physicist   |
| radiographer| demo123  | Radiographer|

## Troubleshooting

### Database Connection Issues
- Make sure MySQL is running
- Check your MySQL password in the `.env` file
- Verify the database `radflow_compass` exists

### Port Already in Use
- Change the `PORT` in your `.env` file to a different port (e.g., 5001)
- Or stop the process using port 5000

### CORS Issues
- Make sure your frontend is running on `http://localhost:5173`
- Or update the `FRONTEND_URL` in your `.env` file
