import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Drivers from '~/pages/Drivers';
import Vehicles from '~/pages/Vehicles';
import Terminal from '~/pages/Terminal';
import Travels from '~/pages/Travels';
import Menu from '~/components/Menu';

function Routes() {
  return (
    <BrowserRouter>
      <Menu />

      <Switch>
        <Route path="/" exact component={Terminal} />
        <Route path="/drivers" component={Drivers} />
        <Route path="/travels" component={Travels} />
        <Route path="/vehicles" component={Vehicles} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
