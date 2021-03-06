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
    if (this.submissionEthAddress === undefined || this.senderEthAddress === undefined) {
      return false
    }

    // temporary patch to account for the first manually added humans in the registry
    if (this.senderEthAddress.toLowerCase() === '0x595fe42383a783180a0f77ed672efa0090d7623a' && this.networkCreationAt.getTime() < 1615810508000) {
      return true
    }

    // temporary patch to account for governor proxy on Kovan - without this
    if (this.senderEthAddress.toLowerCase() === '0xf5fcfd161c1a5036a4a9dec9060fd5f769061de7') {
      return true
    }

    return this.submissionEthAddress.toLowerCase() === this.senderEthAddress.toLowerCase()
  }
}
