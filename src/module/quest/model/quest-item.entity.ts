import { Column, Entity, Index } from 'typeorm'
import { KcsapiEntity } from '../../../shared/kcsapi/kcsapi.entity'
import { QuestItemApi } from '../dto/quest-item-api.dto'

@Entity({ name: 'quest_item' })
export class QuestItem extends KcsapiEntity<QuestItemApi> {
  @Index()
  @Column({ name: 'api_quest_id', type: 'int' })
  api_quest_id: number

  @Column({ name: 'api_select_no', type: 'int', nullable: true, array: true })
  api_select_no?: number[]
}
