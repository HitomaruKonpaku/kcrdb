export interface QuestItemApiBonusItem {
  api_id: number
  api_name: string
}

export interface QuestItemApiBonus {
  api_type: number
  api_count: number
  api_item: QuestItemApiBonusItem
}

export interface QuestItemApiRoot {
  api_material: number[],
  api_bounus_count: number,
  api_bounus: QuestItemApiBonus[]
}
