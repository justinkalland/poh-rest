import { Entity, BaseEntity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'

@Entity()
export class Status extends BaseEntity {
  @PrimaryColumn({
    update: false
  })
  timestamp: number

  @Column({
    nullable: true,
    default: null,
    type: 'json',
    array: false
  })
  registry: {
    total: number
    pendingRemoval: {
      total: number
      challenged: number
      notChallenged: number
    }
    pendingRegistration: {
      total: number
      challenged: number
      notChallenged: number
    }
    registered: number
    expired: number
    removed: number
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  static async findMostRecent (): Promise<Status> {
    return await this.findOneOrFail({
      order: { timestamp: 'DESC' }
    })
  }

  static createForPeriod (period: 'hour' | 'minute', date: Date | undefined = undefined): Status {
    if (date === undefined) {
      date = new Date()
    }
    const timestamp = Math.floor(date.getTime() / 1000)

    let seconds = 0
    switch (period) {
      case 'hour':
        seconds = 60 * 60
        break
      case 'minute':
        seconds = 60
        break
    }

    const entryTime = Math.floor(Math.floor(timestamp / seconds) * seconds + seconds)

    const status = new Status()
    status.timestamp = entryTime
    return status
  }

  toPublicStatus (): object {
    return {
      registry: {
        total: this.registry.total,
        pending_removal: {
          total: this.registry.pendingRemoval.total,
          challenged: this.registry.pendingRemoval.challenged,
          not_challenged: this.registry.pendingRemoval.notChallenged
        },
        pending_registration: {
          total: this.registry.pendingRegistration.total,
          challenged: this.registry.pendingRegistration.challenged,
          not_challenged: this.registry.pendingRegistration.notChallenged
        },
        registered: this.registry.registered,
        expired: this.registry.expired,
        removed: this.registry.removed
      }
    }
  }
}
