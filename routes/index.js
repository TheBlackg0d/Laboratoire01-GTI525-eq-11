var express = require("express");
var router = express.Router();

var papaparse = require("papaparse");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET Statistique page */
router.get("/statistique", async function (req, res, next) {
  try {
    // Fetch data
    let response = await fetch("http://localhost:3000/data/compteurs.csv");
    let csvData = await response.text();

    // Parse data
    let data = papaparse.parse(csvData, {
      delimiter: ",",
      header: true,
    });

    console.log(data.data[0]);
    res.render("statistique", {
      title: "Statistiques",
      listCompteurs: data.data,
    });
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/pointInteret", async (req, res) => {
  try {
    let response = await fetch("http://localhost:3000/data/fontaines.csv");
    let csvData = await response.text();
    let data = papaparse.parse(csvData, {
      delimiter: ",",
      header: true,
    });

    console.log(data.data[0]);
    const uniqueArrondissements = [
      ...new Set(data.data.map((item) => {
        let i = {};
        i.Arrondissement = item.Arrondissement
        i.
      })),
    ]; // [ 'A', 'B']
    res.render("pointInteret", {
      title: "Point d'interet",
      listFontaines: data.data,
      uniqueArrondissements,
    });
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
