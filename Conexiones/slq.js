// const pgPromise = require('pg-promise')
const { Pool } = require('pg');
const pool = new Pool({
    host: 'containers-us-west-62.railway.app',
    port: '7520',
    database: 'railway',
    user: 'postgres',
    password: 'vHuI5ZaBvc6OzMj38dzG',
    ssl: {
        rejectUnauthorized: false,
    }
});

exports.db = pool