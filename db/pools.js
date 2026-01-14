const { Pool } = require('pg');

module.exports = new Pool({
	connectionString: 'postgresql://postgres:root@localhost:5432/membership',
});
