import { RequestHandler } from 'express';
import { get } from 'lodash';
import { findSessionById, reIssueAccessToken } from '../services/auth.service';
import { verifyJWT } from '../utils/jwt';

const deserializeUser: RequestHandler = async (req, res, next) => {
    const authorizationHeader = get(req, 'headers.authorization', '') as string;
    const accessToken = authorizationHeader.replace(/^Bearer\s/, '');
    const refreshToken = get(req, 'headers.x-refresh-token', '');

    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = verifyJWT(accessToken, 'accessTokenPublicKey');

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);
            const result = verifyJWT(
                newAccessToken as string,
                'accessTokenPublicKey'
            );

            res.locals.user = result.decoded;
            return next();
        }
    }

    const sessionId = get(decoded, 'sessionId');

    if (sessionId) {
        const session = await findSessionById(sessionId);

        if (!session) return next();
        if (!session.valid) return next();

        res.locals.user = decoded;
        return next();
    }

    return next();
};

export default deserializeUser;
