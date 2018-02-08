const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');

//use promise.all - takes in array of promises

// GET CART

// POST CART
router.post(`/:user_id/:products_id`, (req, res) => {
  let user_id = req.params.user_id;
  let products_id = req.params.products_id;
  
  return knex.raw(`SELECT * FROM users WHERE id = (?)`, [user_id])
  .then(result => {
    // console.log('result!')
    if(result.rows.length) {
      return knex.raw(`SELECT * FROM products WHERE id = (?)`, [products_id])
    } else {
        throw new Error(`Product not found`)
      }
    })

  .then(newCartItem => {
    return knex.raw(`INSERT INTO cart (user_id, products_id) VALUES (?, ?) RETURNING *`, [user_id, products_id])
  })

  .then(newCartItem => {
    return res.json(newCartItem.rows[0]);
  })

  .catch(err => {
    return res.status(400).json ({'message': err.message})
  })
});

module.exports = router;