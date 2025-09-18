//step1 require modules
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// step2 create a secret key
const SECRET_KEY = "ajuygjhlkohcivahoay";

// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {
  const db = req.app.get("db");
  const {
    user_name,
    user_mobile,
    user_email,
    user_address,
    user_password,
    isverifying,
    user_img,
  } = req.body;

  try {
    // 1. Check if user already exists
    const checkQuery = "SELECT * FROM users WHERE user_email = ?";
    db.query(checkQuery, [user_email], async (checkErr, existingUser) => {
      if (checkErr) {
        console.error("DB error:", checkErr);
        return res.status(500).json({ error: "DB query error" });
      }

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // 3. Insert new user
      const insertQuery = `
        INSERT INTO users 
        (user_name, user_email, user_password, user_address, user_mobile, isverifying, user_img) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          user_name,
          user_email,
          hashedPassword,
          user_address,
          user_mobile,
          isverifying,
          user_img,
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error("DB error:", insertErr);
            return res.status(500).json({ error: "DB insert error" });
          }

          // Optionally create JWT token immediately after signup
          const token = jwt.sign({ email: user_email }, SECRET_KEY, {
            expiresIn: "5h",
          });

          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
            token,
          });
        }
      );
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== LOGIN ==================
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = req.app.get("db");

  const query = "SELECT * FROM users WHERE user_email = ?";
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error("DB error:", error);
      return res.status(500).json({ error: "DB query error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = results[0];

    // compare passwords
    const valid = await bcrypt.compare(password, user.user_password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate JWT token
    const token = jwt.sign({ email: user.user_email }, SECRET_KEY, {
      expiresIn: "5h",
    });

    res.json({
      token,
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
      },
    });
  });
});

// ================== AUTH MIDDLEWARE ==================
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// ================== PROTECTED ROUTE ==================
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: `Hello ${req.user.email}, this is your profile`,
  });
});

module.exports = router;
