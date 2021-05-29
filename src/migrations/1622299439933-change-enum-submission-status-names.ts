import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeEnumSubmissionStatusNames1622299439933 implements MigrationInterface {
  name = 'changeEnumSubmissionStatusNames1622299439933'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'PENDING_REGISTRATION_REQUEST\' TO \'PENDING_REGISTRATION\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'PENDING_REMOVAL_REQUEST\' TO \'PENDING_REMOVAL\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'DISPUTED_PENDING_REGISTRATION_REQUEST\' TO \'DISPUTED_PENDING_REGISTRATION\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'DISPUTED_PENDING_REMOVAL_REQUEST\' TO \'DISPUTED_PENDING_REMOVAL\'')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'PENDING_REGISTRATION\' TO \'PENDING_REGISTRATION_REQUEST\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'PENDING_REMOVAL\' TO \'PENDING_REMOVAL_REQUEST\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'DISPUTED_PENDING_REGISTRATION\' TO \'DISPUTED_PENDING_REGISTRATION_REQUEST\'')
    await queryRunner.query('ALTER TYPE "submission_status_enum" RENAME VALUE \'DISPUTED_PENDING_REMOVAL\' TO \'DISPUTED_PENDING_REMOVAL_REQUEST\'')
  }
}
