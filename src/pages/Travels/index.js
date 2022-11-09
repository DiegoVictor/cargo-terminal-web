import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spinner } from 'react-bootstrap';

import api from '~/services/api';
import Description from '~/components/Description';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import { Container, Center } from './styles';

function Travel() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const google_map_url = '//www.google.com.br/maps/place/';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await api.get('travels');
      setTravels(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Container>
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th>Origem</th>
            <th>Destino</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">
                <Center>
                  <Spinner animation="border" />
                </Center>
              </td>
            </tr>
          ) : (
            <>
              {travels.map((travel) => (
                <Fragment key={travel.type}>
                  <tr>
                    <th colSpan="2">{VehicleTypeTitle(travel.type)}</th>
                  </tr>
                  {travel.origins.map((origin, i) => (
                    <tr
                      key={`${travel.origins.join(
                        ''
                      )}${travel.destinations.join('')}`}
                    >
                      <td>
                        <Description>Origem</Description>
                        <Link
                          to={`${googleMapUrl + origin[1]},${origin[0]}`}
                          target="_blank"
                        >
                          {origin.reverse().join(', ')}
                        </Link>
                      </td>
                      <td>
                        <Description>Destino</Description>
                        <Link
                          to={`${googleMapUrl + travel.destinations[i][1]},${
                            travel.destinations[i][0]
                          }`}
                          target="_blank"
                        >
                          {travel.destinations[i].reverse().join(', ')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default Travel;
