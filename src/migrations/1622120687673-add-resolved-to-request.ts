import { MigrationInterface, QueryRunner } from 'typeorm'

export class addResolvedToRequest1622120687673 implements MigrationInterface {
  name = 'addResolvedToRequest1622120687673'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "request" ADD "networkResolvedAt" TIMESTAMP')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "request" DROP COLUMN "networkResolvedAt"')
  }
}
