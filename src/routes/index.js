import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Drivers from '~/pages/Drivers';
import Vehicles from '~/pages/Vehicles';
import Terminal from '~/pages/Terminal';
import Travels from '~/pages/Travels';
import Menu from '~/components/Menu';

export default function Router() {
  return (
    <BrowserRouter>
      <Menu />

      <Routes>
        <Route index element={<Terminal />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/travels" element={<Travels />} />
        <Route path="/vehicles" element={<Vehicles />} />
      </Routes>
    </BrowserRouter>
  );
}
