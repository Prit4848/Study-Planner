// routes/qrCode.js
const express = require('express');
const router = express.Router();
const { getQRCodeImage } = require('../middleware/whatsapp'); // Adjust the path as needed

router.get('/qr-code', async (req, res) => {
    try {
        const qrCodeImage = await getQRCodeImage();
        console.log(qrCodeImage);
        if (qrCodeImage) {
            res.json({ qrCodeImage });
        } else {
            res.status(404).send('QR code not available');
        }
    } catch (err) {
        console.error('Error fetching QR code image', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
