import { Column, Entity, Index } from 'typeorm'
import { APIGetEventitem, APIEventSelectReward } from '../../../shared/kcsapi/interface/kcsapi.interface'
import { KcsapiEntity } from '../../../shared/kcsapi/kcsapi.entity'

@Entity({ name: 'event_reward' })
export class EventReward extends KcsapiEntity<null> {
  @Index()
  @Column({ name: 'world', type: 'smallint' })
  world: number

  @Index()
  @Column({ name: 'map', type: 'smallint' })
  map: number

  @Index()
  @Column({ name: 'difficulty', type: 'smallint' })
  difficulty: number

  @Column({ name: 'api_get_eventitem', type: 'json' })
  api_get_eventitem: APIGetEventitem[]

  @Column({ name: 'api_select_reward_dict', type: 'json', nullable: true })
  api_select_reward_dict?: Record<string, APIEventSelectReward[]>
}
