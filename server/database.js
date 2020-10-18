const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

// add a user to the database
const register =  function(user) {
  const queryString = `INSERT INTO users(name, email, phone_number)
                       VALUES ($1, $2, $3)
                       RETURNING *;
                      `;

  const queryParams = [user.name, user.email, user.phone_number];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.register = register;

// gets a user by their email address
const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users
                       WHERE email = $1;
                      `;

  const queryParams = [email];

  return pool.query(queryString, queryParams)
    .then(result => {
      if (result.rows[0].email === null) {
        return null;
      } else {
        return result.rows[0];
      }
    });
};
exports.getUserWithEmail = getUserWithEmail;

// get every item on the menu
const getAllMenu =  function() {
  const queryString = `SELECT name, description, cost, picture_url
                       FROM menu_items;
                      `;

  return pool.query(queryString)
    .then(result => result.rows);
};
exports.getAllMenu = getAllMenu;

// update user to change their info in the db
const updateUser =  function(userUpdate) {
  let queryString = '';

  const queryParams = [userUpdate.id, userUpdate.name, userUpdate.email, userUpdate.phone_number];

  if (userUpdate.name) {
    queryString += `UPDATE users
                    SET name = $2
                    WHERE id = $1;
                   `;
  };

  if (userUpdate.email) {
    queryString += `UPDATE users
                    SET email = $3
                    WHERE id = $1;
                   `;
  };

  if (userUpdate.phone_number) {
    queryString += `UPDATE users
                    SET phone_number = $4
                    WHERE id = $1;
                   `;
  };

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateUser = updateUser;

// gets all of the orders placed by the logged in user
const showAllOrders =  function(user) {
  const queryString = `SELECT orders.*, carts.*, menu_items.name
                       FROM orders
                       JOIN carts on orders.id = orders_id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE user_id = $1;
                      `;

  const queryParams = [user.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.showAllOrders = showAllOrders;

// gets the total cost of an order, user is there to make sure it only does it for the user that's logged in
const totalCostOfOrder =  function(order, user) {
  const queryString = `SELECT sum(menu_items.cost)
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.id = $1 AND user_id = $2;
                      `;

  const queryParams = [order.id, user.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.totalCostOfOrder = totalCostOfOrder;

// gets the highest time to make of the items in an order
const longestMakeTimeFromOrder =  function(order) {
  const queryString = `SELECT max(menu_items.time_to_make)
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.id = $1;
                      `;

  const queryParams = [order.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.longestMakeTimeFromOrder = longestMakeTimeFromOrder;

// gets all the items in the current cart and their prices
const showCart = function(order) {
  const queryString = `SELECT menu_items.name, menu_items.cost
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.id = $1;
                      `;

  const queryParams = [order.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.showCart = showCart;

// create a new order
const newOrder =  function(user) {
  const queryString = `INSERT INTO orders(user_id)
                       VALUES ($1)
                       RETURNING *;
                      `;

  const queryParams = [user.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.newOrder = newOrder;

// when the user goes to add an item to their cart
const addItemToCart =  function( order, menu, quantity) {
  const queryString = `INSERT INTO carts(menu_id, orders_id, quantity)
                       VALUES ($1, $2, $3)
                       RETURNING *;
                      `;

  const queryParams = [menu.id, order.id, quantity];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.addItemToCart = addItemToCart;

// updates orders on checkout, adding the timestamp that the order was placed at
const updateOrderOnCheckout =  function(order) {
  const queryString = `UPDATE order
                       SET placed_at = GETDATE()
                       WHERE id = $1;
                      `;

  const queryParams = [order.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateOrderOnCheckout = updateOrderOnCheckout;

// updates orders on pickup, adding the timestamp that the order was picked up at and setting status to f
const updateOrderOnPickup =  function(order) {
  const queryString = `UPDATE order
                       SET picked_up_at = GETDATE(), status = false
                       WHERE id = $1;
                      `;

  const queryParams = [order.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateOrderOnPickup = updateOrderOnPickup;