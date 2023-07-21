# California financial disclosure data

Structured and cleaned financial disclosure data for California legislators from [Form 700](https://form700search.fppc.ca.gov/) filings.

[![Scrape financial disclosure data](https://github.com/CalMatters/ca-form-700-data/actions/workflows/scrape.yml/badge.svg)](https://github.com/CalMatters/ca-form-700-data/actions/workflows/scrape.yml)

## Methodology

The data is extracted by journalists from the legislator-submitted PDF versions of the forms which are downloaded from the FPPC. We attempt to match the reported information on the form to the extent possible.

All of the names of people and organizations are subsequently normalized so that the data is easily compared and grouped. This is done with a two column lookup table per data schedule managed as a Google spreadsheet which is linked below with the cleaned data column.

## Data files

There are three CSV files generated and each is based on a section, called a "schedule", in the FPPC form.

### Investments - Schedule A1

Here is the data dictionary for the `schedule-a1.csv` file.

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
      <td>The year in which the investment was owned, bought, or sold.</td>
    </tr>
    <tr>
      <td>name</td>
      <td>The name of the investment, normalized with <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pubhtml?gid=1910584700&single=true">this spreadsheet</a>.</td>
    </tr>
    <tr>
      <td>description</td>
      <td>Description supplied on the form.</td>
    </tr>
    <tr>
      <td>fmv</td>
      <td>"Fair market value" of the asset, categorized as one of the following: $2k - $10k, $10k - $100k, $100k - $1m, $1m+.</td>
    </tr>
    <tr>
      <td>nature</td>
      <td></td>
    </tr>
    <tr>
      <td>acquired</td>
      <td>Date acquired, null when not in the same filing year.</td>
    </tr>
    <tr>
      <td>disposed</td>
      <td>Date sold, null when not in the same filing year.</td>
    </tr>
    <tr>
      <td>formUrl</td>
      <td>A URL for the original PDF version of the form.</td>
    </tr>
    <tr>
      <td>legislatorGlassHouseUrl</td>
      <td>A URL for the legislator's profile page on CalMatters' Glass House.</td>
    </tr>
  </tbody>
</table>

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
      <td>The year in which the gift was given.</td>
    </tr>
    <tr>
      <td>sourceName</td>
      <td>The name of the gift giver, normalized with <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pubhtml?gid=118444411&single=true">this spreadsheet</a>.</td>
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
      <td>A URL for the original PDF version of the form.</td>
    </tr>
    <tr>
      <td>legislatorGlassHouseUrl</td>
      <td>A URL for the legislator's profile page on CalMatters' Glass House.</td>
    </tr>
  </tbody>
</table>

#### Things to look out for when working with gift data

Some legislators reported taking gifts that exceeded the FPPC's annual per-source limit ($520 in 2022) and included a note that says they returned the part of the gift exceeding the amount. This note isn't captured anywhere in our data, so if you notice anybody reporting a haul over the legal limit you should also look at the submitted form to confirm the legislator didn't return part of the gift. You can use the PDF available in the `formUrl` column for each gift.

Asm. Marie Waldron reported a gift total of over $3k in [her 2022 form](https://wcfweenxfcmsichcbyki.supabase.in/storage/v1/object/public/pdfs/eabd7aeb-88ee-481d-9d4e-a7e215bb665e.pdf) but it appears to be travel that should have been reported in Schedule E instead. CalMatters reached out to her office for clarification but has yet to hear back.

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
      <td>The name of the travel sponsor, normalized with <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSvMVqjLXOLoY5Jt1u8gmOBD_2IZit7yqKN8N94ubeOvyx94qyLCdLp19kAkp594OJzEfna5RO_Fcjv/pubhtml?gid=1594622565&single=true">this spreadsheet</a>.</td>
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

## Stories and projects that use this data

* ["How free trips for California legislators lead to bills"](https://calmatters.org/politics/california-legislature/2023/05/california-legislature-trips-bills/) (CalMatters)
* ["This law should reveal who's paying for California legislators' travel. It's only been used twice"](https://calmatters.org/politics/california-legislature/2023/05/california-legislators-travel-disclosure/) (CalMatters)
* [Glass House: California Legislator Tracker](https://calmatters.org/legislator-tracker/home/) (CalMatters)

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
