const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');

//use promise.all - takes in array of promises

// GET CART
router.get(`/:user_id`, (req, res) => {
  let user_id = req.params.user_id;
  return knex.raw(`SELECT products.* FROM cart INNER JOIN products ON cart.products_id = products.id WHERE user_id = (?)`, [user_id])
  .then(result => {
    return result.rows
  })
  .then(usersProducts => {
    return res.json(usersProducts)
  })
}); //closing for get user's products


// POST CART
router.post(`/:user_id/:products_id`, (req, res) => {
  let user_id = req.params.user_id;
  let products_id = req.params.products_id;
  
  //can use promise.all
  return knex.raw(`SELECT * FROM users WHERE id = (?)`, [user_id])
  .then(result => {
    if(result.rows.length) {
      return knex.raw(`SELECT * FROM products WHERE id = (?)`, [products_id])
    } else {
        throw new Error(` not found`)
      }
    })
  .then(newCartItem => {
    return knex.raw(`INSERT INTO cart (user_id, products_id) VALUES (?, ?) RETURNING *`, [user_id, products_id])
    if (newCartItem.rows.length) {
      return res.json({ 'success': true })
    }
  })
  .catch(err => {
    return res.status(400).json ({'message': err.message})
  })
}); // closing for post cart

// DELETE CART ITEM

router.delete(`/:user_id/:products_id`, (req, res) => {
  let user_id = req.params.user_id;
  let products_id = req.params.products_id;
  // let cart_id = req.body.id;

  return knex.raw(`DELETE FROM cart WHERE user_id = (?) AND products_id = (?) RETURNING *`, [user_id, products_id])
  .then(deleted => {
    if (deleted.rows.length) {
      return res.json({ 'success': true})
    }
  })

})

module.exports = router;