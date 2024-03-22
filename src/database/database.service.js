import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '../constants/app.constants';

export default class DatabaseService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }

  cleanDb() {
    this.$transaction([
      this.user.deleteMany(),
      this.passwordDetail.deleteMany(),
      this.bankDetail.deleteMany(),
      this.claim.deleteMany(),
      this.role.deleteMany(),
      this.receipt.deleteMany(),
      this.currency.deleteMany(),
      this.claimType.deleteMany(),
    ]);
  }
}
