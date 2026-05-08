USE railway_reservation;

-- 1) List all tables
SHOW TABLES;

-- 2) Users/Admins
SELECT id, name, email, role, created_at FROM users ORDER BY id DESC;
SELECT id, name, email, created_at FROM admins ORDER BY id DESC;

-- 3) Trains and seat status
SELECT id, train_number, train_name, source_station, destination_station, status FROM trains ORDER BY id;
SELECT train_id, class_type, total_seats, available_seats, waiting_list_count, updated_at
FROM seat_availability
ORDER BY train_id, class_type;

-- 4) Booking flow proof
SELECT id, pnr_number, user_id, train_id, class_type, seats_booked, booking_status, payment_status, fare_amount, created_at
FROM bookings
ORDER BY id DESC;

SELECT id, booking_id, amount, payment_method, payment_status, transaction_id, paid_at
FROM payments
ORDER BY id DESC;

SELECT id, booking_id, refund_amount, reason, cancelled_by, cancelled_at
FROM cancellations
ORDER BY id DESC;

-- 5) Platform and schedule proof
SELECT id, platform_number, status, current_train_id, congestion_score, available_from
FROM platforms
ORDER BY id;

SELECT pa.id, t.train_number, p.platform_number, pa.arrival_time, pa.departure_time, pa.status, pa.assigned_at
FROM platform_assignments pa
JOIN trains t ON pa.train_id = t.id
JOIN platforms p ON pa.platform_id = p.id
ORDER BY pa.id DESC;

SELECT ts.id, t.train_number, t.train_name, ts.run_date, ts.expected_arrival, ts.expected_departure, ts.delay_minutes
FROM train_schedule ts
JOIN trains t ON ts.train_id = t.id
ORDER BY ts.id DESC;

-- 6) Analytics proof
SELECT id, train_id, predicted_fill_time, best_booking_time, demand_level, fill_speed, created_at
FROM prediction_logs
ORDER BY id DESC;

SELECT id, train_id, route_key, booking_frequency, weekend_traffic_score, seasonal_rush_score
FROM train_popularity
ORDER BY id DESC;

SELECT id, station_id, train_id, crowd_index, logged_at
FROM congestion_logs
ORDER BY id DESC;
