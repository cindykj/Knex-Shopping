const express = require('express');
const router = express.Router();

const knex = require('../knex/knex.js');


router.post('/register', (req, res) => {
  //deconstruct validation
  let {email, password} = req.body; // let email = req.body.email; let password = req.body.email; // same as looking for {} above
  if (!(email && password)) { // or this (!email || !password)
    return res.status(400).json({message: `Missing email or password`});
  }
  email = email.toLowerCase();

  // check if user exists
  return knex.raw(`SELECT * FROM users WHERE email = ?`, [email])
    .then(result => {
      if (result.rows.length) { //this is already truthy, no need comparator
        throw new Error(`User already exists`); //this goes to first catch, and becomes the .catch(err)
      }
      return result;
    })
    .then(result => { // like 'development' branch, must add 'return' to knex to connect to master branch
      return knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [email, password])
    })
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => { //email
      return res.status(400).json({'message': err.message});
    })
})



// router
// .get('/:user_id', (req, res) => {
//   let id = req.params.user_id;
//   knex.raw(`SELECT * FROM user WHERE id = ?`, [id]) // 1st ? refers to 1st item in array
//     .then((result) => {
//       res.json(result.rows[0]) // 'do the work' occurs; rows' is array
//     })
//     .catch(error => {
//       console.log({
//         'message': 'User not found'
//       })
//     })
// }) // closing for get /:user id

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

module.exports = router;