import { MigrationInterface, QueryRunner } from 'typeorm'

export class addVouch1622387024364 implements MigrationInterface {
  name = 'addVouch1622387024364'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "vouch" ("id" character varying NOT NULL, "fromSubmissionEthAddress" citext NOT NULL, "toSubmissionEthAddress" citext NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ec75f6218b1d01f967df2f96373" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "vouch" ADD CONSTRAINT "FK_e9cdd2e0df07930b071468a5310" FOREIGN KEY ("fromSubmissionEthAddress") REFERENCES "submission"("ethAddress") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "vouch" ADD CONSTRAINT "FK_75e0a68d20feb0dcab73a7b2b37" FOREIGN KEY ("toSubmissionEthAddress") REFERENCES "submission"("ethAddress") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "vouch" DROP CONSTRAINT "FK_75e0a68d20feb0dcab73a7b2b37"')
    await queryRunner.query('ALTER TABLE "vouch" DROP CONSTRAINT "FK_e9cdd2e0df07930b071468a5310"')
    await queryRunner.query('DROP TABLE "vouch"')
  }
}
