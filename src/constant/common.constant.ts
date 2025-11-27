import { QuestItem } from '../module/quest/model/quest-item.entity'
import { Quest } from '../module/quest/model/quest.entity'
import { Replay } from '../module/replay/model/replay.entity'
import { Simulator } from '../module/simulator/model/simulator.entity'
import { Token } from '../module/token/model/token.entity'
import { UserAgent } from '../module/user-agent/model/user-agent.entity'

export const ENTITIES = [
  Replay,
  Simulator,
  Quest,
  QuestItem,

  UserAgent,

  Token,
]

export const API_KEY_HEADER_NAME = 'x-api-key'

export const API_KEY_LENGTH = 24
