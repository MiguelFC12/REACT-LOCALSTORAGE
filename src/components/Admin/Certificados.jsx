import React, { useState, useEffect } from 'react';
import '../../CSS/AdminInterface.css'; 
import { v4 as uuidv4 } from 'uuid'; 

const Certificados = () => {
    const [capacitaciones, setCapacitaciones] = useState([]);
    const [asignacionesCertificados, setAsignacionesCertificados] = useState([]);
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [asignacionFormData, setAsignacionFormData] = useState({
        idCapacitacion: '', // ID de la capacitación seleccionada
        fechaAsignacion: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    });
    const [formError, setFormError] = useState('');
    // URL del PDF del certificado
    const CERTIFICADO_GENERICO_URL = '/pdf/Certificado.pdf';

    useEffect(() => {
        // Cargar capacitaciones
        const storedCapacitaciones = JSON.parse(localStorage.getItem('capacitacionesData')) || [];
        setCapacitaciones(storedCapacitaciones);

        // Cargar asignaciones de certificados
        const storedAsignaciones = JSON.parse(localStorage.getItem('asignacionesCertificados')) || [];
        setAsignacionesCertificados(storedAsignaciones);
    }, []);

    const handleAsignacionChange = (e) => {
        const { name, value } = e.target;
        setAsignacionFormData(prev => ({ ...prev, [name]: value }));
        setFormError(''); 
    };

    // Función para manejar el envío del formulario de asignación
    const handleAsignacionSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!asignacionFormData.idCapacitacion) {
            setFormError('Por favor, selecciona una capacitación.');
            return;
        }

        // Obtener la capacitación seleccionada para obtener su título
        const capacitacionSeleccionada = capacitaciones.find(
            cap => Number(cap.id) === Number(asignacionFormData.idCapacitacion)
        );

        if (!capacitacionSeleccionada) {
            setFormError('Capacitación no encontrada. Intenta de nuevo.');
            return;
        }

        // Verificar si esta capacitación ya tiene un certificado asignado
        const alreadyAssigned = asignacionesCertificados.some(
            (asignacion) => String(asignacion.idCapacitacion) === String(asignacionFormData.idCapacitacion) 
        );

        if (alreadyAssigned) {
            setFormError('Esta capacitación ya tiene un certificado asignado.');
            return;
        }

        // Crear el nuevo objeto de asignación 
        const nuevaAsignacion = {
            id: uuidv4(), // Generar un ID único para esta asignación
            idCapacitacion: asignacionFormData.idCapacitacion,
            tituloCapacitacion: capacitacionSeleccionada.titulo, // Obtener el título de la capacitación
            fechaAsignacion: asignacionFormData.fechaAsignacion,
            urlCertificadoAsociado: CERTIFICADO_GENERICO_URL,
        };

        // Actualizar las capacitaciones para el panel de usuario
        const updatedCapacitacionesForUser = capacitaciones.map(cap => {
            if (Number(cap.id) === Number(asignacionFormData.idCapacitacion)) {
                return {
                    ...cap,
                    completado: true, // Marcar como completado
                    certificadoEmitido: true, // Marcar certificado como emitido
                    urlCertificado: CERTIFICADO_GENERICO_URL, // Asignar la URL del certificado
                    fechaEmisionCertificado: asignacionFormData.fechaAsignacion // Usar la fecha de asignación como fecha de emisión
                };
            }
            return cap;
        });

        setAsignacionesCertificados(prevAsignaciones => [...prevAsignaciones, nuevaAsignacion]);
        localStorage.setItem('asignacionesCertificados', JSON.stringify([...asignacionesCertificados, nuevaAsignacion]));

        setCapacitaciones(updatedCapacitacionesForUser); 
        localStorage.setItem('capacitacionesData', JSON.stringify(updatedCapacitacionesForUser)); 

        // Mostrar mensaje de éxito y cerrar modal
        alert('Certificado asignado y capacitación actualizada exitosamente.');
        setShowAsignarModal(false);
        setAsignacionFormData({
            idCapacitacion: '',
            fechaAsignacion: new Date().toISOString().split('T')[0],
        });
    };

    // Función para desvincular un certificado de una capacitación
    const handleDesvincular = (idAsignacion) => {
        if (window.confirm('¿Estás seguro de que quieres desvincular este certificado de la capacitación? Esto también lo eliminará de la vista del usuario.')) {
            // Encuentra la asignación que se va a desvincular
            const asignacionToRemove = asignacionesCertificados.find(
                (asignacion) => asignacion.id === idAsignacion
            );

            if (!asignacionToRemove) {
                alert('Asignación no encontrada.');
                return;
            }

            // 1. Eliminar la asignación de la lista del admin
            const updatedAsignaciones = asignacionesCertificados.filter(
                (asignacion) => asignacion.id !== idAsignacion
            );
            setAsignacionesCertificados(updatedAsignaciones);
            localStorage.setItem('asignacionesCertificados', JSON.stringify(updatedAsignaciones));

            const updatedCapacitacionesForUser = capacitaciones.map(cap => {
                if (Number(cap.id) === Number(asignacionToRemove.idCapacitacion)) {
                    const { completado, certificadoEmitido, urlCertificado, fechaEmisionCertificado, ...restOfCap } = cap;
                    return restOfCap; 
                }
                return cap;
            });
            setCapacitaciones(updatedCapacitacionesForUser); // Actualizar el estado de capacitaciones del admin
            localStorage.setItem('capacitacionesData', JSON.stringify(updatedCapacitacionesForUser)); // Guardar en localStorage para el usuario
            
            alert('Certificado desvinculado y capacitación actualizada correctamente.');
        }
    };

    // Filtrar capacitaciones que aún no tienen un certificado asignado
    const capacitacionesDisponiblesParaAsignar = capacitaciones.filter(cap =>
        !asignacionesCertificados.some(asignacion => String(asignacion.idCapacitacion) === String(cap.id)) 
    );

    return (
        <div className="certificados-section-wrapper">
            <div className="section-header-with-button"> 
                <h1>Asignación de Certificados</h1>
                <button
                    className="btn-add-new" 
                    onClick={() => {
                        setShowAsignarModal(true);
                        setFormError(''); 
                        setAsignacionFormData({
                            idCapacitacion: '',
                            fechaAsignacion: new Date().toISOString().split('T')[0],
                        });
                    }}
                >
                    + Asignar Certificado
                </button>
            </div>

            <div className="dashboard-content">
                {asignacionesCertificados.length === 0 ? (
                    <p className="empty-state">Aún no has asignado el certificado a ninguna capacitación.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Título de la Capacitación</th>
                                <th>Fecha de Asignación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignacionesCertificados.map((asignacion) => (
                                <tr key={asignacion.id}>
                                    <td>{asignacion.tituloCapacitacion}</td>
                                    <td>{asignacion.fechaAsignacion}</td>
                                    <td>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDesvincular(asignacion.id)}
                                        >
                                            Desvincular
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para Asignar Certificado */}
            {showAsignarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Asignar Certificado</h2>
                        {formError && <p className="error-message">{formError}</p>}
                        <form onSubmit={handleAsignacionSubmit}>
                            <div className="input-group">
                                <label htmlFor="idCapacitacion">Seleccionar Capacitación:</label>
                                <select
                                    id="idCapacitacion"
                                    name="idCapacitacion"
                                    value={asignacionFormData.idCapacitacion}
                                    onChange={handleAsignacionChange}
                                    required
                                >
                                    <option value="" disabled>-- Selecciona una Capacitación --</option>
                                    {capacitacionesDisponiblesParaAsignar.map(cap => (
                                        <option key={cap.id} value={cap.id}>
                                            {cap.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="fechaAsignacion">Fecha de Asignación:</label>
                                <input
                                    type="date"
                                    id="fechaAsignacion"
                                    name="fechaAsignacion"
                                    value={asignacionFormData.fechaAsignacion}
                                    onChange={handleAsignacionChange}
                                    required
                                />
                            </div>
                            <div className="button-group">
                                <button type="button" className="btn-cancel" onClick={() => setShowAsignarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Asignar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificados;