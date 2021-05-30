import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  PrimaryColumn, DeleteDateColumn
} from 'typeorm'
import { Submission } from './Submission'
import { createHash } from 'crypto'

@Entity()
export class Vouch extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({
    type: 'citext'
  })
  fromSubmissionEthAddress: string

  @ManyToOne(type => Submission, async submission => await submission.vouchedFor)
  fromSubmission: Promise<Submission>

  @Column({
    type: 'citext'
  })
  toSubmissionEthAddress: string

  @ManyToOne(type => Submission, async submission => await submission.vouchedBy)
  toSubmission: Promise<Submission>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null

  generateId (): void {
    this.id = createHash('md5').update(this.fromSubmissionEthAddress + this.toSubmissionEthAddress).digest('hex')
  }
}
