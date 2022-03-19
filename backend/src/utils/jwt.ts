import jwt from 'jsonwebtoken';
import config from 'config';

export const signJWT = (
    payload: Object,
    keyname: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: jwt.SignOptions
) => {
    const signingKey = Buffer.from(
        config.get<string>(keyname),
        'base64'
    ).toString('ascii');

    return jwt.sign(payload, signingKey, {
        ...(options || {}),
        algorithm: 'RS256',
    });
};

export const verifyJWT = <T>(
    token: string,
    keyname: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) => {
    const signingKey = Buffer.from(
        config.get<string>(keyname),
        'base64'
    ).toString('ascii');

    try {
        const decoded = jwt.verify(token, signingKey);
        return {
            decoded: decoded as T,
            valid: true,
            expired: false,
        };
    } catch (error: any) {
        return {
            valid: false,
            expired:
                error.name === 'TokenExpiredError' ||
                error.message === 'jwt expired',
            decoded: null,
        };
    }
};
