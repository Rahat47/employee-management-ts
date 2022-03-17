import { RequestHandler } from 'express';
import { get } from 'lodash';
import { verifyJWT } from '../utils/jwt';

const deserializeUser: RequestHandler = async (req, res, next) => {
    const authorizationHeader = get(req, 'headers.authorization', '') as string;
    const accessToken = authorizationHeader.replace(/^Bearer\s/, '');

    if (!accessToken) {
        return next();
    }

    const decoded = verifyJWT(accessToken, 'accessTokenPublicKey');

    if (decoded) {
        res.locals.user = decoded;
    }

    return next();
};

export default deserializeUser;
