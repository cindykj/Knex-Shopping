// Modules
const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const knex = require('./knex/knex.js')

const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Ports
const PORT = process.env.PORT || 3000;

// Apps
const app = express();

// Middleware
app.use(bodyparser.urlencoded({ extended: true}));

// Routes
app.use('/users', usersRoute); // is mounting to http://localhost:300/users
app.use('/products', productsRoute);
app.use('/cart', cartRoutes);

// Listening
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});