const express = require('express');
const router = express.Router();

router.post('/insert/:userid', (req, res) => {
    const user_id = req.params.userid; // take from params
    const { Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img } = req.body;
    const db = req.app.get('db');

    const query = `
        INSERT INTO cart 
        (Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img, user_id], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "query error", err });
            }
            res.status(200).json(result);
        }
    );
});

router.get('/getdata', (req, res) => {
    const db = req.app.get('db');
    db.query(`SELECT * FROM cart`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "query error", err });
        }
        res.status(200).json(result);
    });
});

router.get('/getdata/:id', (req, res) => {
    const id = req.params.id;
    const db = req.app.get('db');
    db.query(`SELECT * FROM cart WHERE cart_id = ?`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "query error", err });
        }
        res.status(200).json(result);
    });
});

router.delete('/delete/:id',(req,res)=>{
    const id=req.params.id;
    const db=req.app.get('db');

    const query=`DELETE FROM cart where cart_id=?`;
    db.query(query,[id],(err,result)=>{
        if(err){
            return res.status(500).json({ error: "query error", err });
        }
        res.status(200).json(result);
    })

})

module.exports = router;
