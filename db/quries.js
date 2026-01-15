const pool = require('./pools');

async function createUser(username, email, hashedPassword, membership_status= 'Premium') {
  const result = await pool.query(
    'INSERT INTO users (username, email, password, membership_status) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, hashedPassword, membership_status]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}
async function createMessage(title, message) {
  const result = await pool.query(
    'INSERT INTO message (title, message) VALUES ($1, $2) RETURNING *',
    [title, message]
  );
  return result.rows[0];
}
async function findUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}   
async function allMessages() {
  const result = await pool.query('SELECT * FROM message');
  return result.rows;
}


module.exports = {
  createUser,
  findUserByEmail,
  createMessage,
  findUserById,
  allMessages,
};