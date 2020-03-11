import { Router } from 'express';

import ArrivalController from './app/controllers/ArrivalController';
import DriverController from './app/controllers/DriverController';
import VehicleController from './app/controllers/VehicleController';
import TravelController from './app/controllers/TravelController';

import Vehicle from './app/validators/Vehicle';
import Driver from './app/validators/Driver';
import Arrival from './app/validators/Arrival';

const Route = Router();

Route.get('/drivers', DriverController.index);
Route.post('/drivers', Driver, DriverController.store);
Route.put('/drivers/:id', DriverController.update);

Route.get('/vehicles', VehicleController.index);
Route.post('/vehicles', Vehicle, VehicleController.store);
Route.put('/vehicles/:id', Vehicle, VehicleController.update);

Route.get('/arrivals', ArrivalController.index);
Route.post('/arrivals', Arrival, ArrivalController.store);
Route.put('/arrivals/:id', ArrivalController.update);

Route.get('/travels', TravelController.index);

export default Route;
