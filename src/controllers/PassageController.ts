import mongoose from "mongoose";
import Passage from "../Models/Passage";

export class PassageController {
  async readByCompteurIdAndGroupByDay(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Passage.aggregate([
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
    return Passage.aggregate([
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
    return Passage.aggregate([
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
