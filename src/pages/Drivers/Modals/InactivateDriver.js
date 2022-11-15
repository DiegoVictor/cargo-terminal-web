import React from 'react';
import PropTypes from 'prop-types';
import { Button as Btn } from 'react-bootstrap';

import Modal from '~/components/Modal';
import { BtnGroup } from './styles';

function InactivateDriver({ driver, cancel, handleDisableDriver }) {
  return (
    <Modal title="Desativar" show={!!driver} onHide={cancel}>
      {driver && `Deseja realmente desativar o(a) motorista ${driver.name}?`}

      <BtnGroup>
        <Btn variant="secondary" onClick={cancel} data-testid="cancel">
          Cancelar
        </Btn>
        <Btn onClick={handleDisableDriver} data-testid="confirm">
          Confirmar
        </Btn>
      </BtnGroup>
    </Modal>
  );
}

InactivateDriver.propTypes = {
  driver: PropTypes.shape({
    name: PropTypes.string,
  }),
  cancel: PropTypes.func.isRequired,
  handleDisableDriver: PropTypes.func.isRequired,
};

InactivateDriver.defaultProps = {
  driver: null,
};

export default InactivateDriver;
