
'use client';
import { Timestamp } from 'firebase/firestore';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
}

type OrderStatus = 'Pending' | 'Processing' | 'Delivered';

interface Order {
  id: string;
  orderDate: Timestamp;
  totalAmount: number;
  orderItems: OrderItem[];
  status: OrderStatus;
}

const DELIVERY_CHARGE = 60; // Standard delivery charge

export const generateInvoiceHTML = (order: Order, customerName: string): string => {
  const subtotal = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = subtotal + DELIVERY_CHARGE;

  const orderDate = new Date(order.orderDate.seconds * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const itemsHTML = order.orderItems
    .map(
      (item) => `
    <tr class="item">
      <td>${item.title}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">৳${item.price.toFixed(2)}</td>
      <td style="text-align: right;">৳${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${order.id.slice(0, 7)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; }
        .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        .invoice-box table td { padding: 8px; vertical-align: top; }
        .invoice-box table tr.top table td { padding-bottom: 20px; }
        .invoice-box table tr.top table td.title h2 { font-size: 45px; line-height: 45px; color: #333; margin: 0; }
        .invoice-box table tr.information table td { padding-bottom: 40px; }
        .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; text-align: left; }
        .invoice-box table tr.details td { padding-bottom: 20px; }
        .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
        .invoice-box table tr.item.last td { border-bottom: none; }
        .invoice-box table tr.total td:nth-child(3), .invoice-box table tr.total td:nth-child(4) { border-top: 2px solid #eee; font-weight: bold; text-align: right; }
        @media print {
            .invoice-box { box-shadow: none; border: 0; }
            body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table>
          <tr class="top">
            <td colspan="4">
              <table>
                <tr>
                  <td class="title"><h2>Super Shop</h2></td>
                  <td style="text-align: right;">
                    Invoice #: ${order.id.slice(0, 7)}<br>
                    Created: ${orderDate}<br>
                    Status: ${order.status}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    <strong>Bill To:</strong><br>
                    ${customerName}<br>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="heading">
            <td>Item</td>
            <td style="text-align: center;">Quantity</td>
            <td style="text-align: right;">Unit Price</td>
            <td style="text-align: right;">Total</td>
          </tr>
          ${itemsHTML}
          <tr class="total">
            <td colspan="2"></td>
            <td>Subtotal:</td>
            <td>৳${subtotal.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="2"></td>
            <td>Delivery Charge:</td>
            <td>৳${DELIVERY_CHARGE.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="2"></td>
            <td><strong>Grand Total:</strong></td>
            <td><strong>৳${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
};
