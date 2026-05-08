CREATE DATABASE IF NOT EXISTS railway_reservation;
USE railway_reservation;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  station_code VARCHAR(20) UNIQUE NOT NULL,
  station_name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL
);

CREATE TABLE trains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_number VARCHAR(20) UNIQUE NOT NULL,
  train_name VARCHAR(120) NOT NULL,
  source_station VARCHAR(100) NOT NULL,
  destination_station VARCHAR(100) NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  total_seats INT NOT NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
);

CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  station_id INT NOT NULL,
  stop_order INT NOT NULL,
  arrival_time DATETIME,
  departure_time DATETIME,
  FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  train_id INT NOT NULL,
  pnr_number VARCHAR(20) UNIQUE NOT NULL,
  journey_date DATE NOT NULL,
  class_type VARCHAR(10) NOT NULL,
  seats_booked INT NOT NULL CHECK (seats_booked > 0),
  booking_status ENUM('CONFIRMED','WAITLIST','CANCELLED') DEFAULT 'CONFIRMED',
  payment_status ENUM('PENDING','PAID') DEFAULT 'PENDING',
  fare_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE passengers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  age INT,
  gender VARCHAR(20),
  seat_number VARCHAR(20),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30),
  payment_status ENUM('SUCCESS','FAILED','REFUNDED') DEFAULT 'SUCCESS',
  transaction_id VARCHAR(50),
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE seat_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  class_type VARCHAR(10) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  waiting_list_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY train_class_unique (train_id,class_type),
  FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

CREATE TABLE cancellations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  refund_amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(255),
  cancelled_by INT,
  cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (cancelled_by) REFERENCES users(id)
);

CREATE TABLE platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform_number VARCHAR(10) UNIQUE NOT NULL,
  status ENUM('FREE','ASSIGNED','MAINTENANCE') DEFAULT 'FREE',
  current_train_id INT NULL,
  congestion_score DECIMAL(5,2) DEFAULT 0,
  available_from DATETIME NULL,
  FOREIGN KEY (current_train_id) REFERENCES trains(id)
);

CREATE TABLE platform_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  platform_id INT NOT NULL,
  arrival_time DATETIME NOT NULL,
  departure_time DATETIME NOT NULL,
  status ENUM('AUTO','MANUAL') DEFAULT 'AUTO',
  assigned_by INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (train_id) REFERENCES trains(id),
  FOREIGN KEY (platform_id) REFERENCES platforms(id),
  FOREIGN KEY (assigned_by) REFERENCES admins(id)
);

CREATE TABLE booking_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  total_bookings INT DEFAULT 0,
  occupancy_percent DECIMAL(5,2) DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  cancellation_rate DECIMAL(5,2) DEFAULT 0,
  peak_booking_hour INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE prediction_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  predicted_fill_time VARCHAR(100),
  best_booking_time VARCHAR(120),
  demand_level ENUM('HIGH','LOW') NOT NULL,
  fill_speed DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE train_popularity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  route_key VARCHAR(120) NOT NULL,
  booking_frequency INT DEFAULT 0,
  weekend_traffic_score DECIMAL(5,2) DEFAULT 0,
  seasonal_rush_score DECIMAL(5,2) DEFAULT 0,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE congestion_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  station_id INT NOT NULL,
  train_id INT,
  crowd_index DECIMAL(5,2) NOT NULL,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id),
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE train_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  run_date DATE NOT NULL,
  expected_arrival DATETIME NOT NULL,
  expected_departure DATETIME NOT NULL,
  delay_minutes INT DEFAULT 0,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);
