import {
  ManyToOne,
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Submission } from './Submission'
import { Evidence } from './Evidence'

@Entity()
export class Request extends BaseEntity {
  @PrimaryColumn({
    update: false
  })
  id: string

  @Column({
    default: false
  })
  resolved: boolean

  @Column({
    default: false
  })
  disputed: boolean

  @Column({
    update: false
  })
  isRegistration: boolean

  @Column({
    update: false
  })
  networkCreationAt: Date

  @Column()
  networkLastChangeAt: Date

  @Column({
    update: false
  })
  requesterEthAddress: string

  @Column({
    default: false
  })
  requesterLost: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  submissionEthAddress: string

  @ManyToOne(type => Submission, async submission => await submission.requests)
  submission: Promise<Submission>

  @OneToMany(type => Evidence, async evidence => await evidence.request)
  evidence: Promise<Evidence[]>
}
