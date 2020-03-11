import React from 'react';
import { Router, Route } from 'react-router-dom';

import history from '~/services/history';
import Drivers from '~/pages/Drivers';
import Vehicles from '~/pages/Vehicles';
import Terminal from '~/pages/Terminal';
import Travels from '~/pages/Travels';

export default () => (
  <Router history={history}>
    <Route path="/" exact component={Terminal} />
    <Route path="/travels" component={Travels} />
    <Route path="/vehicles" component={Vehicles} />
    <Route path="/drivers" component={Drivers} />
  </Router>
);
