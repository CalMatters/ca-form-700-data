# California financial disclosure data

Structured and cleaned financial disclosure data for California legislators from [Form 700](form700search.fppc.ca.gov/) filings.

[![Scrape financial disclosure data](https://github.com/CalMatters/ca-form-700-data/actions/workflows/scrape.yml/badge.svg)](https://github.com/CalMatters/ca-form-700-data/actions/workflows/scrape.yml)

## Data files

There are three CSV files generated and each is based on a section, called a "schedule", in the FPPC form.

### Gifts - Schedule D

Here is the data dictionary for the `schedule-d.csv` file.

<table>
  <thead>
    <tr>
      <th>Column name</th>
      <th>Description and caveats</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filer</td>
      <td>The legislator who filed the form.</td>
    </tr>
    <tr>
      <td>filingYear</td>
      <td>The year in which the trip took place.</td>
    </tr>
    <tr>
      <td>sourceName</td>
      <td>The name of the travel sponsor. This field is cleaned so that it is easier to aggregate  sponsored trips across filings.</td>
    </tr>
    <tr>
      <td>amount</td>
      <td>Dollar value of gift.</td>
    </tr>
    <tr>
      <td>date</td>
      <td>Date the gift was given.</td>
    </tr>
    <tr>
      <td>description</td>
      <td>A description of the gift.</td>
    </tr>
    <tr>
      <td>formUrl</td>
      <td>A URL for the original PDF version of the form</td>
    </tr>
    <tr>
      <td>legislatorGlassHouseUrl</td>
      <td>A URL for the legislator's profile page on CalMatters' Glass House.</td>
    </tr>
  </tbody>
</table>

### Sponsored trips - Schedule E

Here is the data dictionary for the `schedule-e.csv` file.

<table>
  <thead>
    <tr>
      <th>Column name</th>
      <th>Description and caveats</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filer</td>
      <td>The legislator who filed the form.</td>
    </tr>
    <tr>
      <td>filingYear</td>
      <td>The year in which the trip took place.</td>
    </tr>
    <tr>
      <td>sourceName</td>
      <td>The name of the travel sponsor. This field is cleaned so that it is easier to aggregate  sponsored trips across filings.</td>
    </tr>
    <tr>
      <td>address</td>
      <td>Address of the source from the filing</td>
    </tr>
    <tr>
      <td>cityAndState</td>
      <td>City and state of the source from the filing</td>
    </tr>
    <tr>
      <td>amount</td>
      <td>Dollars spent on travel</td>
    </tr>
    <tr>
      <td>onDate</td>
      <td>Starting date of sponsored travel</td>
    </tr>
    <tr>
      <td>throughDate</td>
      <td>End date of sponsored travel</td>
    </tr>
    <tr>
      <td>giftOrIncome</td>
      <td>From the original filing</td>
    </tr>
    <tr>
      <td>madeASpeechParticipatedInPanel</td>
      <td>From the original filing</td>
    </tr>
    <tr>
      <td>giftTravelDestination</td>
      <td>The place the legislator traveled to.</td>
    </tr>
    <tr>
      <td>otherDescription</td>
      <td></td>
    </tr>
    <tr>
      <td>formUrl</td>
      <td>A URL for the original PDF version of the form</td>
    </tr>
    <tr>
      <td>legislatorGlassHouseUrl</td>
      <td>A URL for the legislator's profile page on CalMatters' Glass House.</td>
    </tr>
  </tbody>
</table>

## Data use

If you use this dataset, please mention it was collected and cleaned by CalMatters. If you have any questions about this dataset, feel free to contact us.

[CalMatters](https://calmatters.org/) is a nonpartisan, nonprofit journalism venture committed to explaining how California’s state Capitol works and why it matters.

## Credits

The FPPC publishes only the PDF versions of each filing, though many of them are submitted electronically. This data set was created by people going through all of the forms and creating structured data. The contributors are:

* Jeremia Kimelman
* John Osborn D'Agostino
* Erica Yee
* Alesha Riani Blaauw
* Cristian Gonzalez
* Emma Hall
* Hailey Valdivia
* Mercy Sosa
* Nancy Rodriguez