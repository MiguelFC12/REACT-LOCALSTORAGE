import React, { useState, useEffect } from 'react';
import '../../CSS/UserInterface.css'; 

const UserAnuncios = () => {
    const [novedades, setNovedades] = useState([]); 

    useEffect(() => {
        try {
            const storedAnnouncements = JSON.parse(localStorage.getItem('anunciosData') || '[]');
            const activeAnnouncements = storedAnnouncements.filter(ann => {
                return true; 
            });
            setNovedades(activeAnnouncements);
        } catch (error) {
            console.error("Error al leer o parsear anuncios desde localStorage:", error);
            setNovedades([]); 
        }
    }, []); 

    return (
        <section className="section-novedades">
            <h2>
                <i className="fa-solid fa-bullhorn"></i>Anuncios y Novedades
            </h2>
            <div className="novedades-container">
                {novedades.length > 0 ? (
                    novedades.map((novedad, index) => (
                        <div key={index} className="novedad-card">
                            <h3>{novedad.titulo}</h3>
                            <p dangerouslySetInnerHTML={{ __html: novedad.contenido }}></p>
                            {novedad.fechaPublicacion && <span className="announcement-date">{novedad.fechaPublicacion}</span>}
                        </div>
                    ))
                ) : (
                    <div className="no-novedades-placeholder">
                        <i className="fa-solid fa-bell-slash"></i>
                        <p>No hay anuncios o novedades recientes.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserAnuncios;