const express = require('express');
const router = express.Router();

// GET wishlist by ID
router.get('/get/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    db.query('SELECT * FROM wishlist WHERE wishlist_id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Query failed', details: err });
        }
        res.status(200).json(result);
    });
});

// DELETE wishlist by ID
router.delete('/delete/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    db.query('DELETE FROM wishlist WHERE wishlist_id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.status(200).json({ message: 'Wishlist item deleted successfully' });
    });
});

// INSERT into wishlist
router.post('/insert/:userid', (req, res) => {
    const db = req.app.get('db');
    const { Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img } = req.body;
    const query = `
        INSERT INTO wishlist 
        (Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [Brand_Name, Product_Name, Actual_Price, Discounted_Price, Product_Img, req.params.userid], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Insert failed', details: err });
        }
        res.status(200).json({ message: 'Wishlist item added successfully', data: result });
    });
});

module.exports = router;
