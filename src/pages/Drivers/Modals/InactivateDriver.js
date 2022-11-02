import React from 'react';
import PropTypes from 'prop-types';
import { Button as Btn, ButtonGroup as BtnGroup } from 'react-bootstrap';

import Modal from '~/components/Modal';

function InactivateDriver({ driver, cancel, handleDisableDriver }) {
  return (
    <Modal title="Desativar" show={!!driver} onHide={cancel}>
      {driver && `Deseja realmente desativar o(a) motorista ${driver.name}?`}

      <BtnGroup>
        <Btn variant="secondary" onClick={cancel}>
          Cancelar
        </Btn>
        <Btn onClick={handleDisableDriver} data-testid="confirm">
          Confirmar
        </Btn>
      </BtnGroup>
    </Modal>
  );
}

export default InactivateDriver;
