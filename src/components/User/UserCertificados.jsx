import React, { useState, useEffect } from 'react';
import '../../CSS/UserInterface.css'; 

const UserCertificados = () => {
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            // 1. Obtener la cédula del usuario actual
            const currentUserString = localStorage.getItem('currentUser');
            const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

            if (!currentUser || !currentUser.cedula) {
                setError("No se pudo identificar al usuario. Por favor, inicie sesión.");
                setLoading(false);
                return;
            }

            const userCedula = currentUser.cedula;

            // 2. Cargar todas las definiciones de capacitaciones
            const storedCapacitaciones = JSON.parse(localStorage.getItem('capacitacionesData') || '[]');

            // 3. Cargar las inscripciones del usuario actual
            const inscripcionesPorUsuarioString = localStorage.getItem('inscripcionesPorUsuario');
            const inscripcionesPorUsuario = inscripcionesPorUsuarioString ? JSON.parse(inscripcionesPorUsuarioString) : {};
            const userInscripciones = inscripcionesPorUsuario[userCedula] || [];

            console.log("DEBUG Certificados: Capacitaciones globales:", storedCapacitaciones); // Debug
            console.log("DEBUG Certificados: Inscripciones del usuario " + userCedula + ":", userInscripciones); // Debug

            const certificadosDisponibles = storedCapacitaciones.filter(cap => {
                // Primero, verifica si el usuario está inscrito en esta capacitación
                const estaInscrito = userInscripciones.includes(cap.id);

                // Luego, aplica tus criterios existentes para la emisión del certificado
                return estaInscrito && // Asegurarse de que el usuario esté realmente inscrito
                       cap.completado &&
                       cap.certificadoEmitido &&
                       cap.urlCertificado;
            }).map(cap => ({
                id: cap.id,
                tituloCurso: cap.titulo,
                fechaEmision: cap.fechaEmisionCertificado || 'Fecha no disponible',
                url: cap.urlCertificado,
            }));

            console.log("DEBUG Certificados: Certificados disponibles para " + userCedula + ":", certificadosDisponibles); 

            setCertificados(certificadosDisponibles);

        } catch (err) {
            console.error("Error al cargar certificados desde localStorage:", err);
            setError("Error al cargar tus certificados. Por favor, intenta de nuevo.");
            setCertificados([]);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="main-content-certificados"> 
                <div className="certificados-header">
                    <h1><i className="fas fa-award"></i>Mis Certificados</h1>
                </div>
                <div className="certificados-list"> 
                    <div className="no-certificados-placeholder">
                        <p>Cargando certificados...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content-certificados"> 
                <div className="certificados-header">
                    <h1><i className="fas fa-award"></i>Mis Certificados</h1>
                </div>
                <div className="certificados-list"> 
                    <div className="no-certificados-placeholder">
                        <p className="error-message">{error}</p>
                        <p>Por favor, inténtalo de nuevo más tarde o contacta al soporte.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content-certificados"> {/* Contenedor principal de la página de certificados */}
            <div className="certificados-header">
                <h1><i className="fas fa-award"></i>Mis Certificados</h1> 
            </div>
            
            {certificados.length > 0 ? (
                <div className="certificados-list">
                    {certificados.map(certificado => (
                        <div key={certificado.id} className="certificado-card">
                            <div className="certificate-icon">
                                <i className="fas fa-award"></i>
                            </div>
                            <div className="card-details">
                                <h3>{certificado.tituloCurso}</h3>
                                <p>Emitido por: Departamento de Talento Humano ULEAM</p>
                                <div className="card-meta">
                                    <span><i className="fas fa-calendar-check"></i> Fecha de emisión: {certificado.fechaEmision}</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                {certificado.url ? (
                                    <a
                                        href={certificado.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-button download-pdf-btn"
                                    >
                                        <i className="fas fa-external-link-alt"></i> Ver Certificado
                                    </a>
                                ) : (
                                    <p className="no-url-message">URL del certificado no disponible.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-certificados-placeholder">
                    <i className="fa-solid fa-file-invoice"></i>
                    <p>Aún no tienes certificados disponibles.</p>
                </div>
            )}
        </div>
    );
};

export default UserCertificados;