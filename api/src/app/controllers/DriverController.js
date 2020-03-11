import Driver from '../models/Driver';
import Vehicle from '../models/Vehicle';

class DriverController {
  async index(req, res) {
    const { query } = req;
    const where = {};

    if (typeof query.active === 'string' && query.active === '1') {
      where.active = true;
    }

    if (typeof query.vehicle === 'string' && query.vehicle === '1') {
      where.vehicles = { $exists: true };
    }

    const drivers = await Driver.find(where);

    return res.json(drivers);
  }

  async store(req, res) {
    const {
      cpf,
      name,
      phone,
      birthday,
      gender,
      cnh_number,
      cnh_type,
      vehicle,
    } = req.body;

    const driver = await Driver.create({
      cpf,
      name,
      phone,
      birthday,
      gender,
      cnh_number,
      cnh_type,
    });

    let driver_vehicle;
    if (vehicle) {
      driver_vehicle = await Vehicle.findById(vehicle);
      if (!driver_vehicle) {
        return res.status(400).json({
          error: {
            message: 'Vehicle not found',
          },
        });
      }

      driver.vehicle = driver_vehicle._id;
      await driver.save();
    }

    return res.json(driver);
  }

  async update(req, res) {
    const { id } = req.params;
    const { vehicle } = req.body;

    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({
        error: {
          message: 'Driver not found',
        },
      });
    }

    let driver_vehicle;
    if (vehicle) {
      driver_vehicle = await Vehicle.findById(vehicle);
      if (!driver_vehicle) {
        return res.status(404).json({
          error: {
            message: 'Vehicle not found',
          },
        });
      }

      driver.vehicle = driver_vehicle._id;
      await driver.save();
    }

    [
      'cpf',
      'name',
      'phone',
      'birthday',
      'gender',
      'cnh_number',
      'cnh_type',
      'active',
    ].forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        driver[field] = req.body[field];
      }
    });

    await driver.save();

    return res.json(driver);
  }
}

export default new DriverController();
