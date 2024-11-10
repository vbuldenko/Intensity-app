import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { ApiError } from '../exceptions/api.error';
import * as userService from './user.service';
import Token from '../db/models/Token';
export function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '1d',
    });
}
export function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
    });
}
export function generateResetToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '1h',
    });
}
export function validateAccessToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    }
    catch (error) {
        return null;
    }
}
export function validateRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
export function validateResetToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
export const save = async (userId, refreshToken) => {
    const user = await userService.getById(userId);
    if (!user) {
        throw ApiError.NotFound();
    }
    let token = await Token.findOne({ userId });
    if (!token) {
        await Token.create({ userId, refreshToken });
        return;
    }
    token.refreshToken = refreshToken;
    await token.save();
};
export const getByToken = (refreshToken) => {
    return Token.findOne({ refreshToken });
};
export const removeByUserId = (userId) => {
    return Token.deleteOne({ userId });
};
export async function generateTokensData(user) {
    const userData = userService.normalize(user);
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);
    await save(userData.id, refreshToken);
    return { accessToken, refreshToken, userData };
}
