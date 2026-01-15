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
		connectionString: 'postgresql://postgres:oFpEZxOfEOofClVrFvOmZAyUHfbUyLDz@shuttle.proxy.rlwy.net:11624/railway',
	});
}

module.exports = pool;
