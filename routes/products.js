const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');

// GET PRODUCT
router.get('/products', (req, res) => {
  return knex.raw(`SELECT * FROM products`)
  .then(result => {
    if (result.rows.length) {
      console.log(result)
      return res.json(result)
    } else {
      throw new Error(`There are no products!`)
    }
  })
  
  .catch(err => {
    return res.status(400).json({'message': err.message})
  })
})

// GET PRODUCT ID


// POST PRODUCT
router.post(`/new`, (req, res) => {
  let {title, description, inventory, price} = req.body; 
  if (!(title || !description || !inventory || !price)) { // or this (!email || !password)
    return res.status(400).json({message: `Must POST all product fields`});
  }

  return knex.raw(`SELECT * FROM products WHERE title = (?)`, [title])
  .then(result => {
    if(result.rows.length) {
      throw new Error(`Product already exists`)
    }
    return result;
  })

  .then(newProduct => {
    return knex.raw(`INSERT INTO products (title, description, inventory, price) VALUES (?, ?, ?, ?) RETURNING *`, [title, description, inventory, price])
  })

  .then(newProduct => {
    return res.json(newProduct.rows[0]);
  })

  .catch(err => {
    return res.status(400).json ({ 'message': err.message })
  })
});


module.exports = router;