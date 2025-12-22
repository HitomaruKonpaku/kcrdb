export const QUEST_IS_VERIFIED_DESC = 'Verified against KC3 quest data<br><code>https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/jp/quests.json</code>'

export function getPropertyNumberArrayDescription(key: string) {
  return `
<code>${key}=1</code>
<code>${key}=1,2</code>
<code>${key}=1&${key}=2</code>
  `.trim()
}
