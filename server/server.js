// import express from 'express';
// import Razorpay from 'razorpay';
// import cors from 'cors';

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// const razorpay = new Razorpay({
//   key_id: 'rzp_test_f72l5fnGjUGpvZ',
//   key_secret: 'ZUUqE6ZQKOs0jbwuerXey4EN',
// });

// app.post('/create-order', async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const options = {
//       amount: amount * 100,
//       currency: 'INR',
//       receipt: `receipt#${Math.floor(Math.random() * 100000)}`,
//     };
//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ error: 'Error creating Razorpay order' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// server/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: 'INR',
      receipt: `receipt#${Math.floor(Math.random() * 100000)}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

app.get('/', (req, res) => {
  // res.send('Hello from Cinefix server');
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cinefix Server</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { background-color: #121212; color: #ffffff; font-family: 'Inter', Arial, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; padding: 0; }
            h2{ font-size: 20px; font-weight: 500; letter-spacing: 1px; margin-bottom: 200px; }
        </style>
    </head><body>
        <h2>Hello From <span style="color:#1188ff;">Cinefix</span> Server 🚀</h2>
    </body></html>`);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
