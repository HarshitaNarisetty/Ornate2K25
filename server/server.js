
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'sriniVasu$45',
  database: process.env.DB_NAME || 'techzeon_events',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// API Routes
// Events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { 
      title, description, date, startTime, endTime, 
      location, address, category, capacity, price, imageUrl 
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO events (title, description, date, start_time, end_time, 
        location, address, category, capacity, price, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, startTime, endTime, location, address, category, capacity, price, imageUrl]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Event created successfully' 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { 
      title, description, date, startTime, endTime, 
      location, address, category, capacity, price, imageUrl 
    } = req.body;
    
    const [result] = await pool.query(
      `UPDATE events 
       SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?,
           location = ?, address = ?, category = ?, capacity = ?, price = ?, image_url = ?
       WHERE id = ?`,
      [title, description, date, startTime, endTime, location, address, category, capacity, price, imageUrl, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, e.title as event_title 
      FROM registrations r
      JOIN events e ON r.event_id = e.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const { 
      event_id, first_name, last_name, email, phone, 
      organization, dietary_restrictions 
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO registrations 
        (event_id, first_name, last_name, email, phone, organization, dietary_restrictions, status, registration_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', NOW())`,
      [event_id, first_name, last_name, email, phone, organization, dietary_restrictions]
    );
    
    // Generate ticket ID
    const ticketId = `TZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    await pool.query(
      'UPDATE registrations SET ticket_id = ? WHERE id = ?',
      [ticketId, result.insertId]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      ticket_id: ticketId,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Authentication (simple implementation for demonstration)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For admin login
    if (email === 'admin@techzeon.com' && password === 'admin123') {
      return res.json({ 
        user: { id: 1, email, name: 'Administrator', role: 'admin' },
        message: 'Admin login successful' 
      });
    }
    
    // For regular users (in a real app, you should hash passwords)
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    res.json({ 
      user: { id: user.id, email: user.email, name: user.name, role: 'user' },
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
