import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-slate-900/90 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-rail-500">RailWay Pro</Link>
        <div className="flex gap-4 items-center text-sm">
          <Link to="/search">Search</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/admin/dashboard">Admin</Link>
          {user ? (
            <>
              <Link to="/profile">{user.name}</Link>
              <button className="btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="btn-primary" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
