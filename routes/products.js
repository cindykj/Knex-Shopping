const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');

// GET ALL PRODUCTS
router.get('/', (req, res) => {
  return knex.raw(`SELECT * FROM products`)
  .then(result => {
    if (result.rows.length) {
      return res.json(result.rows)
    } else {
      throw new Error(`There are no products!`)
    }
  })
  
  .catch(err => {
    return res.status(400).json({'message': err.message})
  })
})

// GET PRODUCT ID
router.get('/:product_id', (req, res) => {
  let id = req.params.product_id;
  return knex.raw(`SELECT * FROM products WHERE id in (?)`, [id])
  .then(result => {
    if (result.rows.length) {
      return res.json(result.rows[0])
    } else {
      throw new Error(`Product not found`)
    }
  })

  .catch(err => {
    return res.status(404).json ({ 'message': err.message })
  })
}) //closing for get product id


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