import { NextFunction, Request, Response, Router } from "express";
import TerritoireController from "../controllers/TerritoireController";
import Territoire from "../Models/Territoire";

export class TerritoireRouter {
  private _router: Router;
  private territoireController: TerritoireController;

  constructor() {
    this.territoireController = new TerritoireController();
    this._router = Router();
    this.init();
  }
  async createTerritoire(req: Request, res: Response, next: NextFunction) {
    const { nom, codeID, abrev } = req.body;

    try {
      const territoire = await this.territoireController.createTerritoire(
        nom,
        codeID,
        abrev
      );
      res.status(201).json({ territoire });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  async readTerritoire(req: Request, res: Response, next: NextFunction) {
    const territoireId = req.params.territoireId;
    try {
      const territoire = await this.territoireController.readTerroire(
        territoireId
      );
      return territoire
        ? res.status(200).json({ territoire })
        : res.status(404).json({ message: "not  found" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async readAllTerritoire(req: Request, res: Response, next: NextFunction) {
    try {
      const territoires = await this.territoireController.readAll();
      return res.status(200).json({ territoires });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateTerroire(req: Request, res: Response, next: NextFunction) {
    const territoireId = req.params.territoireId;

    try {
      const { nom, codeID, abrev } = req.body;
      const territoire = await this.territoireController.update(
        nom,
        codeID,
        abrev,
        Number(territoireId)
      );
      res.status(201).json({ territoire });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getGeoData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.territoireController.getGeoData();

      res.status(201).json(data);
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
      res.status(500).json({ err });
    }
  }
  async deleteTerritoire(req: Request, res: Response, next: NextFunction) {
    const territoireId = req.params.territoireId;

    try {
      const territoire = await this.territoireController.delete(
        Number(territoireId)
      );
      return territoire
        ? res.status(200).json({ message: "deleted" })
        : res.status(404).json({ message: "not  found" });
    } catch (error) {}
  }

  get router() {
    return this._router;
  }

  init() {
    // this._router.get("/", this.getStatData.bind(this));
    this._router.post("/territoire/create", this.createTerritoire.bind(this));
    this._router.get(
      "/territoire/get/:territoireId",
      this.readTerritoire.bind(this)
    );
    this._router.get("/territoire/get/", this.readAllTerritoire.bind(this));
    this._router.post(
      "/territoire/update/:territoireId",
      this.updateTerroire.bind(this)
    );
    this._router.post("/territoire/delete", this.deleteTerritoire.bind(this));
    this._router.get("/territoire/geojson", this.getGeoData.bind(this));
  }
}

export const TRouter = new TerritoireRouter();
