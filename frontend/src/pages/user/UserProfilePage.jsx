import { useAuth } from "../../context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();
  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3">User Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
