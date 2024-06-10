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

export default async function extractScheduleEDataFromForms(forms) {
  const dedupes = await fetchCsv();

  const contents = forms.filter((d) => d.contents)
    .map((d) => {
      const { contents, filerId, filingYear } = d;
      return { ...contents, filerId, filingYear };
    });
  const incomes = [];

  contents.forEach((form) => {
    const { filer, filerId, eIncome, filingYear } = form;
    const { firstName, lastName } = filer;

    eIncome.forEach((income) => {
      const { amendment } = income
      const formId = amendment ? amendment.formId : form.id
      const i = amendment ? amendment : income
      const {
        amount,
        onDate,
        address,
        sourceName,
        throughDate,
        cityAndState,
        giftOrIncome,
        otherDescription,
        reimbursedAmount,
        giftTravelDestination,
        madeASpeechParticipatedInPanel,
      } = i;

      const filer = `${firstName} ${lastName}`
      const normalizedSourceName = normalizeSourceName(sourceName, dedupes)

      incomes.push({
        filer,
        filingYear,
        sourceName: normalizedSourceName,
        address,
        cityAndState,
        amount,
        reimbursedAmount: reimbursedAmount || 0,
        onDate,
        throughDate,
        giftOrIncome,
        madeASpeechParticipatedInPanel,
        giftTravelDestination,
        otherDescription,
        formUrl:
          `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
        legislatorDigitalDemocracyUrl:
          `https://digitaldemocracy.calmatters.org/legislators/${filerId}`,
      });
    });
  });

  const overridden = incomes.map((d) => {
    const { formUrl } = d;
    // place to manually override specfic things, such as mistakes until
    // they are fixed in a subsequent amendment
    return d;
  });

  const sorted = _.orderBy(overridden, [
    (d) => {
      const [firstName, lastName] = d.filer.split(" ");
      return lastName;
    },
    "filer",
    "filingYear",
    "sourceName",
    "onDate",
    "amount",
    "giftTravelDestination",
  ]);

  return sorted;
}
