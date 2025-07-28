import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../CSS/PaginaCursoDetalle.css';

const PaginaCursoDetalle = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            const storedCapacitaciones = JSON.parse(localStorage.getItem('capacitacionesData') || '[]');
            const foundCurso = storedCapacitaciones.find(cap => String(cap.id) === String(id)); 

            if (foundCurso) {
                setCurso(foundCurso);
            } else {
                setError(`Curso con ID ${id} no encontrado.`);
            }
        } catch (err) {
            console.error("Error al cargar el curso desde localStorage:", err);
            setError("Error al cargar los detalles del curso.");
        } finally {
            setLoading(false);
        }
    }, [id]); 

    if (loading) {
        return <div className="curso-detalle-container"><p>Cargando curso...</p></div>;
    }

    if (error) {
        return (
            <div className="curso-detalle-container">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate('/user-dashboard/capacitacion')}>Volver a Capacitaciones</button>
            </div>
        );
    }

    if (!curso) {
        return (
            <div className="curso-detalle-container">
                <p>No se pudo cargar el curso. Por favor, inténtelo de nuevo.</p>
                <button onClick={() => navigate('/user-dashboard/capacitacion')}>Volver a Capacitaciones</button>
            </div>
        );
    }

    // Si el curso se encontró, muestra su contenido
    return (
        <div className="curso-detalle-container">
            <button className="back-button" onClick={() => navigate('/user-dashboard/capacitacion')}>
                <i className="fas fa-arrow-left"></i> Volver a Capacitaciones
            </button>
            <h1>{curso.titulo}</h1>
            <div className="curso-meta">
                <span><i className="far fa-calendar-alt"></i> {curso.fechaInicio}</span>
                <span><i className="fas fa-calendar-check"></i> {curso.fechaFin}</span>
                <span><i className="far fa-clock"></i> {curso.duracion}</span>
                <span><i className="fas fa-desktop"></i> Virtual</span>
            </div>
            <p className="curso-descripcion-corta">{curso.descripcionCorta}</p>
            <div className="curso-contenido-completo" dangerouslySetInnerHTML={{ __html: curso.contenidoCompleto }}></div>
            
        </div>
    );
};

export default PaginaCursoDetalle;