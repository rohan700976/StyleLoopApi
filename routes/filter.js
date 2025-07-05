const express = require('express');
const router = express.Router();


router.get('/occasion/:occasion',(req,res)=>{
    const db=req.app.get('db');
    const occasion=req.params.occasion;
    db.query('select * from menstshirt where occasion=?',[occasion],(err,result)=>{
        if(err)  return res.status(500).json({query:'failed'})
            res.status(200).send(result)
    
    });
});

router.get('/price/:price1/:price2', (req, res) => {
  const price1 = req.params.price1;
  const price2 = req.params.price2;

  const db = req.app.get('db');

  const query = 'SELECT * FROM mensjeans WHERE Discounted_Price BETWEEN ? AND ?';

  db.query(query, [price1, price2], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Use return to prevent double send
    }
    res.send(result);
  });
});

router.get('/fabric/:fabric',(req,res)=>{
    const fabric=req.params.fabric;
   const db= req.app.get('db')
   db.query('select * from mensjeans where 	Fabric=?',[fabric],(err,result)=>{
     
    if (err) {
      return res.status(500).send(err); // Use return to prevent double send
    }
    res.send(result);
  });
   
})

router.get('/rating/:rating',(req,res)=>{
    const rating=req.params.rating;
    const updateRating=Math.round(rating)
   const db= req.app.get('db')
   db.query('select * from mensjeans where Rating=?',[updateRating],(err,result)=>{
     
    if (err) {
      return res.status(500).send(err); // Use return to prevent double send
    }
    res.send(result);
  });
})

router.get('/brand/:brand',(req,res)=>{
    const brand=req.params.brand;
    
   const db= req.app.get('db')
   db.query('select * from mensjeans where Brand_Name=?',[brand],(err,result)=>{
     
    if (err) {
      return res.status(500).send(err); // Use return to prevent double send
    }
    res.json(result);
  });
})

  router.get('/size/:size',(req,res)=>{
    const size=req.params.size;
    
   const db= req.app.get('db')
   db.query('select * from mensjeans where Size=?',[size],(err,result)=>{
     
    if (err) {
      return res.status(500).send(err); // Use return to prevent double send
    }
    res.json(result);
  });
})


module.exports = router;