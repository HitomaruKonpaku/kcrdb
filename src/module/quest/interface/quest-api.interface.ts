export interface QuestApiReward {
  api_no: number
  api_kind: number
  api_mst_id: number
  api_count: number
}

export interface QuestApiRoot {
  api_no: number
  api_category: number
  api_type: number
  api_label_type: number
  api_title: string
  api_detail: string
  api_voice_id?: number
  api_get_material?: number[]
  api_select_rewards?: QuestApiReward[]
  api_bonus_flag?: number

  api_state?: number
  api_progress_flag?: number
  api_invalid_flag?: number
}
