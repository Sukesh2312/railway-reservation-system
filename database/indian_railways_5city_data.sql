USE railway_reservation;

-- Optional cleanup for fresh re-import
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE platform_assignments;
TRUNCATE TABLE train_schedule;
TRUNCATE TABLE seat_availability;
TRUNCATE TABLE routes;
TRUNCATE TABLE trains;
TRUNCATE TABLE stations;
TRUNCATE TABLE platforms;
SET FOREIGN_KEY_CHECKS = 1;

-- 1) Stations (5 popular cities)
INSERT INTO stations (station_code, station_name, city) VALUES
('NDLS', 'New Delhi', 'Delhi'),
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai'),
('SBC',  'KSR Bengaluru', 'Bengaluru'),
('MAS',  'Chennai Central', 'Chennai'),
('HWH',  'Howrah Junction', 'Kolkata');

-- 2) Platforms (self-assigned pool)
INSERT INTO platforms (platform_number, status, congestion_score, available_from) VALUES
('1', 'FREE', 22.50, '2026-05-08 05:00:00'),
('2', 'FREE', 30.00, '2026-05-08 05:00:00'),
('3', 'FREE', 18.00, '2026-05-08 05:00:00'),
('4', 'FREE', 40.00, '2026-05-08 05:00:00'),
('5', 'FREE', 28.00, '2026-05-08 05:00:00'),
('6', 'FREE', 35.00, '2026-05-08 05:00:00');

-- 3) Trains
-- One train from each city + return train back to that city (10 total)
INSERT INTO trains
(train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, status)
VALUES
('12952', 'Delhi Mumbai Superfast',      'New Delhi',     'Mumbai',    '2026-05-09 16:30:00', '2026-05-10 08:15:00', 520, 'ACTIVE'),
('12951', 'Mumbai Delhi Superfast',      'Mumbai',        'New Delhi', '2026-05-09 17:10:00', '2026-05-10 09:00:00', 520, 'ACTIVE'),
('22120', 'Mumbai Bengaluru Express',    'Mumbai',        'Bengaluru', '2026-05-09 21:00:00', '2026-05-10 14:20:00', 500, 'ACTIVE'),
('22119', 'Bengaluru Mumbai Express',    'Bengaluru',     'Mumbai',    '2026-05-09 20:45:00', '2026-05-10 13:50:00', 500, 'ACTIVE'),
('12608', 'Bengaluru Chennai Intercity', 'Bengaluru',     'Chennai',   '2026-05-09 06:00:00', '2026-05-09 11:55:00', 420, 'ACTIVE'),
('12607', 'Chennai Bengaluru Intercity', 'Chennai',       'Bengaluru', '2026-05-09 17:30:00', '2026-05-09 23:20:00', 420, 'ACTIVE'),
('12840', 'Chennai Kolkata Mail',        'Chennai',       'Kolkata',   '2026-05-09 19:15:00', '2026-05-10 23:10:00', 530, 'ACTIVE'),
('12839', 'Kolkata Chennai Mail',        'Kolkata',       'Chennai',   '2026-05-09 18:40:00', '2026-05-10 22:30:00', 530, 'ACTIVE'),
('12302', 'Kolkata Delhi Rajdhani',      'Kolkata',       'New Delhi', '2026-05-09 16:55:00', '2026-05-10 09:45:00', 480, 'ACTIVE'),
('12301', 'Delhi Kolkata Rajdhani',      'New Delhi',     'Kolkata',   '2026-05-09 17:20:00', '2026-05-10 10:15:00', 480, 'ACTIVE');

-- 4) Seat availability by class
-- train_id assumed in insert order 1..10
INSERT INTO seat_availability (train_id, class_type, total_seats, available_seats, waiting_list_count) VALUES
(1,'SL',250,180,6),(1,'3A',140,82,2),(1,'2A',90,50,1),(1,'1A',40,20,0),
(2,'SL',250,172,8),(2,'3A',140,79,3),(2,'2A',90,48,1),(2,'1A',40,19,0),
(3,'SL',240,160,7),(3,'3A',140,76,2),(3,'2A',85,44,1),(3,'1A',35,18,0),
(4,'SL',240,158,5),(4,'3A',140,74,2),(4,'2A',85,42,1),(4,'1A',35,17,0),
(5,'SL',220,140,4),(5,'3A',115,62,1),(5,'2A',65,36,0),(5,'1A',20,10,0),
(6,'SL',220,138,3),(6,'3A',115,60,1),(6,'2A',65,34,0),(6,'1A',20,9,0),
(7,'SL',260,176,9),(7,'3A',145,81,3),(7,'2A',90,52,1),(7,'1A',35,16,0),
(8,'SL',260,170,8),(8,'3A',145,78,2),(8,'2A',90,49,1),(8,'1A',35,15,0),
(9,'SL',230,148,6),(9,'3A',140,77,2),(9,'2A',80,45,1),(9,'1A',30,14,0),
(10,'SL',230,145,5),(10,'3A',140,75,2),(10,'2A',80,43,1),(10,'1A',30,13,0);

