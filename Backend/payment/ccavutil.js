const crypto = require('crypto')
function getAlgorithm(keyBase64) {
    const key = Buffer.from(keyBase64, 'base64');
    // console.log("key ",key);
    // console.log("key ",key.length);
    // console.log("base ",keyBase64);
    switch (key.length) {
        case 16:
            return 'aes-128-cbc';
        case 32:
            return 'aes-256-cbc';

    }
    throw new Error('Invalid key length: ' + key.length);
}

exports.encrypt = function(plainText, keyBase64, ivBase64) {
    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    return encrypted;
}

exports.decrypt = function(messagebase64, keyBase64, ivBase64) {

    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
    let decrypted = decipher.update(messagebase64, 'hex');
    decrypted += decipher.final();
    return decrypted;
}
