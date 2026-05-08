export function allocateSeats(availability, requestedSeats) {
  const available = Number(availability.available_seats);
  if (available >= requestedSeats) {
    return { status: "CONFIRMED", waitingList: 0, updatedAvailable: available - requestedSeats };
  }
  return {
    status: "WAITLIST",
    waitingList: Number(availability.waiting_list_count) + requestedSeats,
    updatedAvailable: 0
  };
}
