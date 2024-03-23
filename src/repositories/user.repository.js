import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import crypto from 'crypto';
import RepositoryError from '../errors/repository.error';
import { DB_ERROR_CODES } from '../constants/error.codes';

export default class UserRepository {
  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async create(
    fullName,
    email,
    passwordHash,
    bankName,
    ifsc,
    bankAccNum,
    pan,
    role = 'user',
  ) {
    try {
      const newUser = await this.prismaClient.user.create({
        data: {
          fullName,
          email,
          passwordDetail: {
            create: {
              passwordHash,
              refreshToken: crypto.randomBytes(10).toString(),
            },
          },
          bankDetail: {
            create: {
              bankName,
              ifsc,
              bankAccNum,
              pan,
            },
          },
          role: {
            connectOrCreate: {
              where: { role },
              create: { role },
            },
          },
        },
      });

      return newUser.fullName;
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
        } else if (err.code === 'P2001') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.WHERE_CONDITION_DOES_NOT_EXIST,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2002') {
          throw new RepositoryError(
            `User ${err.meta.target} already exists`,
            DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
            false,
            err.meta,
          );
        } else if (err.code === 'P2003') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE,
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

  async fetchAll() {
    try {
      return await this.prismaClient.user.findMany({
        where: {
          role: {
            role: 'user',
          },
        },
        include: {
          role: false,
          passwordDetail: false,
          bankDetail: false,
          claims: false,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2015') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.NO_RELATED_RECORDS,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2017') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.RELATIONS_NOT_CONNECTED,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.code === 'P2018') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND,
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

  async fetchById(userId) {
    try {
      return await this.prismaClient.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          role: {
            select: {
              role: true,
            },
          },
          passwordDetail: false,
          bankDetail: false,
          claims: false,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new RepositoryError(
            err.message,
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

      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_DB_ERROR, true, err, err.stack);
    }
  }

  async fetchByEmail(email) {
    try {
      return await this.prismaClient.user.findUniqueOrThrow({
        where: { email },
        include: {
          role: false,
          passwordDetail: false,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new RepositoryError(
            err.message,
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

      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_DB_ERROR, true, err, err.stack);
    }
  }

  async fetchUserRoles(userId) {
    try {
      const user = await this.prismaClient.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          role: {
            select: {
              role: true,
            },
          },
          passwordDetail: false,
          bankDetail: false,
        },
      });

      return user.role;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.RECORD_DOES_NOT_EXIST,
            false,
            err.meta,
          );
        } else if (err.code === 'P2001') {
          throw new RepositoryError(
            err.message,
            DB_ERROR_CODES.WHERE_CONDITION_DOES_NOT_EXIST,
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
