import { csvFormat, csvParse } from "npm:d3-dsv";

import scheduleA1 from "./schedule-a1.ts";
import scheduleCIncome from "./schedule-c-income.ts";
import scheduleD from "./schedule-d.ts";
import scheduleE from "./schedule-e.ts";

console.log(`Fetching data from API`);
const token = Deno.env.get("API_TOKEN");
const apiUrl =
  `https://calmatters-disclosure-disco.netlify.app/forms.json?token=${token}`;
const response = await fetch(apiUrl);
const forms = await response.json();
// we use george washington for some testing data
const formsWithoutGW = forms.filter((d) => {
  return d.filerId !== "george-washington";
});
const noAmendments = forms.filter(d => {
  return d.type !== 'Amendment'
})

const outputs = [
  {
    filepath: "schedule-a1.csv",
    transformer: scheduleA1,
  },
  {
    filepath: "schedule-c-income.csv",
    transformer: scheduleCIncome,
  },
  {
    filepath: "schedule-d.csv",
    transformer: scheduleD,
  },
  {
    filepath: "schedule-e.csv",
    transformer: scheduleE,
  },
];

console.log(
  `Found ${noAmendments.length} forms, turning into ${outputs.length} CSV files`,
);

const out = outputs.map(async (output) => {
  const { filepath, transformer } = output;
  const data = await transformer(noAmendments);
  const csv = csvFormat(data);

  console.log(
    `Saving ${data.length.toLocaleString("en-US")} rows to ${filepath}`,
  );
  await Deno.writeTextFile(filepath, csv);
});
await Promise.all(out);

console.log(`Done`);
