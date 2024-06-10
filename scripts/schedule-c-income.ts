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
      const { filer, cIncomes, filingYear } = form;
      const { id: filerId, firstName, lastName } = filer;

      cIncomes.forEach((income) => {
        const { amendment } = income
        const formId = amendment ? amendment.formid : form.id
        const i = amendment ? amendment : income
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
        } = i;
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
          legislatorDigitalDemocracyUrl:
            `https://digitaldemocracy.calmatters.org/legislators/${filerId}`,
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
