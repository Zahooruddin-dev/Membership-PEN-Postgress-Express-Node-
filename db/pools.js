const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
	// Production (Render or any cloud Postgres) - enable SSL
	pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	// Local development
	pool = new Pool({
		connectionString: 'postgresql://postgres:root@localhost:5432/membership',
	});
}

module.exports = pool;
