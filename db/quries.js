const pool = require('./pools');

async function createUser(
  username,
  email,
  hashedPassword,
  membership_status = 'Premium'
) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, password, membership_status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, membership_status`,
    [username, email, hashedPassword, membership_status]
  );
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, username, email, password, membership_status
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0];
}

async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, username, email, membership_status
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0];
}

async function updateMembershipStatus(userId, status) {
  const { rows } = await pool.query(
    `UPDATE users
     SET membership_status = $2
     WHERE id = $1
     RETURNING id, membership_status`,
    [userId, status]
  );
  return rows[0];
}

async function createMessage(title, message, user_id) {
	const result = await pool.query(
		'INSERT INTO message (title, message, user_id) VALUES ($1, $2, $3) RETURNING *',
		[title, message, user_id]
	);
	return result.rows[0];
}


async function allMessages(limit = 20, offset = 0) {
  const { rows } = await pool.query(
    `SELECT m.id, m.title, m.message, m.timestamp, u.username, u.membership_status
     FROM message m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.timestamp DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}

async function premiumMessages(limit = 20, offset = 0) {
  const { rows } = await pool.query(
    `SELECT m.id, m.title, m.message, m.timestamp, u.username
     FROM message m
     JOIN users u ON u.id = m.user_id
     WHERE u.membership_status = 'Premium'
     ORDER BY m.timestamp DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}

async function messagesByUser(userId, limit = 20, offset = 0) {
  const { rows } = await pool.query(
    `SELECT id, title, message, timestamp
     FROM message
     WHERE user_id = $1
     ORDER BY timestamp DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateMembershipStatus,
  createMessage,
  allMessages,
  premiumMessages,
  messagesByUser,
};
/* swI67OZwZvT7Rzlf8pquYDpoJ4Vw9mUR */