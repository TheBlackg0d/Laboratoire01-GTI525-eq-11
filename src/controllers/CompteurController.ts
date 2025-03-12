import mongoose from "mongoose";
import Compteur from "../Models/Compteur";

export class CompteurController {
  async readByCompteurIdAndGroupByDay(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Compteur.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async readByCompteurIdAndGroupByWeek(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Compteur.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $week: "$date" },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async readByCompteurIdAndGroupByMonth(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Compteur.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
