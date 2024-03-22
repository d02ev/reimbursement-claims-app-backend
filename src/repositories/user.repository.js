import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import logger from '../utils/logger';
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
    refreshToken,
    role,
    approverStatus,
    bankName,
    ifsc,
    bankAccNum,
    pan,
  ) {
    try {
      const newUser = await this.prismaClient.user.create({
        data: {
          fullName,
          email,
          isApprover: approverStatus,
          passwordDetail: {
            create: {
              passwordHash,
              refreshToken,
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
          roles: {
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
        // eslint-disable-next-line default-case
        switch (err.code) {
          case 'P2000':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.COLUMN_VALUE_DT_MISMATCH,
              err.meta,
              err.stack,
            );
          case 'P2001':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.WHERE_CONDITION_DOES_NOT_EXIST,
              err.meta,
              err.stack,
            );
          case 'P2002':
            throw new RepositoryError(
              `User ${err.meta.target} already exists`,
              DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
              err.meta,
            );
          case 'P2003':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE,
              err.meta,
              err.stack,
            );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        logger.error(err.message, { errorMetadata: err.meta });
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          err.meta,
          err.stack,
        );
      }

      logger.error(err.message, { errorMetadata: err });
      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack);
    }
  }

  async fetchAll() {
    try {
      return await this.prismaClient.user.findMany({
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // eslint-disable-next-line default-case
        switch (err.code) {
          case 'P2015':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.NO_RELATED_RECORDS,
              err.meta,
              err.stack,
            );
          case 'P2017':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.RELATIONS_NOT_CONNECTED,
              err.meta,
              err.stack,
            );
          case 'P2018':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND,
              err.meta,
              err.stack,
            );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        logger.error(err.message, { errorMetadata: err.meta });
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          err.meta,
          err.stack,
        );
      }

      logger.error(err.message, { errorMetadata: err });
      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack);
    }
  }

  async fetchById(userId) {
    try {
      return await this.prismaClient.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // eslint-disable-next-line default-case
        switch (err.code) {
          case 'P2025':
            throw new RepositoryError(
              `User with ${err.meta.target}=${userId} does not exist`,
              DB_ERROR_CODES.RECORD_DOES_NOT_EXIST,
              err.meta,
            );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        logger.error(err.message, { errorMetadata: err.meta });
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          err.meta,
          err.stack,
        );
      }

      logger.error(err.message, { errorMetadata: err });
      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack);
    }
  }

  async fetchByEmail(email) {
    try {
      return await this.prismaClient.user.findUniqueOrThrow({
        where: { email },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // eslint-disable-next-line default-case
        switch (err.code) {
          case 'P2025':
            throw new RepositoryError(
              `User with ${err.meta.target}=${email} does not exist`,
              DB_ERROR_CODES.RECORD_DOES_NOT_EXIST,
              err.meta,
            );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        logger.error(err.message, { errorMetadata: err.meta });
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          err.meta,
          err.stack,
        );
      }

      logger.error(err.message, { errorMetadata: err });
      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack);
    }
  }

  async fetchUserRoles(userId) {
    try {
      const user = await this.prismaClient.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      });

      return user.roles;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // eslint-disable-next-line default-case
        switch (err.code) {
          case 'P2025':
            throw new RepositoryError(
              `User with ${err.meta.target}=${userId} does not exist`,
              DB_ERROR_CODES.RECORD_DOES_NOT_EXIST,
              err.meta,
            );
          case 'P2001':
            logger.error(err.message, { errorMetadata: err.meta.target });
            throw new RepositoryError(
              err.message,
              DB_ERROR_CODES.WHERE_CONDITION_DOES_NOT_EXIST,
              err.meta,
              err.stack,
            );
        }
      } else if (err instanceof PrismaClientUnknownRequestError) {
        logger.error(err.message, { errorMetadata: err.meta });
        throw new RepositoryError(
          err.message,
          DB_ERROR_CODES.UNKNOWN_ORM_ERROR,
          err.meta,
          err.stack,
        );
      }

      logger.error(err.message, { errorMetadata: err });
      throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack);
    }
  }
}
