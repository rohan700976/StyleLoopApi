const express=require('express')
const app=express();
const router=express.Router();


router.post('/users', (req, res) => {
   const db = req.app.get('db');
  const { user_name, user_mobile, user_address, user_email, user_password, isverifying, user_img } = req.body;

  if (!user_name || !user_mobile || !user_email || !user_password) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const sql = `
    INSERT INTO users 
    (user_name, user_mobile, user_address, user_email, user_password, isverifying, user_img)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_name, user_mobile, user_address, user_email, user_password, isverifying || false, user_img], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  });
});

router.get('/users',(req,res)=>{
    const db = req.app.get('db');
    db.query('select * from users',(err,result)=>{
        if(err){
            return res.status(500).json("query failed",err);
        }
        res.status(200).send(result);
    })
    
})

module.exports=router;