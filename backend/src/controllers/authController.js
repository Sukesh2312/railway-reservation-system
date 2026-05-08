import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const tokenFor = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)", [name, email, hash, phone, "user"]);
  res.status(201).json({ message: "User registered" });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: "Invalid credentials" });
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token: tokenFor(payload), user: payload });
}

export async function adminLogin(req, res) {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM admins WHERE email=?", [email]);
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return res.status(401).json({ message: "Invalid admin credentials" });
  const payload = { id: admin.id, name: admin.name, email: admin.email, role: "admin" };
  res.json({ token: tokenFor(payload), user: payload });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
