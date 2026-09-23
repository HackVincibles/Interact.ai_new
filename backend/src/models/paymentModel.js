// Payment Database Model
import { dbPool } from '../config/database.js';

export class PaymentModel {
  static async createOrder(orderData) {
    const { orderId, userId, customerEmail, amount, currency = 'INR', status = 'PENDING' } = orderData;
    try {
      const result = await dbPool.query(
        `INSERT INTO payments (order_id, user_id, customer_email, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [orderId, userId || null, customerEmail, amount, currency, status]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (createOrder):', err.message);
      return { order_id: orderId, amount, status };
    }
  }

  static async updatePaymentStatus(orderId, status, transactionId) {
    try {
      const result = await dbPool.query(
        `UPDATE payments SET status = $1, transaction_id = $2 WHERE order_id = $3 RETURNING *`,
        [status, transactionId, orderId]
      );
      return result.rows[0];
    } catch (err) {
      console.warn('Postgres query fallback (updatePaymentStatus):', err.message);
      return { order_id: orderId, status, transaction_id: transactionId };
    }
  }
}
