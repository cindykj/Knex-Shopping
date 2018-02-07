const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');

router
  .get('/:user_id', (req, res) => {
    let id = req.params.user_id;
    knex.raw(`SELECT * FROM user WHERE id = ?`, [id]) // 1st ? refers to 1st item in array
    .then((result) => {
      res.json(result.rows[0]) // 'do the work' occurs; rows' is array

    })
    .catch(error => {
      console.log({ 'message': 'User not found' })
    })
  })  // closing for get /:user id

  // .post('/login', (req, res) => {
  //   let email = req.body.email;
  //   let password = req.body.password;
  //   knex.raw(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password])
  //   .then((result) => {
  //     res.json(result.rows[0])
  //   })
  //   .catch(error => { //email not found
  //     res.json({ 'message': 'User not found' })
  //   })

  //   .catch(error => {
  //     res.json({ 'message': 'Incorrect password' })
  //   })

  // })

  .post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [email, password])
    .then((result) => {
      res.json(result.rows[0])
    })
    .catch(error => { //email not found
      res.json({ 'message': 'User not found' })
    })

    .catch(error => {
      res.json({ 'message': 'Incorrect password' })
    })

  });

module.exports = router;