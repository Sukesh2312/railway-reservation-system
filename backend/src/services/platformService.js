export function assignBestPlatform(platforms, schedule) {
  const free = platforms
    .filter((p) => !p.current_train_id || new Date(p.available_from) <= new Date(schedule.arrival_time))
    .sort((a, b) => a.congestion_score - b.congestion_score);
  return free[0] || platforms.sort((a, b) => a.congestion_score - b.congestion_score)[0];
}
