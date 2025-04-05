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

  // New method to handle all pistes requests with filtering
  public async getPistes(req: Request, res: Response, next: NextFunction) {
    try {
      const { populaireDebut, populaireFin } = req.query;
      
      let data;
      
      // If popularity filter is requested
      if (populaireDebut) {
        data = await this.itineraireController.getPopularPistes(
          populaireDebut as string,
          populaireFin as string
        );
      } else {
        // Get all pistes
        data = await this.itineraireController.getAllPistes();
      }
      
      res.json(data);
    } catch (err) {
      console.error("Error in getting pistes: ", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to get a specific piste by ID
  public async getPisteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const piste = await this.itineraireController.getPisteById(id);
      
      if (!piste) {
        return res.status(404).json({ error: "Piste not found" });
      }
      
      res.json(piste);
    } catch (err) {
      console.error(`Error getting piste by ID: ${err}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  get controlleritineraire() {
    return this.itineraireController;
  }

  get router() {
    return this._router;
  }

  init() {
    // Original endpoint for backward compatibility
    this._router.get("/pistes", this.getPistes.bind(this));
    
    // New API endpoint for getting all pistes with filters
    this._router.get("/pistes/:id", this.getPisteById.bind(this));

    this._router.get("/geojson", this.getGeoData.bind(this));
  }
}

export const IRouter = new ItineraireRouter();
IRouter.init();
