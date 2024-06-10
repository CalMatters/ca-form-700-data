import _ from "npm:lodash";
import { csvParse } from "npm:d3-dsv";

async function fetchCsv() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pub?gid=1910584700&single=true&output=csv";
  const response = await fetch(url);
  const text = await response.text();
  const data = csvParse(text);
  return data;
}

function normalizeInvestmentName(name, dedupes) {
  const trimmed = name.trim();
  const match = dedupes.find((d) => d.name.trim() === trimmed);
  return match ? match.cleaned.trim() : trimmed;
}

export default async function extractScheduleA1DataFromForms(forms) {
  const dedupes = await fetchCsv();

  const contents = forms.filter((d) => d.contents)
    .map((d) => {
      const { contents, filerId, filingYear } = d;
      return { ...contents, filerId, filingYear };
    });
  const investments = [];

  contents.forEach((form) => {
    const { filer, filerId, a1Investments, filingYear } = form;
    const { firstName, lastName } = filer;

    a1Investments.forEach((investment) => {
      const { amendment } = investment
      const formId = amendment ? amendment.formId : form.id
      const i = amendment ? amendment : investment
      const { fmv, name, acquired, disposed } = i;
      let { nature, description } = i

      if (nature === "" && description.trim() === "Stock") {
        nature = "Stock"
      }

      investments.push({
        filer: `${firstName} ${lastName}`,
        filingYear,
        name: normalizeInvestmentName(name, dedupes),
        description,
        fmv,
        nature,
        acquired,
        disposed,
        formUrl:
          `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
        legislatorDigitalDemocracyUrl:
          `https://digitaldemocracy.calmatters.org/legislators/${filerId}`,
          
      });
    });
  });

  const sorted = _.orderBy(investments, [
    (d) => {
      const [firstName, lastName] = d.filer.split(" ");
      return lastName;
    },
    "filer",
    "filingYear",
    "name",
    "fmv",
    "formUrl",
  ]);

  return sorted;
}
