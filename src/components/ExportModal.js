import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ExportModal = ({ show, handleClose, handleExport }) => {
    const [selectedOption, setSelectedOption] = React.useState('all');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleExportClick = (type) => {
        // Pasa el tipo de exportación (excel/pdf) junto con el estado seleccionado
        handleExport(type, selectedOption);
        handleClose(); // Cerrar el modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Exportar Reporte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Seleccionar Estado</Form.Label>
                        <Form.Select value={selectedOption} onChange={handleOptionChange}>
                            <option value="all">Todos los estados</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregado">Entregado</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={() => handleExportClick('excel')}>
                    Exportar a Excel
                </Button>
                <Button variant="danger" onClick={() => handleExportClick('pdf')}>
                    Exportar a PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExportModal;
