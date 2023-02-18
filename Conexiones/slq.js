// const pgPromise = require('pg-promise')
const { Pool } = require('pg');
const pool = new Pool({
    host: 'containers-us-west-106.railway.app',
    port: '7745',
    database: 'railway',
    user: 'postgres',
    password: '9oIfwpQVwiq0Eaw3d3IW',
    ssl: {
        rejectUnauthorized: false,
    }
});

exports.db = pool