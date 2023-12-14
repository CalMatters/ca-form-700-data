import _ from 'npm:lodash'
import { csvParse } from 'npm:d3-dsv'

async function fetchCsv() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pub?gid=1910584700&single=true&output=csv'
  const response = await fetch(url)
  const text = await response.text()
  const data = csvParse(text)
  return data
}

function normalizeInvestmentName(name, dedupes) {
  const trimmed = name.trim()
  const match = dedupes.find(d => d.name.trim() === trimmed)
  return match ? match.cleaned : trimmed
}

export default async function extractScheduleA1DataFromForms(forms) {
  const dedupes = await fetchCsv()

  const contents = forms.filter(d => d.contents)
  .map(d => {
    const { contents, filingYear } = d
    return { ...contents, filingYear }
  })
  const investments = []

  contents.forEach(form => {
    const { id: formId, filer, a1Investments, filingYear } = form
    const { id: filerId, firstName, lastName } = filer
    
    a1Investments.forEach(investment => {
      const { fmv, name, nature, acquired, disposed, description } = investment
      investments.push({
        filer: `${firstName} ${lastName}`,
        filingYear,
        name: normalizeInvestmentName(name, dedupes),
        description,
        fmv,
        nature,
        acquired,
        disposed,
        formUrl: `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
        legislatorGlassHouseUrl: `https://calmatters.org/legislator-tracker/${filerId}`
      })
    })   
  })

  const sorted = _.orderBy(investments, [d => {
    const [firstName, lastName] = d.filer.split(' ' )
    return lastName
  }, 'filer', 'filingYear', 'name', 'fmv', 'formUrl'])

  return sorted
}