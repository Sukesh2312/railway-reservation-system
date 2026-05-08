import { useNavigate, useParams } from "react-router-dom";
import client from "../../api/client";

export default function TicketCancellationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const cancel = async () => {
    await client.post(`/bookings/cancel/${bookingId}`);
    navigate("/my-bookings");
  };
  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold">Ticket Cancellation</h2>
      <p className="my-3">Refund will be processed based on cancellation policy.</p>
      <button className="btn-primary" onClick={cancel}>Confirm Cancel</button>
    </div>
  );
}
