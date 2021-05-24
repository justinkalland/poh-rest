import { MigrationInterface, QueryRunner } from 'typeorm'

export class hello1621774155000 implements MigrationInterface {
  name = 'hello1621774155000'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "submission_status_enum" AS ENUM(\'VOUCHING\', \'PENDING_REGISTRATION_REQUEST\', \'PENDING_REMOVAL_REQUEST\', \'DISPUTED_PENDING_REGISTRATION_REQUEST\', \'DISPUTED_PENDING_REMOVAL_REQUEST\', \'REGISTERED\', \'EXPIRED\', \'REMOVED\')')
    await queryRunner.query('CREATE TABLE "submission" ("ethAddress" citext NOT NULL, "vanityId" integer, "status" "submission_status_enum" NOT NULL DEFAULT \'VOUCHING\', "currentlyRegistered" boolean NOT NULL DEFAULT false, "networkSubmissionAt" TIMESTAMP, "networkCreationAt" TIMESTAMP NOT NULL, "displayName" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "bio" character varying, "photoUri" character varying, "videoUri" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31b9f4d45368c2c147e85ba9dbc" PRIMARY KEY ("ethAddress"))')
    await queryRunner.query('CREATE TABLE "request" ("id" character varying NOT NULL, "resolved" boolean NOT NULL DEFAULT false, "disputed" boolean NOT NULL DEFAULT false, "isRegistration" boolean NOT NULL, "networkCreationAt" TIMESTAMP NOT NULL, "networkLastChangeAt" TIMESTAMP NOT NULL, "requesterEthAddress" citext NOT NULL, "requesterLost" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "submissionEthAddress" citext NOT NULL, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "evidence" ("id" character varying NOT NULL, "senderEthAddress" citext NOT NULL, "uri" character varying NOT NULL, "isJson" boolean, "isRegistration" boolean, "cache" json, "networkCreationAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "submissionEthAddress" citext NOT NULL, "requestId" character varying NOT NULL, CONSTRAINT "PK_b864cb5d49854f89917fc0b44b9" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "request" ADD CONSTRAINT "FK_4c161c3f8a4390dabc2dc759070" FOREIGN KEY ("submissionEthAddress") REFERENCES "submission"("ethAddress") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "evidence" ADD CONSTRAINT "FK_f61d3d9d730c9f9a38864d9d172" FOREIGN KEY ("submissionEthAddress") REFERENCES "submission"("ethAddress") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "evidence" ADD CONSTRAINT "FK_63abac2c4f411403c29df3cd697" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "evidence" DROP CONSTRAINT "FK_63abac2c4f411403c29df3cd697"')
    await queryRunner.query('ALTER TABLE "evidence" DROP CONSTRAINT "FK_f61d3d9d730c9f9a38864d9d172"')
    await queryRunner.query('ALTER TABLE "request" DROP CONSTRAINT "FK_4c161c3f8a4390dabc2dc759070"')
    await queryRunner.query('DROP TABLE "evidence"')
    await queryRunner.query('DROP TABLE "request"')
    await queryRunner.query('DROP TABLE "submission"')
    await queryRunner.query('DROP TYPE "submission_status_enum"')
  }
}
