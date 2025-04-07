import express from "express";
import { statRouter } from "./routes/statistiqueRouter";
import logger from "morgan";
import flash from "express-flash-plus";
import { PIRouter } from "./routes/pointInteretRouter";
import mongoose from "mongoose";
import { config } from "./config/db";
import { TRouter } from "./routes/TerritoireRouter";
import { apiRouter } from "./routes/ApiRouter";
import { IRouter } from "./routes/itineraireRouter";
const autiIncrement = require("mongoose-id-autoincrement");
class App {
  public expressApp: express.Application;

  constructor() {
    this.expressApp = express();
    console.log(config.mongo.url);
    const db = mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: "majority",
    });
    // this.middleware() //  For middleware implementation
    this.middleware();
    this.routes(); // For routes implementation

    // Pug Engine
    this.expressApp.set("view engine", "pug");

    // Static files
    this.expressApp.use(
      express.static(__dirname + "/public") as express.RequestHandler
    );
  }

  private middleware(): void {
    this.expressApp.use(logger("dev") as express.RequestHandler);
    this.expressApp.use(express.json() as express.RequestHandler);
    this.expressApp.use(
      express.urlencoded({ extended: false }) as express.RequestHandler
    );
    this.expressApp.use(flash());
  }

  private routes(): void {
    const router = express.Router();

    // Home Page
    router.get("/", (req, res) => {
      res.render("index", { title: "Home" });
    });

    router.get("/statistique", async (req, res) => {
      let compteurData = await statRouter.controllerStats.getStatData();
      res.render("statistique", {
        title: "Statistique",
        listCompteurs: compteurData,
      });
    });

    router.get("/itineraire", (req, res) => {
      res.render("itineraire", {
        title: "Pistes et voies cyclables",
      });
    });

    // Team Page
    router.get("/equipe", (req, res) => {
      res.render("equipe", {
        title: "Equipe 11",
      });
    });

    router.get("/a-propos", async (req, res) => {
      res.render("project", {
        title: "Le Projet - Mobilité Urbaine",
      });
    });

    this.expressApp.use("/", router);
    this.expressApp.use("/statistique", statRouter.router); // Pour tout autre operations avec la page statistique
    this.expressApp.use("/pointInteret", PIRouter.router);
    this.expressApp.use("/gti525", apiRouter.router);
  }
}

export default new App().expressApp;
