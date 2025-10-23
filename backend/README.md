# RadFlow Compass Backend

Backend API for RadFlow Compass - Radiation Therapy Workflow Management System.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Patient Management**: CRUD operations for patients and workflow stages
- **Database**: MySQL database with optimized queries
- **Security**: Helmet, CORS, rate limiting, and input validation
- **API**: RESTful API endpoints for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd radflow-compass/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=radflow_compass

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up MySQL database:**
   ```bash
   # Create database and tables
   mysql -u root -p < database/schema.sql
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - Get all patients (protected)
- `GET /api/patients/role/:role` - Get patients by role (protected)
- `GET /api/patients/:patientId` - Get patient by ID (protected)
- `POST /api/patients` - Add new patient (protected)
- `PUT /api/patients/:patientId/stage` - Update patient stage (protected)

### Health Check
- `GET /health` - Server health check

## Database Schema

The application uses the following main tables:

- **users**: User accounts with roles (Consultant, Resident, Physicist, Radiographer)
- **patients**: Patient information and basic details
- **patient_stages**: Workflow stages for each patient

## Demo Users

The system comes with pre-configured demo users:

| Username    | Password | Role        | Name                |
|-------------|----------|-------------|---------------------|
| consultant  | demo123  | Consultant  | Dr. Sarah Johnson   |
| resident    | demo123  | Resident    | Dr. Michael Chen    |
| physicist   | demo123  | Physicist   | Dr. Emily Rodriguez |
| radiographer| demo123  | Radiographer| John Smith          |

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Helmet for security headers
- Input validation and sanitization

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── patientController.js # Patient management logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── patients.js          # Patient routes
├── database/
│   └── schema.sql           # Database schema
├── server.js                # Main server file
└── package.json
```

### Adding New Features

1. Create controller functions in the appropriate controller file
2. Add routes in the corresponding route file
3. Update the main server.js file if needed
4. Test the endpoints using tools like Postman or curl

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists and schema is loaded

2. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - Check if frontend is running on the correct port

3. **Authentication Issues**
   - Verify JWT_SECRET is set in `.env`
   - Check token format in Authorization header: `Bearer <token>`

## License

MIT License - see LICENSE file for details.
