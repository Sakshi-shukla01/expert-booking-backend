import { Link, Route, Routes } from "react-router-dom";
import ExpertsList from "./pages/ExpertsList";
import ExpertDetail from "./pages/ExpertDetail";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
export default function App() {
  return (
    <div>
      <div className="nav">
        <div className="navInner">
          <div className="brand">Expert Booking</div>
          <div className="navLinks">
            <Link className="navLink" to="/">Experts</Link>
            <Link className="navLink" to="/my-bookings">My Bookings</Link>
            <Link className="navLink" to="/admin">Admin</Link>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ExpertsList />} />
        <Route path="/experts/:id" element={<ExpertDetail />} />
        <Route path="/book/:expertId" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminBookings />} />
      </Routes>
    </div>
  );
}