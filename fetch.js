const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

const dims = [
  "Tmax",
  "Tmin",
  "Tmean",
  "Sunshine",
  "Rainfall",
  "Raindays1mm",
  "AirFrost",
];
const countries = [
  "UK",
  "England",
  "Wales",
  "Scotland",
  "Northern_Ireland",
  "England_and_Wales",
  "England_N",
  "England_S",
  "Scotland_N",
  "Scotland_E",
  "Scotland_W",
  "England_E_and_NE",
  "England_NW_and_N_Wales",
  "Midlands",
  "East_Anglia",
  "England_SW_and_S_Wales",
  "England_SE_and_Central_S",
];
var output = {};

(async () => {
  for (const dim in dims) {
    for (const country in countries) {
      let url = `https://www.metoffice.gov.uk/pub/data/weather/uk/climate/datasets/${dims[dim]}/date/${countries[country]}.txt`;
      let file = await axios.get(url);

      let data = file.data
        .split("\n")
        .slice(5)
        .map((row) => row.split(/[ ,]+/).map((cell) => cell.trim()));

      let metadata = file.data.split("\n").slice(0, 5);
      let header = data.shift();

      let output = {
        metadata: metadata,
        header: header,
        data: data,
      };

      let target = path.resolve(
        `./data/${countries[country]}-${dims[dim]}.json`
      );
      fs.writeFile(target, JSON.stringify(output), (err) => console.log(err));
    }
  }
})();
