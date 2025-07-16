const express=require('express')
const router = express.Router();


// http://localhost:8000/menstshirt/tshirt
router.get('/tshirt',(req,res)=>{
  const db = req.app.get('db');
  db.query('select * from menstshirt',(err,result)=>{
    if(err){
         console.log(err);
         res.status(500).json({ query:"failed"});
    }
    res.send(result)
  })
});


router.get('/:id',(req,res)=>{
    const id=req.params.id;
    const db=req.app.get('db')
    db.query('select * from menstshirt where Product_id=?',[id],(err,result)=>{
        if(err) res.status(500).json({query:'failed'})
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


