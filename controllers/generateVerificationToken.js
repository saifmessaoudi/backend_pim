import crypto from 'crypto';

const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

export default generateVerificationToken;
