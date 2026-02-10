require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Obligatorio para Azure SQL
    trustServerCertificate: false, // Por seguridad en Azure usar false
    enableArithAbort: true,
    connectTimeout: 30000 // Aumentar a 30s por si la VNET está lenta
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a MSSQL');
    return pool;
  })
  .catch(err => {
    // IMPORTANTE: Si falla aquí, se lanza el error para que no sea 'undefined'
    console.error('Error de conexión en db.js:', err);
    throw err; 
  });

module.exports = {
  sql,
  poolPromise
};
