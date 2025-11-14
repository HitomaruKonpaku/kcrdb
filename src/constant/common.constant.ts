import { QuestItem } from '../module/quest/model/quest-item.entity'
import { Quest } from '../module/quest/model/quest.entity'
import { Replay } from '../module/replay/model/replay.entity'
import { Simulator } from '../module/simulator/model/simulator.entity'
import { UserAgent } from '../module/user-agent/model/user-agent.entity'

export const ENTITIES = [
  Replay,
  Simulator,
  Quest,
  QuestItem,

  UserAgent,
]
