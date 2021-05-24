import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { Request } from './Request'
import { Submission } from './Submission'

@Entity()
export class Evidence extends BaseEntity {
  @PrimaryColumn({
    update: false
  })
  id: string

  @Column({
    type: 'citext'
  })
  senderEthAddress: string

  @Column()
  uri: string

  @Column({
    nullable: true,
    default: null
  })
  isJson: boolean

  @Column({
    nullable: true,
    default: null
  })
  isRegistration: boolean

  @Column({
    nullable: true,
    default: null,
    type: 'json'
  })
  cache: { [prop: string]: any }

  @Column({
    update: false
  })
  networkCreationAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({
    type: 'citext'
  })
  submissionEthAddress: string

  @ManyToOne(type => Submission, async submission => await submission.evidence)
  submission: Promise<Submission>

  @Column()
  requestId: string

  @ManyToOne(type => Request, async request => await request.evidence)
  request: Promise<Request>

  public get sentBySelf (): boolean {
    return this.submissionEthAddress === this.senderEthAddress
  }
}
