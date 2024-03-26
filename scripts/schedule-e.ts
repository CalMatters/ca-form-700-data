import _ from "npm:lodash";
import { csvParse } from "npm:d3-dsv";

async function fetchCsv() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pub?gid=1594622565&single=true&output=csv";
  const response = await fetch(url);
  const text = await response.text();
  const data = csvParse(text);
  return data;
}

function normalizeSourceName(sourceName, dedupes) {
  if (!sourceName || !sourceName.trim) return "";
  const trimmed = sourceName.trim();
  const match = dedupes.find((d) => d.Original.trim() === trimmed);
  return match ? match["Should be"] : trimmed;
}

export default async function extractScheduleEDataFromForms(forms) {
  const dedupes = await fetchCsv();

  const contents = forms.filter((d) => d.contents)
    .map((d) => {
      const { contents, filingYear } = d;
      return { ...contents, filingYear };
    });
  const incomes = [];

  contents.forEach((form) => {
    const { id: formId, filer, eIncome, filingYear } = form;
    const { id: filerId, firstName, lastName } = filer;

    eIncome.forEach((income) => {
      const {
        amount,
        onDate,
        address,
        sourceName,
        throughDate,
        cityAndState,
        giftOrIncome,
        otherDescription,
        giftTravelDestination,
        madeASpeechParticipatedInPanel,
      } = income;

      incomes.push({
        filer: `${firstName} ${lastName}`,
        filingYear,
        sourceName: normalizeSourceName(sourceName, dedupes),
        address,
        cityAndState,
        amount,
        onDate,
        throughDate,
        giftOrIncome,
        madeASpeechParticipatedInPanel,
        giftTravelDestination,
        otherDescription,
        formUrl:
          `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
        legislatorGlassHouseUrl:
          `https://calmatters.org/legislator-tracker/${filerId}`,
      });
    });
  });

  const overridden = incomes.map((d) => {
    const { formUrl, amount } = d;

    // zbur 2023 form was missing a decimal place
    if (
      formUrl.includes("59ca2a97-4e91-45e5-bdb7-f4c7cf56ab57") &&
      amount === 107562
    ) {
      d.amount = 1075.62;
    }

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
