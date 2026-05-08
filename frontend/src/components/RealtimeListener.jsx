import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export default function RealtimeListener() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.on("system", (d) => toast.success(d.message));
    socket.on("booking:created", (d) => toast.success(`New booking created: ${d.pnr}`));
    socket.on("booking:cancelled", (d) => toast(`Booking cancelled, refund: ${d.refund}`));
    socket.on("platform:assigned", (d) => toast(`Platform assigned to train ${d.trainId}`));
    socket.on("prediction:generated", (d) => toast.success(`Prediction updated for ${d.count} trains`));
    return () => socket.close();
  }, []);
  return null;
}
