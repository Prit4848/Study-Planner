const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

var qrCodeImage = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code', err);
        } else {
            qrCodeImage = url;
            console.log('QR Code Image URL:', qrCodeImage); // Log for debugging
        }
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
    qrCodeImage = ''; // Clear QR code after client is ready
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.initialize();



const getQRCodeImage = async () => {
    return qrCodeImage;
};

module.exports = { client, getQRCodeImage };
