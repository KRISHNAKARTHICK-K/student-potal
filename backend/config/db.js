require('dotenv').config();
const mysql = require('mysql2');

// Create MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL database:', err.message);
    console.error('Error details:', err);
    return;
  }
  console.log('✅ Successfully connected to MySQL database');
  console.log(`📊 Connected to database: ${process.env.DB_NAME || 'N/A'}`);
  console.log(`🔗 Connection ID: ${connection.threadId}`);
});

// Handle connection errors
connection.on('error', (err) => {
  console.error('❌ MySQL connection error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Connection to database was lost');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('Connection to database was refused');
  } else {
    console.error('Unexpected database error:', err);
  }
});

// Export the connection
module.exports = connection;
