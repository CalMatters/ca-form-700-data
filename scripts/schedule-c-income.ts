import _ from "npm:lodash";

export default async function extractScheduleCDataFromForms(forms) {
  const contents = forms.filter((d) => d.contents)
    .map((d) => {
      const { contents, filingYear } = d;
      return { ...contents, filingYear };
    });
  const incomeAndBusinessPositions = [];

  contents.forEach((form) => {
    try {
      const { id: formId, filer, cIncomes, filingYear } = form;
      const { id: filerId, firstName, lastName } = filer;

      cIncomes.forEach((income) => {
        const {
          saleOf,
          address,
          position,
          sourceName,
          grossIncome,
          consideration,
          businessActivity,
          otherDescription,
          commissionOrRentalIncomeDescription,
        } = income;
        incomeAndBusinessPositions.push({
          filer: `${firstName} ${lastName}`,
          filingYear,
          sourceName,
          address,
          businessActivity,
          position,
          grossIncome,
          consideration,
          saleOf,
          commissionOrRentalIncomeDescription,
          otherDescription,
          formUrl:
            `https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/${formId}.pdf`,
          legislatorGlassHouseUrl:
            `https://calmatters.org/legislator-tracker/${filerId}`,
        });
      });
    } catch (e) {
      console.error(e, form);
    }
  });

  const sorted = _.orderBy(incomeAndBusinessPositions, [
    (d) => {
      const [firstName, lastName] = d.filer.split(" ");
      return lastName;
    },
    "filer",
    "filingYear",
    "sourceName",
    "grossIncome",
    "formUrl",
  ]);

  return sorted;
}
