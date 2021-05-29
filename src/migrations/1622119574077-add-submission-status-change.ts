import { MigrationInterface, QueryRunner } from 'typeorm'

export class addSubmissionStatusChange1622119574077 implements MigrationInterface {
  name = 'addSubmissionStatusChange1622119574077'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "submission_status_change" ("id" character varying NOT NULL, "newStatus" "submission_status_enum" NOT NULL, "networkAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "submissionEthAddress" citext NOT NULL, "requestId" character varying, CONSTRAINT "PK_9bb64aab8226a8bbd88526b593b" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "submission_status_change" ADD CONSTRAINT "FK_22a068d60ea9885456b14903e91" FOREIGN KEY ("submissionEthAddress") REFERENCES "submission"("ethAddress") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "submission_status_change" ADD CONSTRAINT "FK_215279ca6765796f6e26a443707" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "submission_status_change" DROP CONSTRAINT "FK_215279ca6765796f6e26a443707"')
    await queryRunner.query('ALTER TABLE "submission_status_change" DROP CONSTRAINT "FK_22a068d60ea9885456b14903e91"')
    await queryRunner.query('DROP TABLE "submission_status_change"')
  }
}
