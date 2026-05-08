import { useNavigate, useParams } from "react-router-dom";
import client from "../../api/client";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const pay = async () => {
    const { data } = await client.post(`/bookings/payment/${bookingId}`, { method: "UPI" });
    navigate(`/booking-success/${data.booking.pnr_number}`);
  };
  return (
    <div className="card max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-3">Payment Simulation</h2>
      <p className="mb-3">Click below to complete payment.</p>
      <button className="btn-primary" onClick={pay}>Pay Now</button>
    </div>
  );
}
