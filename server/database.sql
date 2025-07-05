
-- Create database
CREATE DATABASE IF NOT EXISTS techzeon_events;
USE techzeon_events;

-- Create tables
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  category VARCHAR(50),
  capacity INT NOT NULL DEFAULT 0,
  price VARCHAR(50) DEFAULT 'Free',
  image_url VARCHAR(512),
  status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  dietary_restrictions TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  ticket_id VARCHAR(50),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert initial admin user
INSERT INTO users (name, email, password, role) VALUES 
('Administrator', 'admin@techzeon.com', 'admin123', 'admin');

-- Insert sample events
INSERT INTO events (title, description, date, start_time, end_time, location, address, category, capacity, price, image_url, status) VALUES 
(
  'Tech Innovation Summit 2023', 
  'Join us for the most anticipated tech event of the year, where innovation meets opportunity.',
  '2023-09-15', 
  '09:00:00', 
  '18:00:00', 
  'TechZeon Campus, Building A', 
  '123 Innovation Street, Silicon Valley, CA 94043', 
  'Conference', 
  200, 
  'Free', 
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070', 
  'upcoming'
),
(
  'AI Workshop: Deep Learning Fundamentals', 
  'Learn the basics of deep learning and neural networks in this hands-on workshop.',
  '2023-10-05', 
  '13:00:00', 
  '17:00:00', 
  'Lab 4, Tech Building', 
  '456 AI Avenue, Silicon Valley, CA 94043', 
  'Workshop', 
  50, 
  '$99', 
  'https://images.unsplash.com/photo-1534366428904-e54f549e1aa4?auto=format&fit=crop&q=80&w=2070', 
  'upcoming'
),
(
  'Mobile App Development Bootcamp', 
  'A three-day intensive bootcamp covering the latest mobile app development technologies.',
  '2023-10-12', 
  '09:00:00', 
  '16:00:00', 
  'Innovation Hub', 
  '789 Developer Lane, Silicon Valley, CA 94043', 
  'Bootcamp', 
  50, 
  '$299', 
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070', 
  'upcoming'
),
(
  'Cybersecurity: Threats & Solutions', 
  'Learn about the latest cybersecurity threats and how to protect your organization.',
  '2023-10-20', 
  '14:00:00', 
  '18:00:00', 
  'Auditorium C', 
  '101 Security Blvd, Silicon Valley, CA 94043', 
  'Seminar', 
  100, 
  '$49', 
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2034', 
  'upcoming'
),
(
  'Web Development Workshop', 
  'A workshop on modern web development techniques and frameworks.',
  '2023-08-10', 
  '09:00:00', 
  '17:00:00', 
  'Room 402, Computing Building', 
  '202 Web Lane, Silicon Valley, CA 94043', 
  'Workshop', 
  50, 
  '$79', 
  'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=2074', 
  'completed'
);

-- Insert sample registrations
INSERT INTO registrations (event_id, first_name, last_name, email, phone, organization, ticket_id, status) VALUES 
(1, 'John', 'Doe', 'john.doe@example.com', '555-123-4567', 'Acme Corp', 'TZ-2023-95843', 'confirmed'),
(1, 'Jane', 'Smith', 'jane.smith@example.com', '555-987-6543', 'Tech Solutions Inc', 'TZ-2023-95844', 'confirmed'),
(2, 'Michael', 'Johnson', 'michael.j@example.com', '555-555-5555', 'Data Science LLC', 'TZ-2023-95845', 'confirmed'),
(3, 'Sarah', 'Williams', 'sarah.w@example.com', '555-222-3333', 'Mobile Innovations', 'TZ-2023-97321', 'pending'),
(5, 'David', 'Brown', 'david.b@example.com', '555-444-7777', 'Web Experts', 'TZ-2023-87245', 'confirmed');
