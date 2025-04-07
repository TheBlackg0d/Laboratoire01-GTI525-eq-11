import { Request, Response, NextFunction, Router } from "express";
import PointInteretController from "../controllers/PointInteretController";
import TerritoireController from "../controllers/TerritoireController";
import PointInteret from "../Models/PointInteret";

export class PointInteretRouter {
  private _router: Router;
  private pointInteretController: PointInteretController;
  private territoireController: TerritoireController;

  constructor() {
    this.pointInteretController = new PointInteretController();
    this.territoireController = new TerritoireController();
    this._router = Router();
    this.init();
  }

  public async getStatData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.pointInteretController.getStatData();

      const territoires = await this.territoireController.readAll();

      res.render("pointInteret", {
        title: "Point d'interet",
        listPointInterets: data,
        territoires,
      });
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  public async ajouterInteret(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.pointInteretController.getStatData();

      const territoires = await this.territoireController.readAll();

      res.render("ajouterInteret", {
        title: "Point d'interet",
        listPointInterets: data,
        territoires,
      });
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  public async getAllPointInteret(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pointInteret =
        await this.controllerPointInteret.getAllPointInteret();
      return res.status(200).json({ pointInteret });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async createPointInteret(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const {
      Adresse,
      NomDuLieu,
      arrondissementForm,
      codePostale,
      dispoDate,
      typeDeLieu,
      longitude,
      latitude,
      Remarque,
    } = req.body;
    try {
      const pointInteret = await this.controllerPointInteret.createPointInteret(
        {
          Intersection: Adresse,
          Nom_parc_lieu: NomDuLieu,
          Longitude: longitude,
          Latitude: latitude,
          type: typeDeLieu,
          Arrondissement: arrondissementForm,
          Remarque,
          codePostal: codePostale,
          DispoDate: dispoDate,
        }
      );
      res.json({ message: "success", pointInteret });
    } catch (error) {
      console.log(error);
    }
  }

  public async deletePointInteret(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.controllerPointInteret.deletePointInteret(
        req.params.id
      );
      res.json({ message: "success", del: response });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getPointInteret(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.controllerPointInteret.getPointInteret(
        req.params.id
      );
      res.status(200).json({ message: "seccess", result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  public async updatePointInteret(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        Adresse,
        NomDuLieu,
        arrondissementForm,
        codePostale,
        dispoDate,
        typeDeLieu,
        longitude,
        latitude,
        Remarque,
      } = req.body;
      const id = req.params.id;
      const pointInteret = await this.controllerPointInteret.update(
        {
          Intersection: Adresse,
          Nom_parc_lieu: NomDuLieu,
          Longitude: longitude,
          Latitude: latitude,
          type: typeDeLieu,
          Arrondissement: arrondissementForm,
          Remarque,
          codePostal: codePostale,
          DispoDate: dispoDate,
        },
        id
      );

      res.status(200).json({ message: "success", pointInteret });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getAllPointsInArea(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const result = await this.controllerPointInteret.getAllPointsInArea(id);
      console.log(result);
      res.status(200).json({ message: "success", result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  get controllerPointInteret() {
    return this.pointInteretController;
  }

  get router() {
    return this._router;
  }

  init() {
    this._router.get("/", this.getStatData.bind(this));
    this._router.get("/ajouter", this.ajouterInteret.bind(this));
    this._router.get("/pointsdinteret", this.getAllPointInteret.bind(this));
    this._router.post("/create", this.createPointInteret.bind(this));
    this._router.delete("/delete/:id", this.deletePointInteret.bind(this));
    this._router.get("/:id", this.getPointInteret.bind(this));
    this._router.post("/update/:id", this.updatePointInteret.bind(this));
    this._router.get("/allAreaPoints/:id", this.getAllPointsInArea.bind(this));
  }
}

export const PIRouter = new PointInteretRouter();
PIRouter.init();
