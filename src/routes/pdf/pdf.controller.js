

const {generateAllOrdersPDF} = require('../../models/pdf.model')

const httpGenerateOrdersPDF = async (req, res) => {
    try {
        const filePath = await generateAllOrdersPDF();
        res.download(filePath, 'all_orders.pdf', (err) => {
            if (err) {
                console.error('Error downloading PDF:', err);
                res.status(500).send('Error downloading PDF');
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
}

module.exports = {
    httpGenerateOrdersPDF
}