
# TechZeon Events Database Setup

This directory contains the server-side code and database setup for the TechZeon Events platform.

## Setup Instructions

### 1. Database Setup

1. Install MariaDB or MySQL on your system
2. Log in to the database:
   ```
   mysql -u root -p
   ```
3. Run the SQL script to create the database and tables:
   ```
   source path/to/database.sql
   ```

### 2. Server Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Configure environment variables by creating a `.env` file (or modify the existing one):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=techzeon_events
   PORT=5000
   ```
3. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Registrations

- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create a new registration

### Authentication

- `POST /api/auth/login` - User login

## Default Admin Credentials

- Email: `admin@techzeon.com`
- Password: `admin123`
