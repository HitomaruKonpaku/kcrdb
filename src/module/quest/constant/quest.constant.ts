export const QUEST_IS_VERIFIED_DESC = 'Verified against KC3 quest data<br><code>https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/jp/quests.json</code>'

export const QUEST_IS_SUS_DESC = 'Sus!? Unconfirmed modified by client'

export const QUEST_IS_MOD_DESC = 'Confirmed modified by client'

export function getPropertyNumberArrayDescription(key: string) {
  return `
<code>${key}=1</code>
<code>${key}=1,2</code>
<code>${key}=1&${key}=2</code>
  `.trim()
}
