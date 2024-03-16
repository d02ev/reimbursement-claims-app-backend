import { PrismaClient } from '@prisma/client'

export default class DatabaseService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		})
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
		])
	}
}
