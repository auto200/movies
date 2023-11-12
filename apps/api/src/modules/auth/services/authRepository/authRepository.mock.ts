import { randomUUID } from 'crypto';

import { SignupResponseDTO } from '@movies/shared/communication';

import { DbUser } from '@/config/database/connectJSONDb';

import { UserNotFoundError } from '../../errors/userNotFoundError';
import { JwtPayload } from '../../schema';

import { AuthRepository } from './authRepository';

export function MockAuthRepository(initialUsers: DbUser[] = []): AuthRepository {
  const users = initialUsers;

  return {
    addRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);
      if (!user) throw new UserNotFoundError(userId);

      user.refreshTokens.push(refreshToken);
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    doesUserWithEmailExist: (email) =>
      Promise.resolve(!!users.find((user) => user.email === email)),

    doesUserWithUsernameExist: (username) =>
      Promise.resolve(!!users.find((user) => user.username === username)),

    getByEmail: (email) => {
      const user = users.find((user) => user.email === email) ?? null;

      if (!user) return Promise.resolve(null);

      const userData: JwtPayload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve({ password: user.password, user: userData });
    },

    getUserByRefreshToken: (refreshToken) => {
      const user = users.find((user) => user.refreshTokens.includes(refreshToken));
      if (!user) return Promise.resolve(null);

      const toReturn: JwtPayload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };

      return Promise.resolve(toReturn);
    },

    removeAllRefreshTokens: (userId) => {
      const user = users.find((user) => user.id === userId);
      if (!user) return Promise.resolve();

      user.refreshTokens = [];
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    removeRefreshToken: (userId, refreshToken) => {
      const user = users.find((user) => user.id === userId);

      if (!user) return Promise.resolve();

      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
      user.updatedAt = Date.now().toString();

      return Promise.resolve();
    },

    signup: (user) => {
      const now = Date.now().toString();
      const userToAdd: DbUser = {
        ...user,
        createdAt: now,
        id: randomUUID(),
        refreshTokens: [],
        updatedAt: now,
      };
      users.push(userToAdd);

      const addedUser: SignupResponseDTO = {
        email: user.email,
        username: user.username,
      };

      return Promise.resolve(addedUser);
    },
  };
}
