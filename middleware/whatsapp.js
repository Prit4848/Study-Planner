const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

let qrCodeImage = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code', err);
        } else {
            qrCodeImage = url;
            // console.log('QR Code Image URL:', qrCodeImage); // Log for debugging
        }
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
    qrCodeImage = 'https://tse4.mm.bing.net/th?id=OIP._nofy4maMW_1BH_XqcNWEwHaHa&pid=Api&P=0&h=180'; // Clear QR code after client is ready
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    handleClientLogout();
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    handleClientLogout();
});

client.on('error', (error) => {
    console.error('Client error:', error);
    handleClientLogout();
});

const handleClientLogout = () => {
    // Clear the QR code image as the client has logged out
    qrCodeImage = '';
    // Delete session files
    deleteSessionFiles();
    // Re-initialize the client after a delay
    setTimeout(() => {
        console.log('Reinitializing client...');
        client.initialize();
    }, 5000); // Reinitialize after 5 seconds
};

const deleteSessionFiles = () => {
    const sessionPath = 'D:\\Study planner website\\website\\.wwebjs_auth\\session\\Default';
    const logFilePath = path.join(sessionPath, 'chrome_debug.log');

    try {
        if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
            console.log(`Deleted log file: ${logFilePath}`);
        }
        if (fs.existsSync(sessionPath)) {
            fs.rmdirSync(sessionPath, { recursive: true });
            console.log(`Deleted session directory: ${sessionPath}`);
        }
    } catch (err) {
        console.error('Error deleting session files:', err);
    }
};

const retryUnlink = (path, retries = 5, delay = 1000) => {
    return new Promise((resolve, reject) => {
        const attemptUnlink = (attempt) => {
            fs.unlink(path, (err) => {
                if (err && err.code === 'EBUSY' && attempt < retries) {
                    console.warn(`Retrying unlink of ${path}... (${attempt + 1}/${retries})`);
                    setTimeout(() => attemptUnlink(attempt + 1), delay);
                } else if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        };
        attemptUnlink(0);
    });
};

client.initialize().catch(async (err) => {
    if (err.message.includes('EBUSY: resource busy or locked')) {
        console.error('Error during client initialization:', err.message);
        const logFilePath = 'D:\\Study planner website\\website\\.wwebjs_auth\\session\\Default\\chrome_debug.log';
        try {
            await retryUnlink(logFilePath);
            console.log('Successfully unlinked the busy log file, reinitializing client...');
            client.initialize();
        } catch (unlinkErr) {
            console.error('Failed to unlink the busy log file:', unlinkErr.message);
        }
    } else {
        console.error('Unhandled error during client initialization:', err.message);
    }
});

const getQRCodeImage = async () => {
    return qrCodeImage;
};

module.exports = { client, getQRCodeImage };
