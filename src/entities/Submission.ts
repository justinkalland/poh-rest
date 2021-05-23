import { Entity, Column, PrimaryColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Request } from './Request'
import { Evidence } from './Evidence'

export enum SubmissionStatus {
  VOUCHING = 'VOUCHING',
  PENDING_REGISTRATION_REQUEST = 'PENDING_REGISTRATION_REQUEST',
  PENDING_REMOVAL_REQUEST = 'PENDING_REMOVAL_REQUEST',
  DISPUTED_PENDING_REGISTRATION_REQUEST = 'DISPUTED_PENDING_REGISTRATION_REQUEST',
  DISPUTED_PENDING_REMOVAL_REQUEST = 'DISPUTED_PENDING_REMOVAL_REQUEST',
  REGISTERED = 'REGISTERED',
  EXPIRED = 'EXPIRED',
  REMOVED = 'REMOVED'
}

@Entity()
export class Submission extends BaseEntity {
  @PrimaryColumn({
    update: false
  })
  ethAddress: string

  @Column({
    nullable: true,
    default: null
  })
  vanityId: number

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.VOUCHING
  })
  status: SubmissionStatus

  @Column({
    default: false
  })
  currentlyRegistered: boolean

  @Column({
    nullable: true,
    default: null
  })
  networkSubmissionAt: Date

  @Column({
    update: false
  })
  networkCreationAt: Date

  @Column()
  displayName: string

  @Column({
    nullable: true,
    default: null
  })
  firstName: string

  @Column({
    nullable: true,
    default: null
  })
  lastName: string

  @Column({
    nullable: true,
    default: null
  })
  bio: string

  @Column({
    nullable: true,
    default: null
  })
  photoUri: string

  @Column({
    nullable: true,
    default: null
  })
  videoUri: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(type => Request, async request => await request.submission)
  requests: Promise<Request[]>

  @OneToMany(type => Evidence, async evidence => await evidence.submission)
  evidence: Promise<Evidence[]>
}
