// Cashfree Payment Gateway Controller
import { PaymentService } from '../services/paymentService.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const result = await PaymentService.createPaymentOrder(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const result = await PaymentService.verifyPayment(orderId);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
