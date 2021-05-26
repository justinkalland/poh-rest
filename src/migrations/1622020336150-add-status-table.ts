import { MigrationInterface, QueryRunner } from 'typeorm'

export class addStatusTable1622020336150 implements MigrationInterface {
  name = 'addStatusTable1622020336150'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "status" ("timestamp" integer NOT NULL, "registry" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_86e6fc051cd3e70747b07ab99e7" PRIMARY KEY ("timestamp"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "status"')
  }
}
