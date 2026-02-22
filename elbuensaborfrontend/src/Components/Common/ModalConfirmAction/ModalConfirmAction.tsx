import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";

type ModalProps = {
  onClick?: () => void;
  headerText: string;
  bodyText: string;
  show: boolean;
  setShowModal: (value: boolean) => void;
};

const ModalConfirmAction = ({
  show,
  setShowModal,
  headerText,
  bodyText,
  onClick,
}: ModalProps) => {
  return (
    <Modal show={show} onHide={() => setShowModal(false)}>
      <ModalHeader closeButton>
        <h5>{headerText}</h5>
      </ModalHeader>

      <ModalBody>
        <p>{bodyText}</p>
      </ModalBody>

      <ModalFooter>
        <button
          className="btn btn-secondary"
          onClick={() => setShowModal(false)}
        >
          Cancelar
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            if (onClick) onClick();
            setShowModal(false);
          }}
        >
          Aceptar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalConfirmAction;
