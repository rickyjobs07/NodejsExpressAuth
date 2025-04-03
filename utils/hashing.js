const { hash, compare } = require('bcryptjs');

exports.doHash = async (value,saltValue) => {
    const result = await hash(value, saltValue);
    return result;
}

exports.doHashValidation = async (value, hashedValue) => {
    const result = await compare(value, hashedValue);
    return result;
}