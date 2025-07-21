const express= require('express')
const router= express.Router();
const redis=require('../client')

router.get('/jeans', async(req, res) => {
  try {
    const db = req.app.get('db');
    const cached=await redis.get('mensjeans:jeans');
    if(cached){
     return res.status(200).json(JSON.parse(cached))
    }
  
    db.query('SELECT * FROM mensjeans', async(err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }
      await redis.set('mensjeans:jeans',JSON.stringify(results));
      res.json(results);
    });
    
  } catch (error) {
    return res.status(500).json({error:"server error"});
    
  }
  
});
// Get user by ID
router.get('/:id', async(req, res) => {
  try {
    const db = req.app.get('db'); // ✅ Access db again
    const id = req.params.id;
    const cached=await redis.get(`mensjeans:${id}`)
   if(cached){
       return res.status(200).json(JSON.parse(cached))
      }
    
    db.query('SELECT * FROM mensjeans WHERE Product_id = ?', [id], async(err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await redis.set(`mensjeans:${id}`,JSON.stringify(results))
  
      res.json(results);
    });
    
  } catch (error) {
    res.status(500).json({error:"server error"})
    
  }
});

router.get('/fabric/:fabric', async(req, res) => {
  try {
    const db = req.app.get('db'); // ✅ Access db again
    const fabric = req.params.fabric;
    const cacheKey=`mensjeans:fabric:${fabric}`;
    const cached=await redis.get(cacheKey);
    if(cached){

      return res.status(200).json(JSON.parse(cached))
    }
    
  
  
    db.query('SELECT * FROM mensjeans WHERE Fabric= ?', [fabric], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await redis.set(cacheKey,JSON.stringify(results))
  
      res.json(results);
    });
    
  } catch (error) {
    return res.status(500).json({ error:"server error"});
    
  }
});

router.get('/occasion/:occasion',async(req,res)=>{
  try {
    const db=req.app.get('db')
    const occasion=req.params.occasion;
    const cacheKey=`mensjeans:occasion:${occasion}`
    const cached=await redis.get(cacheKey)
     if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
   db.query('SELECT * FROM mensjeans WHERE Occasion= ?', [occasion], async(err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
   await redis.set(cacheKey,JSON.stringify(results))
    res.json(results);
  });
    
  } catch (error) {
      return res.status(500).json({ error:"server error"});
    
  }
});

module.exports=router;