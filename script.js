import Papa from "papaparse";
import fs from "fs";

for (let i = 2019; i < 2023; i++) {
  // let comptage = await fetch(`http://localhost:3000`);
  let arr = [];
  const csvData = fs.readFileSync(
    `./public/data/comptage_velo_${i}.csv`,
    "utf8"
  );
  let data = Papa.parse(csvData, {
    delimiter: ",",
    header: true,
  }).data;

  for (let d of data) {
    const date = d.Date;
    for (let key in d) {
      if (key != "Date") {
        const obj = {
          compteurId: Number.parseInt(key),
          passage: Number.parseInt(d[key]),
          date: date,
        };

        arr.push(obj);
      }
    }
  }
  const csv = Papa.unparse(arr);
  try {
    fs.writeFileSync(`./public/data/comptage_velo_${i}-v2.csv`, csv, "utf8");
    console.log("Data successfully saved to disk");
  } catch (error) {
    console.log("An error has occurred ", error);
  }
}

// let arr = [];

// const csvData = fs.readFileSync(`./public/data/territoires.csv`, "utf8");

// let data = Papa.parse(csvData, {
//   delimiter: ",",
//   header: false,
// }).data;

// console.log(data);

// for (let d of data) {
//   const obj = {
//     nom: d[0],
//     codeID: d[1],
//     abrev: d[2],
//   };

//   arr.push(obj);
// }

// // console.log(arr);
// try {
//   fs.writeFileSync(
//     "./public/data/territoires.json",
//     JSON.stringify(arr, null, 2),
//     "utf8"
//   );
//   console.log("Data successfully saved to disk");
// } catch (error) {
//   console.log("An error has occurred ", error);
// }
