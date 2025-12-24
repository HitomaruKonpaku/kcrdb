import { QuestItem } from '../module/quest/model/quest-item.entity'
import { Quest } from '../module/quest/model/quest.entity'
import { RemodelSlot } from '../module/remodel/model/remodel-slot.entity'
import { RemodelSlotlistDetail } from '../module/remodel/model/remodel-slotlist-detail.entity'
import { RemodelSlotlist } from '../module/remodel/model/remodel-slotlist.entity'
import { Replay } from '../module/replay/model/replay.entity'
import { ShipStats } from '../module/ship/model/ship-stats.entity'
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
  ShipStats,

  UserAgent,

  Token,

  Webhook,
  WebhookHistory,
]

export const API_KEY_HEADER_NAME = 'x-api-key'

export const API_KEY_LENGTH = 24
