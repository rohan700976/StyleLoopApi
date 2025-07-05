const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const PORT = 8000;


app.use(cors());

// MySQL connection config
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'StyleLoop'
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Make DB globally accessible (optional & simple)
app.set('db', db);

// Import and use the menshirt routes
const menshirtRoutes = require('./routes/menShirt');
const womenshirtRoutes=require('./routes/womenShirt');
const menstshirtRoute=require('./routes/menTshirt')
const mensjeansRouter=require('./routes/mensJeans')
app.use('/womenshirt',womenshirtRoutes);
app.use('/menshirt', menshirtRoutes);
app.use('/menstshirt', menstshirtRoute);
app.use('/mensjeans',mensjeansRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
