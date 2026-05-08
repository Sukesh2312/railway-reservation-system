import pool from "../config/db.js";
import { buildPredictionSummary, estimateFullTime } from "../services/predictionService.js";
import { emitEvent } from "../utils/socket.js";

export async function bookingAnalytics(req, res) {
  const [[total]] = await pool.query("SELECT COUNT(*) totalBookings, COALESCE(SUM(fare_amount),0) revenue FROM bookings");
  const [[cancel]] = await pool.query("SELECT COUNT(*) cancellations FROM bookings WHERE booking_status='CANCELLED'");
  const [[occ]] = await pool.query("SELECT ROUND(AVG((booked/total)*100),2) occupancy FROM (SELECT t.total_seats total, COALESCE(SUM(b.seats_booked),0) booked FROM trains t LEFT JOIN bookings b ON t.id=b.train_id GROUP BY t.id) x");
  res.json({ summary: { ...total, ...cancel, occupancy: occ.occupancy || 0 } });
}

export async function predictionAnalytics(req, res) {
  const [rows] = await pool.query(
    "SELECT t.id,t.train_number,t.train_name,COALESCE(SUM(b.seats_booked),0)/t.total_seats fill_ratio FROM trains t LEFT JOIN bookings b ON t.id=b.train_id GROUP BY t.id,t.train_number,t.train_name,t.total_seats"
  );
  for (const r of rows) {
    await pool.query("INSERT INTO prediction_logs (train_id,predicted_fill_time,best_booking_time,demand_level,fill_speed) VALUES (?,?,?,?,?)",
      [r.id, estimateFullTime(Number(r.fill_ratio)), "2 days before departure", Number(r.fill_ratio) > 0.7 ? "HIGH" : "LOW", Number(r.fill_ratio)]);
  }
  emitEvent("prediction:generated", { count: rows.length, timestamp: Date.now() });
  res.json({ summary: buildPredictionSummary(rows), rows });
}

export async function platformAnalytics(req, res) {
  const [[total]] = await pool.query("SELECT COUNT(*) totalPlatforms FROM platforms");
  const [[assigned]] = await pool.query("SELECT COUNT(*) assignedNow FROM platforms WHERE status='ASSIGNED'");
  const [[resolved]] = await pool.query("SELECT COUNT(*) conflictsResolved FROM platform_assignments WHERE status='AUTO'");
  res.json({ summary: { ...total, ...assigned, ...resolved, usagePercent: total.totalPlatforms ? Math.round(assigned.assignedNow * 100 / total.totalPlatforms) : 0 } });
}

export async function congestionAnalytics(req, res) {
  const [[avg]] = await pool.query("SELECT ROUND(AVG(crowd_index),2) avgCrowding FROM congestion_logs");
  const [[peak]] = await pool.query("SELECT COALESCE(MAX(crowd_index),0) peakStationScore FROM congestion_logs");
  res.json({ summary: { avgCrowding: avg.avgCrowding || 0, peakStationScore: peak.peakStationScore || 0, activeAlerts: peak.peakStationScore > 75 ? 3 : 1, weekendRush: 68 } });
}

export async function smartRecommendations(req, res) {
  const [history] = await pool.query(
    "SELECT train_id, COUNT(*) c FROM bookings WHERE user_id=? GROUP BY train_id ORDER BY c DESC LIMIT 3",
    [req.user.id]
  );
  if (!history.length) {
    const [popular] = await pool.query("SELECT t.* FROM trains t JOIN train_popularity p ON p.train_id=t.id ORDER BY p.booking_frequency DESC LIMIT 3");
    return res.json({ recommendations: popular, reason: "Popular routes" });
  }
  const ids = history.map((h) => h.train_id);
  const [preferred] = await pool.query(`SELECT * FROM trains WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
  res.json({ recommendations: preferred, reason: "Based on booking history" });
}
