import { DocumentType } from '@typegoose/typegoose';
import { get } from 'lodash';
import SessionModel, { Session } from '../models/session.model';
import { User } from '../models/user.model';
import { signJWT, verifyJWT } from '../utils/jwt';
import { omitUserData } from '../utils/omitData';
import { findUser, findUserById } from './user.service';
import { FilterQuery, UpdateQuery } from 'mongoose';

export async function createSession(userId: string) {
    const session = await SessionModel.create({ user: userId });
    return session;
}

export function signAccessToken(user: DocumentType<User>, sessionId: string) {
    const payload = {
        ...omitUserData(user),
        sessionId,
    };

    const accessToken = signJWT(payload, 'accessTokenPrivateKey', {
        expiresIn: '15m',
    });
    return accessToken;
}

export async function signRefreshToken(sessionId: string) {
    const refreshToken = signJWT(
        { session: sessionId },
        'refreshTokenPrivateKey',
        { expiresIn: '7d' }
    );
    return refreshToken;
}

export async function findSessionById(id: string) {
    const session = await SessionModel.findById(id);
    return session;
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    const { decoded } = verifyJWT(refreshToken, 'refreshTokenPublicKey');

    if (!decoded || !get(decoded, 'session')) return false;

    const session = await SessionModel.findById(get(decoded, 'session'));

    if (!session || !session.valid) return false;

    const user = await findUserById(String(session.user));

    if (!user) return false;

    const accessToken = signJWT(
        omitUserData(user),
        'accessTokenPrivateKey',
        { expiresIn: '15m' } // 15 minutes
    );

    return accessToken;
}

export async function updateSession(
    query: FilterQuery<DocumentType<Session>>,
    update: UpdateQuery<DocumentType<Session>>
) {
    const session = await SessionModel.findOneAndUpdate(query, update, {
        new: true,
    });
    return session;
}
