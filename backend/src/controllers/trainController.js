import pool from "../config/db.js";

export async function getCities(req, res) {
  const [rows] = await pool.query("SELECT DISTINCT city FROM stations ORDER BY city ASC");
  const cities = rows.map((r) => r.city).filter(Boolean);
  res.json({ cities });
}

export async function searchTrains(req, res) {
  const { source, destination } = req.query;
  const [trains] = await pool.query(
    "SELECT * FROM trains WHERE source_station LIKE ? AND destination_station LIKE ?",
    [`%${source || ""}%`, `%${destination || ""}%`]
  );
  res.json({ trains });
}

export async function getTrainDetails(req, res) {
  const [rows] = await pool.query("SELECT * FROM trains WHERE id=?", [req.params.id]);
  res.json({ train: rows[0] });
}
