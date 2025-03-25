import { Request, Response, NextFunction, Router } from "express";
import PointInteretController from "../controllers/PointInteretController";
import TerritoireController from "../controllers/TerritoireController";

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
        listFontaines: data,
        territoires,
      });
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  public async getAllFontaine(req: Request, res: Response, next: NextFunction) {
    try {
      const fontaine = await this.controllerPointInteret.getAllFontaine();
      return res.status(200).json({ fontaine });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getFilteredFontaines(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const limit = req.query.limite as string;
    const page = req.query.page as string;
    const type = req.query.type as string;
    const nom = req.query.nom as string;
    const territoire = req.query.territoire as string;

    try {
      const fontaines = await this.controllerPointInteret.getFilteredFontaines(
        Number(limit),
        Number(page),
        type,
        territoire,
        nom
      );
      res.status(200).json({ fontaines });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getFontaineById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const fontaine = await this.controllerPointInteret.getFontaineById(
        Number(id)
      );
      return res.status(200).json({ fontaine });
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
    this._router.get("/pointsdinteret", this.getFilteredFontaines.bind(this));
    this._router.get("/pointsdinteret/All", this.getAllFontaine.bind(this));
    this._router.get("/pointsdinteret/:id", this.getFontaineById.bind(this));
  }
}

export const PIRouter = new PointInteretRouter();
PIRouter.init();
