const { createHmac } = require('crypto');
const { hash, compare } = require('bcryptjs');

exports.doHash = async (value,saltValue) => {
    const result = await hash(value, saltValue);
    return result;
}

exports.doHashValidation = async (value, hashedValue) => {
    const result = await compare(value, hashedValue);
    return result;
}

exports.hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}