const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = 8000;

app.use(express.json());

app.use(cors());

// MySQL connection config
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
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
// const menTshirtRoutes=require('./routes/menTshirt')
const womensRoutes=require('./routes/womenData');
const menstshirtRoute=require('./routes/menTshirt')
const mensjeansRouter=require('./routes/mensJeans')
const filterRouter=require('./routes/filter')
const kidsRouter=require('./routes/kids')
const usersRouter=require('./routes/users')
const wishlistRouter=require('./routes/wishlist')
app.use('/women',womensRoutes);
app.use('/menshirt', menshirtRoutes);
app.use('/menstshirt', menstshirtRoute);
app.use('/mensjeans',mensjeansRouter); 
 app.use('/filter',filterRouter);
 app.use('/kids', kidsRouter);
 app.use('/api',usersRouter)
 app.use('/wishlist',wishlistRouter)


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});