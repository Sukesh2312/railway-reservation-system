import { useParams } from "react-router-dom";

export default function BookingSuccessPage() {
  const { pnr } = useParams();
  return (
    <div className="card text-center">
      <h2 className="text-3xl font-bold text-green-400">Booking Successful</h2>
      <p className="mt-3">Your PNR Number: <span className="font-bold">{pnr}</span></p>
    </div>
  );
}
