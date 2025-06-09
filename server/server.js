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
import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

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
      amount: amount * 100,
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
  res.send('Cinefix Express server is running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

