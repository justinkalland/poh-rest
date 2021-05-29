import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  PrimaryColumn
} from 'typeorm'
import { Request } from './Request'
import { Submission, SubmissionStatus } from './Submission'
import { createHash } from 'crypto'

@Entity()
export class SubmissionStatusChange extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    enumName: 'submission_status_enum'
  })
  newStatus: SubmissionStatus

  @Column()
  networkAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({
    type: 'citext'
  })
  submissionEthAddress: string

  @ManyToOne(type => Submission, async submission => await submission.submissionStatusChanges)
  submission: Promise<Submission>

  @Column({
    nullable: true,
    default: null
  })
  requestId: string

  @ManyToOne(type => Request, async request => await request.submissionStatusChanges)
  request: Promise<Request>

  generateId (): void {
    this.id = createHash('md5').update(this.submissionEthAddress + this.networkAt.getTime().toString()).digest('hex')
  }

  toPublicStatusChange (): object {
    return {
      status: this.newStatus,
      time: this.networkAt
    }
  }
}
