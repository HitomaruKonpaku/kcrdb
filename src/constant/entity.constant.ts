import { MstShip } from '../module/mst/model/mst-ship.entity'
import { MstSlotitem } from '../module/mst/model/mst-slotitem.entity'
import { QuestItem } from '../module/quest/model/quest-item.entity'
import { Quest } from '../module/quest/model/quest.entity'
import { RemodelSlotRecover } from '../module/remodel/model/remodel-slot-recover.entity'
import { RemodelSlot } from '../module/remodel/model/remodel-slot.entity'
import { RemodelSlotlistDetail } from '../module/remodel/model/remodel-slotlist-detail.entity'
import { RemodelSlotlist } from '../module/remodel/model/remodel-slotlist.entity'
import { Replay } from '../module/replay/model/replay.entity'
import { Simulator } from '../module/simulator/model/simulator.entity'
import { Token } from '../module/token/model/token.entity'
import { UserAgent } from '../module/user-agent/model/user-agent.entity'
import { WebhookHistory } from '../module/webhook/model/webhook-history.entity'
import { Webhook } from '../module/webhook/model/webhook.entity'

export const ENTITIES = [
  Replay,
  Simulator,

  Quest,
  QuestItem,

  RemodelSlotlist,
  RemodelSlotlistDetail,
  RemodelSlot,
  RemodelSlotRecover,

  MstShip,
  MstSlotitem,

  UserAgent,

  Token,

  Webhook,
  WebhookHistory,
]
