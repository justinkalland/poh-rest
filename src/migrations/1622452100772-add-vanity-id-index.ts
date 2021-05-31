import { MigrationInterface, QueryRunner } from 'typeorm'

export class addVanityIdIndex1622452100772 implements MigrationInterface {
  name = 'addVanityIdIndex1622452100772'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_e348665ec71d6aaae8d1b611ab" ON "submission" ("vanityId") ')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_e348665ec71d6aaae8d1b611ab"')
  }
}
