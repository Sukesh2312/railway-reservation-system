# Railway Reservation System (DBMS Project)

Complete full-stack railway reservation website with React + Node/Express + MySQL + JWT.

## Project Structure

```text
railway-reservation-system/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   │       ├── user/
│   │       └── admin/
│   ├── package.json
│   └── tailwind/vite configs
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── demo_queries.sql
│   └── reset_demo_data.sql
└── README.md
```

## Features Implemented

- User registration/login with JWT
- Admin login and dashboard
- Train search, details, seat availability
- Ticket booking with PNR generation
- Automatic seat allocation and waitlist logic
- Payment simulation with transaction records
- Ticket cancellation + refund logic
- Live MySQL seat update after booking/cancel
- Platform auto-assignment system
- Prediction + congestion + booking analytics APIs
- Socket.IO live event notifications
- Schedule management panel + APIs
- CSV booking report export
- 22 frontend pages (user + admin + dashboards)

## Frontend Pages

1. Home
2. Login
3. Register
4. Search Trains
5. Train Details
6. Seat Availability
7. Ticket Booking
8. Payment
9. Booking Success
10. My Bookings
11. Ticket Cancellation
12. User Profile
13. Admin Login
14. Admin Dashboard
15. Add Train
16. Manage Trains
17. Manage Users
18. Reports
19. Seat Prediction Dashboard
20. Platform Assignment Dashboard
21. Congestion Monitoring Dashboard
22. Booking Analytics Dashboard

## Installation & Run

### 1) Database Setup (MySQL Workbench)

1. Create/import schema:
   - Run `database/schema.sql`
2. Insert sample records:
   - Run `database/seed.sql`
3. Optional demo helper scripts:
   - `database/demo_queries.sql` (ready-made query list for teacher demo)
   - `database/reset_demo_data.sql` (reset transactional demo data)
4. Confirm tables using:
   - `SHOW TABLES;`
5. Check live data examples:
   - `SELECT * FROM bookings;`
   - `SELECT * FROM seat_availability;`
   - `SELECT * FROM platform_assignments;`
   - `SELECT * FROM prediction_logs;`

### 2) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Environment Variables

Inside `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=supersecretjwtkey
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=railway_reservation
```

Inside `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`
- `GET /api/auth/me`

### Trains
- `GET /api/trains/search?source=&destination=`
- `GET /api/trains/:id`

### Booking
- `GET /api/bookings/seats/:trainId`
- `POST /api/bookings`
- `POST /api/bookings/payment/:bookingId`
- `GET /api/bookings/my`
- `POST /api/bookings/cancel/:bookingId`

### Admin
- `POST /api/admin/trains`
- `GET /api/admin/trains`
- `PUT /api/admin/trains/:id`
- `DELETE /api/admin/trains/:id`
- `GET /api/admin/users`
- `POST /api/admin/platform-assign`
- `POST /api/admin/platform-override`
- `GET /api/admin/platform-assignments`
- `GET /api/admin/reports`
- `GET /api/admin/reports/csv`
- `POST /api/admin/schedules`
- `GET /api/admin/schedules`

### Analytics
- `GET /api/analytics/bookings`
- `GET /api/analytics/predictions`
- `GET /api/analytics/platforms`
- `GET /api/analytics/congestion`
- `GET /api/analytics/recommendations`

## ER Diagram Description

- `users` 1---N `bookings`
- `trains` 1---N `bookings`
- `bookings` 1---N `passengers`
- `bookings` 1---1 `payments` (logical)
- `bookings` 1---0..1 `cancellations`
- `trains` 1---N `seat_availability`
- `trains` 1---N `platform_assignments`
- `platforms` 1---N `platform_assignments`
- `trains` 1---N `booking_analytics`
- `trains` 1---N `prediction_logs`
- `trains` 1---N `train_schedule`
- `stations` 1---N `congestion_logs`

## Normalization Notes

- Master entities (`users`, `trains`, `stations`, `platforms`) are separated.
- Transaction entities (`bookings`, `payments`, `cancellations`) use foreign keys.
- Derived analytics data is stored in dedicated log tables (`prediction_logs`, `booking_analytics`, `congestion_logs`).
- Route and schedule data are separated (`routes`, `train_schedule`) to avoid redundancy.

## Demo Screenshots (What to Show Teacher)

- Home, Search Trains, Booking flow
- MySQL tables with inserted bookings
- Seat count before/after booking
- Cancellation entry and refund
- Platform assignment record insertion
- Prediction logs generated by analytics API

## Notes

- This is deployment-ready project structure for college demo.
- For production, add stronger validation, payment gateway integration, and websocket push updates.
