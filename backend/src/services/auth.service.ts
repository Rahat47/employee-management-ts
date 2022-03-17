import { DocumentType } from '@typegoose/typegoose';
import SessionModel from '../models/session.model';
import { User } from '../models/user.model';
import { signJWT } from '../utils/jwt';
import { omitUserData } from '../utils/omitData';

export async function createSession(userId: string) {
    const session = await SessionModel.create({ user: userId });
    return session;
}

export function signAccessToken(user: DocumentType<User>) {
    const payload = omitUserData(user);

    const accessToken = signJWT(payload, 'accessTokenPrivateKey', {
        expiresIn: '15m',
    });
    return accessToken;
}

export async function signRefreshToken(userId: string) {
    const session = await createSession(userId);

    const refreshToken = signJWT(
        { session: session._id },
        'refreshTokenPrivateKey',
        { expiresIn: '7d' }
    );
    return refreshToken;
}
