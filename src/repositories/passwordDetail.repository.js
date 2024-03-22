import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import RepositoryError from '../errors/repository.error';
import { DB_ERROR_CODES } from '../constants/error.codes';

export default class PasswordDetailRepository {
  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async fetchPasswordHashByUserId(userId) {
    try {
      return await this.prismaClient.passwordDetail.findUniqueOrThrow({
        where: { userId },
        select: {
          passwordHash: true,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new RepositoryError(
            'User does not exist',
            DB_ERROR_CODES.RECORD_DOES_NOT_EXIST,
            false,
            err.meta,
          );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          true,
          err.meta,
          err.stack,
        );
      }

      throw new RepositoryError(
        err.message,
        DB_ERROR_CODES.UNKNOWN_DB_ERROR,
        true,
        err,
        err.stack,
      );
    }
  }

  async updateRefreshToken(userId, newRefreshToken) {
    try {
      await this.prismaClient.passwordDetail.update({
        where: { userId },
        data: {
          refreshToken: newRefreshToken,
        },
      });

      return true;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2000') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.COLUMN_VALUE_DATATYPE_MISMATCH,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2002') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2003') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2006') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.INVALID_VALUE,
            true,
            err.meta,
            err.stack,
          );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          true,
          err.meta,
          err.stack,
        );
      }

      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_DB_ERROR, true, err, err.stack);
    }
  }
}
