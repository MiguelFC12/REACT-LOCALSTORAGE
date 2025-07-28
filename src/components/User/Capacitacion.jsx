import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../../CSS/UserInterface.css';

const Capacitacion = () => {
    const [capacitaciones, setCapacitaciones] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('all');
    const [capacitacionDetalle, setCapacitacionDetalle] = useState(null);
    const navigate = useNavigate();

    // Estado para el usuario actual
    const [currentUserCedula, setCurrentUserCedula] = useState(null);

    // Función para obtener las inscripciones de un usuario específico
    const getInscripcionesUsuario = useCallback((cedula) => {
        try {
            const inscripcionesDataString = localStorage.getItem('inscripcionesPorUsuario');
            const inscripcionesPorUsuario = inscripcionesDataString ? JSON.parse(inscripcionesDataString) : {};
            return inscripcionesPorUsuario[cedula] || [];
        } catch (error) {
            console.error("Error al leer inscripcionesPorUsuario de localStorage:", error);
            return [];
        }
    }, []);

    // Función para guardar las inscripciones de un usuario específico
    const saveInscripcionesUsuario = useCallback((cedula, inscripcionesList) => {
        try {
            const inscripcionesDataString = localStorage.getItem('inscripcionesPorUsuario');
            const inscripcionesPorUsuario = inscripcionesDataString ? JSON.parse(inscripcionesDataString) : {};
            inscripcionesPorUsuario[cedula] = inscripcionesList;
            localStorage.setItem('inscripcionesPorUsuario', JSON.stringify(inscripcionesPorUsuario));
        } catch (error) {
            console.error("Error al guardar inscripcionesPorUsuario en localStorage:", error);
        }
    }, []);

    useEffect(() => {
        // 1. Obtener la cédula del usuario actual
        const userString = localStorage.getItem('currentUser');
        const user = userString ? JSON.parse(userString) : null;
        const cedula = user ? user.cedula : null;
        setCurrentUserCedula(cedula);

        // 2. Cargar todas las capacitaciones disponibles
        try {
            const storedCapacitaciones = JSON.parse(localStorage.getItem('capacitacionesData') || '[]');
            
            // 3. Obtener las inscripciones para el usuario actual
            const userInscripciones = cedula ? getInscripcionesUsuario(cedula) : [];
            console.log(`DEBUG: Inscripciones para usuario ${cedula}:`, userInscripciones); // DEBUG

            // 4. Mapear las capacitaciones y determinar su estado 'inscrito' basado en el usuario actual
            setCapacitaciones(storedCapacitaciones.map(cap => {
                const tipoNormalizado = cap.tipoInscripcion
                    ? (cap.tipoInscripcion.toLowerCase() === 'libre' ? 'opcional' : cap.tipoInscripcion.toLowerCase())
                    : 'opcional';

                // Determina si esta capacitación está en la lista de inscripciones del usuario actual
                const isCurrentlyInscrito = tipoNormalizado === 'obligatoria' || userInscripciones.includes(cap.id);

                return {
                    ...cap,
                    inscrito: isCurrentlyInscrito, 
                    tipoInscripcion: tipoNormalizado
                };
            }));
        } catch (error) {
            console.error("Error al leer o parsear capacitaciones o inscripciones desde localStorage:", error);
            setCapacitaciones([]); 
        }
    }, [getInscripcionesUsuario]); 

    const handleInscribirse = (id) => {
        if (!currentUserCedula) {
            alert("Necesitas iniciar sesión para inscribirte en una capacitación.");
            navigate('/login'); 
            return;
        }

        setCapacitaciones(prevCapacitaciones => {
            const updatedCapacitaciones = prevCapacitaciones.map(cap => {
                if (cap.id === id && cap.tipoInscripcion === 'opcional') {
                    return { ...cap, inscrito: !cap.inscrito };
                }
                return cap;
            });

            // Actualiza las inscripciones del usuario actual en localStorage
            const capacitacionToUpdate = updatedCapacitaciones.find(cap => cap.id === id);
            
            let currentInscripciones = getInscripcionesUsuario(currentUserCedula);

            if (capacitacionToUpdate.inscrito) {
                // Si la capacitación ahora está inscrita, añadir a la lista del usuario si no está ya
                if (!currentInscripciones.includes(id)) {
                    currentInscripciones.push(id);
                    saveInscripcionesUsuario(currentUserCedula, currentInscripciones);
                    alert(`¡Te has inscrito exitosamente a la capacitación: ${capacitacionToUpdate.titulo}!`);
                }
            } else {
                // Si la capacitación ahora no está inscrita, remover de la lista del usuario
                const index = currentInscripciones.indexOf(id);
                if (index > -1) {
                    currentInscripciones.splice(index, 1);
                    saveInscripcionesUsuario(currentUserCedula, currentInscripciones);
                    alert(`Te has desinscrito de la capacitación: ${capacitacionToUpdate.titulo}.`);
                }
            }

            return updatedCapacitaciones; 
        });
    };

    const handleMostrarDetalles = (capacitacion) => {
        setCapacitacionDetalle(capacitacion);
        document.body.style.overflow = 'hidden'; 
    };

    const handleCerrarDetalles = () => {
        setCapacitacionDetalle(null);
        document.body.style.overflow = 'unset'; 
    };

    const capacitacionesFiltradas = capacitaciones.filter(cap => {
        const tipoNormalizado = cap.tipoInscripcion; 

        switch (filtroActivo) {
            case 'all':
                return true;
            case 'inscrito':
                return cap.inscrito;
            case 'obligatorio':
                return tipoNormalizado === 'obligatoria';
            case 'opcional':
                return tipoNormalizado === 'opcional';
            default:
                return false;
        }
    });

    return (
        <main className="main-content-capacitaciones">
            <div className="capacitaciones-header">
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filtroActivo === 'all' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('all')}
                    >
                        Todas
                    </button>
                    <button
                        className={`filter-button ${filtroActivo === 'obligatorio' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('obligatorio')}
                    >
                        Obligatorias
                    </button>
                    <button
                        className={`filter-button ${filtroActivo === 'opcional' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('opcional')}
                    >
                        Opcionales
                    </button>
                    <button
                        className={`filter-button ${filtroActivo === 'inscrito' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('inscrito')}
                    >
                        Inscritas
                    </button>
                </div>
            </div>

            <div className="legend">
                <div className="legend-item">
                    <span className="legend-color-opcional"></span> Opcional
                </div>
                <div className="legend-item">
                    <span className="legend-color-inscrito"></span> Inscrito
                </div>
            </div>

            <div className="capacitaciones-list" id="capacitacionesList">
                {capacitacionesFiltradas.length > 0 ? (
                    capacitacionesFiltradas.map((cap) => (
                        <div
                            key={cap.id}
                            className={`capacitacion-card
                                ${cap.inscrito ? 'inscrito' : (cap.tipoInscripcion === 'obligatoria' ? 'obligatorio' : 'opcional')}
                            `}
                            data-type={cap.tipoInscripcion}
                        >
                            <div className="card-details">
                                <h3>{cap.titulo}</h3>
                                <div className="card-meta">
                                    <span><i className="far fa-clock"></i> {cap.duracion}</span>
                                    <span><i className="fas fa-desktop"></i> Virtual</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                {/* Botón de Inscripción/Desinscripción para cursos Opcionales */}
                                {cap.tipoInscripcion === 'opcional' && !cap.inscrito && (
                                    <button
                                        className="action-button inscribirme"
                                        onClick={() => handleInscribirse(cap.id)}
                                    >
                                        <i className="fas fa-user-plus"></i> Inscribirme
                                    </button>
                                )}
                                {cap.inscrito && (
                                    <button
                                        className="action-button inscrito-desinscribir"
                                        // Solo permite desinscribirse si es opcional
                                        onClick={cap.tipoInscripcion === 'opcional' ? () => handleInscribirse(cap.id) : null}
                                        disabled={cap.tipoInscripcion === 'obligatoria'} // Deshabilita si es obligatorio
                                    >
                                        <i className="fas fa-check-circle"></i> Inscrito
                                    </button>
                                )}

                                {/* Lógica para el botón de "Detalles" o "Ir al Curso" */}
                                {/* Si NO está inscrito, mostramos "Detalles" */}
                                {!cap.inscrito ? (
                                    <button
                                        className="action-button details"
                                        onClick={() => handleMostrarDetalles(cap)}
                                    >
                                        <i className="fas fa-info-circle"></i> Detalles
                                    </button>
                                ) : ( // Si SÍ está inscrito
                                    <button
                                        className="action-button go-to-course"
                                        onClick={() => navigate(`/user-dashboard/curso/${cap.id}`)}
                                    >
                                        <i className="fas fa-play-circle"></i> Ir al Curso
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-capacitaciones-placeholder">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <p>No hay capacitaciones disponibles para mostrar según el filtro actual.</p>
                    </div>
                )}
            </div>

            {/* Modal para Detalles de la Capacitación */}
            {capacitacionDetalle && (
                <div className="modal-overlay" onClick={handleCerrarDetalles}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{capacitacionDetalle.titulo}</h2>
                        <div className="modal-meta">
                            <span><i className="far fa-calendar-alt"></i> {capacitacionDetalle.fechaInicio}</span>
                            <span><i className="fas fa-calendar-check"></i> {capacitacionDetalle.fechaFin}</span>
                        </div>
                        <p>{capacitacionDetalle.descripcionCorta}</p>
                        <button className="modal-close-button" onClick={handleCerrarDetalles}>Cerrar</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Capacitacion;