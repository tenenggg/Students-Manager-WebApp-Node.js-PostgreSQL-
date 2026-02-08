const { Pool } = require("pg");                         // pool is a class that is used to create a pool of database connections




const pool = new Pool({                                   // pool is an object that is used to create a pool of database connections

    user: process.env.DB_USER,                               // all data taken from env
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});





pool.connect((err, client, release) => {                                        // to test the connection, when u run the server it will show the connection status
    if (err) {
        console.error(' Error connecting to the database:', err.stack);         // it will display when u run the server
    } else {
        console.log(' Successfully connected to PostgreSQL database');
        release();
    }
});


module.exports = pool;                                                          // export the pool to be used in other files