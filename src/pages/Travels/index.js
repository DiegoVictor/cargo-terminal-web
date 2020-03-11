import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spinner } from 'react-bootstrap';

import Layout from '~/components/Layout';
import api from '~/services/api';
import Description from '~/components/Description';
import { Container, Center } from './styles';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';

export default function Travels() {
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
    <Layout>
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
                {travels.map((travel, i) => (
                  <Fragment key={i}>
                    <tr>
                      <th colSpan="2">{VehicleTypeTitle(travel.type)}</th>
                    </tr>
                    {travel.origins.map((origin, j) => (
                      <tr key={j}>
                        <td>
                          <Description>Origem</Description>
                          <Link
                            to={`${google_map_url + origin[1]},${origin[0]}`}
                            target="_blank"
                          >
                            {origin.reverse().join(', ')}
                          </Link>
                        </td>
                        <td>
                          <Description>Destino</Description>
                          <Link
                            to={`${google_map_url +
                              travel.destinations[j][1]},${
                              travel.destinations[j][0]
                            }`}
                            target="_blank"
                          >
                            {travel.destinations[j].reverse().join(', ')}
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
    </Layout>
  );
}
