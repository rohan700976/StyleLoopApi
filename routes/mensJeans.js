const express= require('express')
const router= express.Router();

router.get('/jeans',(req,res)=>{
    const db=req.app.get('db')
    db.query("select * from mensjeans", (err,result)=>{
        if(err)  return res.status(500).json({query:'failed'})
            res.status(200).send(result)
    })
})

router.get('/:id',(req,res)=>{
    const db=req.app.get('db');
   const id= req.params.id;
   db.query('select * from mensjeans where Product_id=?',[id],(err,result)=>{
    if(err)  return res.status(500).json({query:'failed'})
            res.status(200).send(result)
   })
})

router.get('/occasion/:occasion',(req,res)=>{
    const db=req.app.get('db');
    const occasion=req.params.occasion;
    db.query('select * from menstshirt where occasion=?',[occasion],(err,result)=>{
        if(err)  return res.status(500).json({query:'failed'})
            res.status(200).send(result)
    
    })
})

router.get('/fabric/:fabric',(req,res)=>{
    const db=req.app.get("db");
    const fabric=req.params.fabric;
    db.query('select * from menstshirt where Fabric=?',[fabric],(err,result)=>{

        if(err)  return res.status(500).json({query:'failed'})
            res.status(200).send(result)
    })
})
module.exports=router;