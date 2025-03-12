import { Request, Response, NextFunction, Router } from "express";
import ItineraireController from "../controllers/ItineraireController";

export class ItineraireRouter {
  private _router: Router;
  private itineraireController: ItineraireController;

  constructor() {
    this.itineraireController = new ItineraireController();
    this._router = Router();
    this.init();
  }

  public async getGeoData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.itineraireController.getGeoData();

      res.json(data);
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  get controlleritineraire() {
    return this.itineraireController;
  }

  get router() {
    return this._router;
  }

  init() {
    this._router.get("/pistes", this.getGeoData.bind(this));
  }
}

export const IRouter = new ItineraireRouter();
IRouter.init();
