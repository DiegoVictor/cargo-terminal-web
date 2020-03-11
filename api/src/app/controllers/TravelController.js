import Arrival from '../models/Arrival';

class TravelController {
  async index(req, res) {
    const travels = await Arrival.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      {
        $project: {
          _id: 0,
          vehicle: 1,
          origin: 1,
          destination: 1,
        },
      },
      {
        $unwind: {
          path: '$vehicle',
        },
      },
      {
        $group: {
          _id: '$vehicle.type',
          origins: {
            $push: '$origin',
          },
          destinations: {
            $push: '$destination',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          origins: 1,
          destinations: 1,
        },
      },
    ]);

    return res.json(travels);
  }
}

export default new TravelController();
