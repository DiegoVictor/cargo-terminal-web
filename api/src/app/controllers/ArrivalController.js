import Driver from '../models/Driver';
import Arrival from '../models/Arrival';
import Vehicle from '../models/Vehicle';

class ArrivalController {
  async index(req, res) {
    const { query } = req;
    const where = {};

    if (typeof query.filled === 'number') {
      where.filled = !!query.filled;
    }

    if (typeof query.date_start === 'string') {
      if (typeof where.createdAt !== 'object') {
        where.createdAt = {};
      }
      where.createdAt.$gte = query.date_start;
    }

    if (typeof query.date_end === 'string') {
      if (typeof where.createdAt !== 'object') {
        where.createdAt = {};
      }
      where.createdAt.$lte = query.date_end;
    }

    const arrivals = await Arrival.find({ ...where })
      .populate('driver')
      .populate('vehicle');

    return res.json(arrivals);
  }

  async store(req, res) {
    const { filled, vehicle_id, driver_id, origin, destination } = req.body;

    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
      return res.status(400).json({
        error: {
          message: 'Vehicle not found',
        },
      });
    }

    const driver = await Driver.findById(driver_id);
    if (!driver) {
      return res.status(400).json({
        error: {
          message: 'Driver not found',
        },
      });
    }

    const arrival = await Arrival.create({
      driver,
      filled,
      vehicle,
      origin: [origin.longitude, origin.latitude],
      destination: [destination.longitude, destination.latitude],
    });

    return res.json(arrival);
  }

  async update(req, res) {
    const { id } = req.params;
    const { vehicle_id, driver_id, origin, destination } = req.body;

    const arrival = await Arrival.findById(id);
    if (!arrival) {
      return res.status(404).json({
        error: {
          message: 'Arrival not found',
        },
      });
    }

    if (vehicle_id) {
      const vehicle = await Vehicle.findById(vehicle_id);
      if (!vehicle) {
        return res.status(400).json({
          error: {
            message: 'Vehicle not found',
          },
        });
      }

      arrival.vehicle = vehicle;
    }

    if (driver_id) {
      const driver = await Driver.findById(driver_id);
      if (!driver) {
        return res.status(400).json({
          error: {
            message: 'Driver not found',
          },
        });
      }

      arrival.driver = driver;
    }

    if (origin) {
      arrival.origin = [origin.longitude, origin.latitude];
    }

    if (destination) {
      arrival.destination = [destination.longitude, destination.latitude];
    }

    ['filled'].forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        arrival[field] = req.body[field];
      }
    });

    await arrival.save();

    return res.json(arrival);
  }
}

export default new ArrivalController();
