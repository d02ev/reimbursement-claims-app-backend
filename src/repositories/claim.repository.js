import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';
import RepositoryError from '../errors/repository.error';
import { DB_ERROR_CODES } from '../constants/error.codes';

export default class ClaimRepository {
  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async create(date, requestedAmt, receipt, currency, claimType, userId) {
    try {
      const newClaim = await this.prismaClient.claim.create({
        data: {
          date,
          requestedAmt,
          userId,
          receipt: {
            create: {
              receipt,
            },
          },
          currency: {
            connectOrCreate: {
              where: { currency },
              create: { currency },
            },
          },
          claimType: {
            connectOrCreate: {
              where: { type: claimType },
              create: { type: claimType },
            },
          },
        },
      });

      return newClaim.id;
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

  async fetchAllApproved() {
    try {
      return await this.prismaClient.claim.findMany({
        where: {
          AND: [
            { isApproved: true },
            { isDeclined: false },
          ],
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
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

  async fetchAllDeclined() {
    try {
      return await this.prismaClient.claim.findMany({
        where: {
          AND: [
            { isApproved: false },
            { isDeclined: true },
          ],
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
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

  async fetchAllInProcess() {
    try {
      return await this.prismaClient.claim.findMany({
        where: {
          AND: [
            { isApproved: false },
            { isDeclined: false },
          ],
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
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

  async fetchByUserId(userId) {
    try {
      return await this.prismaClient.claim.findMany({
        where: { userId },
        include: {
          user: false,
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
}
