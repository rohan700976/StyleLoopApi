const express = require('express');
const router = express.Router();
const redis=require('../client')


router.get('/:tablename/occasion/:occasion',async (req,res)=>{
  try {
    
  const db=req.app.get('db');
  const tablename=req.params.tablename;
  const occasion=req.params.occasion;
 const cached=await redis.get(`${tablename}:occasion:${occasion}`);
 if(cached){
  return res.status(200).json(JSON.parse(cached));
 }

  db.query(`select * from ${tablename} where occasion=?`,[occasion],async (err,result)=>{
      if(err)  return res.status(500).json({query:'failed'})

        await redis.set(cached,JSON.stringify(result))
          res.status(200).send(result)
  
  });
    
  } catch (error) {
    return res.json("server error",error);
    
  }
});

router.get('/:tablename/price/:price1/:price2/',async (req, res) => {
  try {
     const db = req.app.get('db');
    const tablename=req.params.tablename;
  
    const price1 = req.params.price1;
    const price2 = req.params.price2;
    const cacheKey=`${tablename}:price:${price1}:${price2}`
    const cached=await redis.get(cacheKey);
    if(cached){
      return res.status(200).json(JSON.parse(cached));
    }
  
   
  
    const query =` SELECT * FROM ${tablename} WHERE Discounted_Price BETWEEN ? AND ?;`
  
    db.query(query, [price1, price2], async (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      await redis.set(cacheKey,JSON.stringify(result));
      res.send(result);
    });
    
  } catch (error) {
   return res.json("server error",error);
    
  }
});

router.get('/:tablename/fabric/:fabric',async (req, res) => {
  try {

    const db = req.app.get('db'); // ✅ Access db again
    const fabric = req.params.fabric;
    const tablename=req.params.tablename;
    const cacheKey=`${tablename}:fabric:${fabric}`
    const cached=await redis.get(cacheKey);
    if(cached){
      return res.status(200).json(JSON.parse(cached));
    }

    db.query(`SELECT * FROM ${tablename} WHERE Fabric= ?`, [fabric],async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
       await  redis.set(cacheKey,JSON.stringify(results))

      res.json(results);
    });

  } catch (error) {
    res.status(500).json("server error", error);
  }

});

router.get('/:tablename/rating/:rating', async (req, res) => {
  const db = req.app.get('db')
  const tablename=req.params.tablename;
  const rating = parseFloat(req.params.rating);
  const lowerBound = rating - 0.01;
  const upperBound = rating + 0.01;
  const cacheKey=`${tablename}:rating:${rating}`;
  const cached=await redis.get(cacheKey);
  if(cached){
  return  res.status(200).json(JSON.parse(cached));
  }

  db.query(
    `SELECT * FROM ${tablename} WHERE Rating BETWEEN ? AND ?`,
    [lowerBound, upperBound],
   async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await set(cacheKey,JSON.stringify(results));

      res.json(results);
    });

});


router.get('/:tablename/brand/:brand',async(req,res)=>{
  try {
    const db= req.app.get('db')
      const brand=req.params.brand;
      const tablename=req.params.tablename;
      const cached=await redis.get(`${tablename}:brand:${brand}`);
      if(cached){
       return res.status(200).json(JSON.stringify(cached));
      }
      
     db.query(`select * from ${tablename} where Brand_Name=?`,[brand],async (err,result)=>{
       
      if (err) {
        return res.status(500).send(err);
      }
      await redis.set(cached,express.json(JSON.stringify(result)))
      res.json(result);
    });
    
  } catch (error) {
    return res.status(500).json("server error",error);
  }

})

  router.get('/:tablename/size/:size',async(req,res)=>{
    try {
      const size=req.params.size;
      const tablename=req.params.tablename;
      const cached=await redis.get(`${tablename}:size:${size}`);
      if(cached){
        return res.status(200).json(JSON.parse(cached));
      }
      
     const db= req.app.get('db')
     db.query(`select * from ${tablename} where Size=?`,[size],async(err,result)=>{
       
      if (err) {
        return res.status(500).send(err); // Use return to prevent double send
      }
      await set(cached,JSON.stringify(result));

      res.json(result);
    });
      
    } catch (error) {
      return res.status(500).json("error",error);
    }
})


module.exports = router;