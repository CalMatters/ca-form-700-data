import _ from "npm:lodash";
import { csvParse } from "npm:d3-dsv";

async function fetchCsv() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pub?gid=59744402&single=true&output=csv";
  const response = await fetch(url);
  const text = await response.text();
  const data = csvParse(text);
  return data;
}

function normalizeSourceName(sourceName, dedupes) {
  if (!sourceName || !sourceName.trim) return "";
  const trimmed = sourceName.trim();
  const match = dedupes.find((d) => d.Original.trim() === trimmed);
  return match ? match["Normalized"] : trimmed;
}

export default async function extractScheduleDDataFromForms(forms) {
  const dedupes = await fetchCsv();
  const contents = forms.filter((d) => d.contents).map((d) => {
    const { contents, filerId, filingYear } = d;
    return {
      ...contents,
      filerId,
      filingYear,
    };
  });
  const gifts = [];

  contents.forEach((form) => {
    const { filer, filerId, dGifts, filingYear } = form;
    const { firstName, lastName } = filer;

    dGifts.forEach((gift) => {
      const {
        amendment,
      } = gift;
      
      const formId = amendment ? amendment.formId : form.id
      const sourceName = amendment ? amendment.sourceName : gift.sourceName
      const g = amendment || gift
      
      if (!g.items) return;

      g.items.forEach((item) => {
        const { amount, date, address: description, reimbursedAmount } = item;
        gifts.push({
          filer: `${firstName} ${lastName}`,
          filingYear,
          sourceName: normalizeSourceName(sourceName, dedupes),
          amount,
          reimbursedAmount: reimbursedAmount || 0,
          date,
          description,
          formUrl:
            `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
          legislatorDigitalDemocracyUrl:
            `https://digitaldemocracy.calmatters.org/legislators/${filerId}`,
        });
      });
    });
  });

  const sorted = _.orderBy(gifts, [
    (d) => {
      const [firstName, lastName] = d.filer.split(" ");
      return lastName;
    },
    "filer",
    "filingYear",
    "sourceName",
    "date",
    "amount",
    "description",
  ]);

  return sorted;
}
