import Vehicle from '../models/Vehicle';

class VehicleController {
  async index(req, res) {
    const vehicles = await Vehicle.find();

    return res.json(vehicles);
  }

  async store(req, res) {
    const { type, model } = req.body;
    const vehicle = await Vehicle.create({ type, model });

    return res.json(vehicle);
  }

  async update(req, res) {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        error: {
          message: 'Vehicle not found',
        },
      });
    }

    ['type', 'model'].forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        vehicle[field] = req.body[field];
      }
    });

    await vehicle.save();

    return res.json(vehicle);
  }
}

export default new VehicleController();