-- 5) Train schedules
INSERT INTO train_schedule (train_id, run_date, expected_arrival, expected_departure, delay_minutes) VALUES
(1,'2026-05-09','2026-05-09 16:05:00','2026-05-09 16:30:00',5),
(2,'2026-05-09','2026-05-09 16:45:00','2026-05-09 17:10:00',8),
(3,'2026-05-09','2026-05-09 20:35:00','2026-05-09 21:00:00',2),
(4,'2026-05-09','2026-05-09 20:15:00','2026-05-09 20:45:00',0),
(5,'2026-05-09','2026-05-09 05:40:00','2026-05-09 06:00:00',0),
(6,'2026-05-09','2026-05-09 17:10:00','2026-05-09 17:30:00',3),
(7,'2026-05-09','2026-05-09 18:55:00','2026-05-09 19:15:00',6),
(8,'2026-05-09','2026-05-09 18:20:00','2026-05-09 18:40:00',4),
(9,'2026-05-09','2026-05-09 16:35:00','2026-05-09 16:55:00',1),
(10,'2026-05-09','2026-05-09 17:00:00','2026-05-09 17:20:00',0);

-- 6) Platform assignments (manual/self-assigned)
-- assigned_by can be NULL if no admin row yet
INSERT INTO platform_assignments
(train_id, platform_id, arrival_time, departure_time, status, assigned_by)
VALUES
(1, 1, '2026-05-09 16:05:00', '2026-05-09 16:30:00', 'MANUAL', NULL),
(2, 2, '2026-05-09 16:45:00', '2026-05-09 17:10:00', 'MANUAL', NULL),
(3, 4, '2026-05-09 20:35:00', '2026-05-09 21:00:00', 'MANUAL', NULL),
(4, 3, '2026-05-09 20:15:00', '2026-05-09 20:45:00', 'MANUAL', NULL),
(5, 5, '2026-05-09 05:40:00', '2026-05-09 06:00:00', 'MANUAL', NULL),
(6, 6, '2026-05-09 17:10:00', '2026-05-09 17:30:00', 'MANUAL', NULL),
(7, 2, '2026-05-09 18:55:00', '2026-05-09 19:15:00', 'MANUAL', NULL),
(8, 1, '2026-05-09 18:20:00', '2026-05-09 18:40:00', 'MANUAL', NULL),
(9, 3, '2026-05-09 16:35:00', '2026-05-09 16:55:00', 'MANUAL', NULL),
(10,4, '2026-05-09 17:00:00', '2026-05-09 17:20:00', 'MANUAL', NULL);

-- Update platform live status based on latest assignment
UPDATE platforms p
JOIN (
  SELECT platform_id, train_id, departure_time
  FROM platform_assignments
  WHERE id IN (
    SELECT MAX(id) FROM platform_assignments GROUP BY platform_id
  )
) x ON p.id = x.platform_id
SET p.current_train_id = x.train_id,
    p.available_from = x.departure_time,
    p.status = 'ASSIGNED';

-- 7) Optional popularity + congestion data for analytics dashboards
INSERT INTO train_popularity (train_id, route_key, booking_frequency, weekend_traffic_score, seasonal_rush_score) VALUES
(1, 'Delhi-Mumbai', 820, 88.0, 84.0),
(2, 'Mumbai-Delhi', 790, 86.5, 82.0),
(3, 'Mumbai-Bengaluru', 640, 79.0, 75.5),
(4, 'Bengaluru-Mumbai', 625, 78.0, 74.0),
(5, 'Bengaluru-Chennai', 560, 73.0, 71.0),
(6, 'Chennai-Bengaluru', 545, 72.0, 70.0),
(7, 'Chennai-Kolkata', 610, 76.5, 77.0),
(8, 'Kolkata-Chennai', 600, 75.0, 76.0),
(9, 'Kolkata-Delhi', 700, 82.0, 80.0),
(10,'Delhi-Kolkata', 715, 83.5, 81.0);

INSERT INTO congestion_logs (station_id, train_id, crowd_index) VALUES
(1, 1, 78.5),
(2, 3, 74.0),
(3, 5, 66.5),
(4, 7, 71.0),
(5, 9, 76.5);
