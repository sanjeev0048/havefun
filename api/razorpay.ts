import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay keys not configured on server' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    if (action === 'createOrder') {
      const { amount } = payload; // amount in INR
      
      const options = {
        amount: Math.round(amount * 100), // convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return res.status(200).json(order);
    } 
    
    if (action === 'verifyPayment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        return res.status(200).json({ verified: true });
      } else {
        return res.status(400).json({ verified: false, error: 'Invalid signature' });
      }
    }
    
    if (action === 'refundPayment') {
      const { payment_id, amount } = payload;
      const refundOptions: any = {};
      if (amount) {
          refundOptions.amount = Math.round(amount * 100);
      }
      const refund = await razorpay.payments.refund(payment_id, refundOptions);
      return res.status(200).json(refund);
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Razorpay API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
