import _ from "npm:lodash";
import { sum } from "npm:d3-array";
import { csvParse } from "npm:d3-dsv";

async function fetchCsv() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pub?gid=118444411&single=true&output=csv";
  const response = await fetch(url);
  const text = await response.text();
  const data = csvParse(text);
  return data;
}

function normalizeSourceName(sourceName, dedupes) {
  const match = dedupes.find((d) =>
    d.sourceName.toLowerCase() === sourceName.trim().toLowerCase()
  );
  return match ? match["correctedName"] : sourceName;
}

export default async function extractScheduleDDataFromForms(forms) {
  const dedupes = await fetchCsv();
  const contents = forms.filter((d) => d.contents).map((d) => {
    const { contents, filingYear } = d;
    return {
      ...contents,
      filingYear,
    };
  });
  const gifts = [];

  contents.forEach((form) => {
    const { id: formId, filer, dGifts, filingYear } = form;
    const { id: filerId, firstName, lastName } = filer;

    dGifts.forEach((gift) => {
      if (!gift.items) return;
      const {
        sourceName,
      } = gift;

      gift.items.forEach((item) => {
        const { amount, date, address: description } = item;
        gifts.push({
          filer: `${firstName} ${lastName}`,
          filingYear,
          sourceName: normalizeSourceName(sourceName, dedupes),
          amount,
          date,
          description,
          formUrl:
            `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
          legislatorGlassHouseUrl:
            `https://calmatters.org/legislator-tracker/${filerId}`,
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
