# Real-Time Expert Session Booking System

A full-stack real-time expert booking system built with:
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Real-time:** Socket.io

## Features (Assignment Requirements)

### 1) Expert Listing Screen
- List experts (name, category, experience, rating)
- Search by name
- Filter by category
- Pagination
- Proper loading & error states

### 2) Expert Detail Screen
- Expert details page
- Available time slots grouped by date
- **Real-time slot updates** when another user books (Socket.io)

### 3) Booking Screen
- Booking form: Name, Email, Phone, Date, Time Slot, Notes
- Proper validation
- Success message after booking
- Booked slots get disabled/removed

### 4) My Bookings Screen
- Fetch bookings by email
- Shows booking status:
  - Pending
  - Confirmed
  - Completed

## Critical Requirements Implemented
### Prevent Double Booking (Race-condition safe)
- Prevents booking same expert + same date + same time slot twice
- Uses a unique constraint in MongoDB (and handles duplicate key error)

### Real-time Slot Update
- Uses **Socket.io**
- When booking is created, server emits `slotBooked`
- Clients viewing the expert detail page update slot list instantly

### Proper Error Handling
- Request validation
- Meaningful error responses
- Centralized error handler middleware
- Environment variables used

---

## API Endpoints

### Experts
- `GET /experts?page=&limit=&search=&category=`
- `GET /experts/:id`

### Bookings
- `POST /bookings`
- `GET /bookings?email=`
- `PATCH /bookings/:id/status`

> Optional (Extra):  
- `GET /bookings/all` (Admin view of all bookings)

---



### Backend Setup
cd backend
npm install
cp .env.example .env
npm run dev
Backend runs on: http://localhost:5000

### Frontend Setup
cd frontend
npm install
cp .env.example .env
npm run dev
Frontend runs on: http://localhost:5173