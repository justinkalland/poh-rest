import ipfs from '../lib/ipfs'
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Request } from './Request'
import { Evidence } from './Evidence'
import BaseEntityWithPagination from './BaseEntityWithPagination'

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
export class Submission extends BaseEntityWithPagination {
  @PrimaryColumn({
    type: 'citext',
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

  public get photoUrl (): string | null {
    const url = ipfs.uriToHttp(this.photoUri)
    if (url === undefined) {
      return null
    }
    return url
  }

  @Column({
    nullable: true,
    default: null
  })
  videoUri: string

  public get videoUrl (): string | null {
    const url = ipfs.uriToHttp(this.videoUri)
    if (url === undefined) {
      return null
    }
    return url
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(type => Request, async request => await request.submission)
  requests: Promise<Request[]>

  @OneToMany(type => Evidence, async evidence => await evidence.submission)
  evidence: Promise<Evidence[]>

  public get profileUrl (): string {
    const POH_PROFILE_BASE = process.env.POH_PROFILE_BASE === undefined ? '' : process.env.POH_PROFILE_BASE
    return `${POH_PROFILE_BASE}/${this.ethAddress}`
  }

  toPublicProfile (): object {
    return {
      eth_address: this.ethAddress,
      status: this.status,
      creation_time: this.networkCreationAt,
      display_name: this.displayName,
      first_name: this.firstName,
      last_name: this.lastName,
      registered: this.currentlyRegistered,
      photo: this.photoUrl,
      video: this.videoUrl,
      profile: this.profileUrl,
      bio: this.bio,
      registered_time: this.networkSubmissionAt
    }
  }
}
