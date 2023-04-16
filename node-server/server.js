const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'iti-200-final-db.ckrriscebioc.us-east-2.rds.amazonaws.com',
    database: 'iti200_final_database',
    password: 'postgres',
    port: '5432',
});

// Check PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database. Server time:', res.rows[0].now);
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// GET methods for website pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views/home.html'));
  console.info('Sent: home.html');
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views/home.html'));
  console.info('Sent: home.html');
});

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/views/rooms.html'));
  console.info('Sent: rooms.html');
});

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/aboutus.html'));
    console.info('Sent: aboutus.html');
});

app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/contactus.html'));
    console.info('Sent: contactus.html');
});

// POST method for booking form
app.post('/booking', async (req, res) => {
  try {
    const { checkinDate, checkoutDate, guests, roomType } = req.body;

    // Log the data to the console
    console.log('Booking data:', { checkinDate, checkoutDate, guests, roomType });

    const result = await pool.query(
      'INSERT INTO booking (checkin_date, checkout_date, guests, room_type) VALUES ($1, $2, $3, $4) RETURNING id',
      [checkinDate, checkoutDate, guests, roomType]
    ); 
    res.json({ success: true, bookingId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  } 
}); 

// POST method for contact us form
app.post('/contactus', async (req, res) => {
  console.log('Contact Us route hit');
  try {
    const { name, email, phone, message } = req.body;
    console.log('Contact date:', { name, email, phone, message });

    const result = await pool.query(
      'INSERT INTO contact_us (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, phone, message]
    );
    res.json({ success: true, contactId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Start server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});