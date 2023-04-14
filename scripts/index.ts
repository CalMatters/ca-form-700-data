import { csvFormat } from 'npm:d3-dsv'

import scheduleA from './schedule-a.ts'
import scheduleD from './schedule-d.ts'
import scheduleE from './schedule-e.ts'

console.log(`Fetching data from API`)
const apiUrl = `https://calmatters-disclosure-disco.netlify.app/forms.json`
const response = await fetch(apiUrl)
const forms = await response.json()

const outputs = [
  {
    filepath: 'schedule-a.csv',
    transformer: scheduleA
  },
  {
    filepath: 'schedule-d.csv',
    transformer: scheduleD
  },
  {
    filepath: 'schedule-e.csv',
    transformer: scheduleE
  }
]

console.log(`Found ${forms.length} forms, turning into ${outputs.length} CSV files`)

const out = outputs.map(async output => {
  const { filepath, transformer } = output
  const data = await transformer(forms)
  const csv = csvFormat(data)

  console.log(`Saving ${data.length.toLocaleString('en-US')} rows to ${filepath}`)
  await Deno.writeTextFile(filepath, csv)
})
await Promise.all(out)

console.log(`Done`)