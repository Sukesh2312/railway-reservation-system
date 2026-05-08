USE railway_reservation;

-- Reset transactional tables for repeatable viva/demo
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE passengers;
TRUNCATE TABLE cancellations;
TRUNCATE TABLE bookings;
TRUNCATE TABLE platform_assignments;
TRUNCATE TABLE prediction_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- Restore seat availability baseline
DELETE FROM seat_availability;
INSERT INTO seat_availability (train_id,class_type,total_seats,available_seats,waiting_list_count) VALUES
(1,'SL',250,180,5),(1,'3A',120,70,1),(1,'2A',80,45,0),(1,'1A',50,30,0),
(2,'SL',220,140,4),(2,'3A',120,65,2),(2,'2A',70,40,1),(2,'1A',40,22,0),
(3,'SL',210,150,3),(3,'3A',110,75,0),(3,'2A',70,50,0),(3,'1A',30,20,0);

-- Reset platform occupancy
UPDATE platforms
SET status = 'FREE', current_train_id = NULL, available_from = NOW();
