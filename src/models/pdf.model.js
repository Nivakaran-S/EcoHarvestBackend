const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateAllOrdersPDF = async (orders) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filePath = path.join(__dirname, 'all_orders.pdf');
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      
      doc.fontSize(20).text('All Orders Report', { align: 'center' });
      doc.moveDown();

      orders.forEach((order) => {
        doc.fontSize(14).text(`Order #${order.orderNumber}`, { underline: true });
        doc.fontSize(12).text(`Order Date: ${new Date(order.orderTime).toLocaleString()}`);
        doc.text(`Status: ${order.status}`);
        doc.text(`Total Amount: Rs. ${order.totalAmount.toFixed(2)}`);
        doc.moveDown();

        
        doc.fontSize(12);
        doc.text('Product', 50);
        doc.text('Qty', 250);
        doc.text('Unit Price', 300);
        doc.text('Subtotal', 400);
        doc.moveDown();

        
        order.products.forEach((item) => {
          const productName = item.productId?.name || 'Unknown Product';
          const quantity = item.quantity;
          const unitPrice = `Rs. ${item.unitPrice.toFixed(2)}`;
          const subtotal = `Rs. ${(item.quantity * item.unitPrice).toFixed(2)}`;

          doc.text(productName, 50);
          doc.text(quantity.toString(), 250);
          doc.text(unitPrice, 300);
          doc.text(subtotal, 400);
          doc.moveDown();
        });

        doc.moveDown();
        doc.text('-----------------------------------------------', { align: 'center' });
        doc.moveDown();
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

    } catch (error) {
      reject(error);
    }
  });
};


module.exports = {generateAllOrdersPDF};
