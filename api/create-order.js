import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt#${Math.floor(Math.random() * 100000)}`,
    };
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: error.message || 'Error creating Razorpay order' });
  }
}
