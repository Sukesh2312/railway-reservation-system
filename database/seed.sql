USE railway_reservation;

-- Pre-generated bcrypt hash for password: admin123
INSERT INTO admins (name,email,password_hash) VALUES
('System Admin','admin@railway.com','$2a$10$wzYhVGR6fJ6RIX0x7SMf7ep0VO5Vf2Xf4j8zYPrM6rM6Hx0tKiKX2');

-- Pre-generated bcrypt hash for password: user123
INSERT INTO users (name,email,password_hash,phone,role) VALUES
('Rahul Sharma','rahul@example.com','$2a$10$wzYhVGR6fJ6RIX0x7SMf7ep0VO5Vf2Xf4j8zYPrM6rM6Hx0tKiKX2','9999999999','user');

INSERT INTO stations (station_code,station_name,city) VALUES
('NDLS','New Delhi','Delhi'),
('BCT','Mumbai Central','Mumbai'),
('HWH','Howrah','Kolkata'),
('MAS','Chennai Central','Chennai');

INSERT INTO trains (train_number,train_name,source_station,destination_station,departure_time,arrival_time,total_seats,status) VALUES
('12627','Karnataka Express','New Delhi','Bangalore','2026-05-10 20:00:00','2026-05-11 22:00:00',500,'ACTIVE'),
('12951','Rajdhani Express','Mumbai','New Delhi','2026-05-10 16:00:00','2026-05-11 08:00:00',450,'ACTIVE'),
('12840','Howrah Mail','Kolkata','Chennai','2026-05-10 18:30:00','2026-05-11 20:30:00',420,'ACTIVE');

INSERT INTO seat_availability (train_id,class_type,total_seats,available_seats,waiting_list_count) VALUES
(1,'SL',250,180,5),(1,'3A',120,70,1),(1,'2A',80,45,0),(1,'1A',50,30,0),
(2,'SL',220,140,4),(2,'3A',120,65,2),(2,'2A',70,40,1),(2,'1A',40,22,0),
(3,'SL',210,150,3),(3,'3A',110,75,0),(3,'2A',70,50,0),(3,'1A',30,20,0);

INSERT INTO platforms (platform_number,status,congestion_score,available_from) VALUES
('1','FREE',30,'2026-05-10 08:00:00'),
('2','FREE',45,'2026-05-10 08:00:00'),
('3','FREE',50,'2026-05-10 08:00:00'),
('4','FREE',20,'2026-05-10 08:00:00');

INSERT INTO train_schedule (train_id,run_date,expected_arrival,expected_departure,delay_minutes) VALUES
(1,'2026-05-10','2026-05-10 19:50:00','2026-05-10 20:00:00',0),
(2,'2026-05-10','2026-05-10 15:45:00','2026-05-10 16:00:00',5),
(3,'2026-05-10','2026-05-10 18:15:00','2026-05-10 18:30:00',0);

INSERT INTO train_popularity (train_id,route_key,booking_frequency,weekend_traffic_score,seasonal_rush_score) VALUES
(1,'Delhi-Bangalore',530,82,79),
(2,'Mumbai-Delhi',610,88,84),
(3,'Kolkata-Chennai',420,68,72);

INSERT INTO congestion_logs (station_id,train_id,crowd_index) VALUES
(1,1,72.5),(2,2,80.0),(3,3,64.5),(4,3,58.0);
