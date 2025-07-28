import React, { useState, useEffect } from 'react';
import '../../CSS/UserInterface.css'; 

const UserPerfil = () => {
    // Estado para almacenar la información del usuario
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true); 
        setError(null); 

        try {
            const storedUser = localStorage.getItem('currentUser');

            if (storedUser) {
                // Si hay datos, los parsea de JSON a un objeto JavaScript
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser); // Actualiza el estado con los datos del usuario
            } else {
                // Si no hay datos en localStorage, muestra un mensaje de error
                setError("No se encontraron datos de usuario en la sesión. Por favor, inicie sesión.");
            }
        } catch (err) {
            console.error("Error al leer o parsear datos del localStorage en UserPerfil:", err);
            setError("Error al cargar los datos del perfil. El formato de datos guardados es inválido.");
        } finally {
            setLoading(false);
        }
    }, []); 

    return (
        <section className="section-perfil">
            <h2><i className="fa-solid fa-id-card"></i>Mi Perfil de Usuario</h2>
            <div className="perfil-info-container">
                {/* Muestra un mensaje de carga mientras se obtienen los datos */}
                {loading && (
                    <p style={{ textAlign: 'center', color: '#007bff' }}>Cargando datos del perfil...</p>
                )}

                {/* Muestra un mensaje de error si algo salió mal */}
                {error && (
                    <p style={{ textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>{error}</p>
                )}

                {/* Muestra la información del usuario si los datos están disponibles y no hay errores ni carga */}
                {userData && !loading && !error && (
                    <>
                        <p><strong>Nombre:</strong> {userData.nombres || 'No especificado'}</p>
                        <p><strong>Cédula:</strong> {userData.cedula || 'No especificado'}</p>
                        <p><strong>Área:</strong> {userData.area_trabajo || 'No especificado'}</p>
                        {userData.correo && <p><strong>Email:</strong> {userData.correo}</p>}
                        {userData.telefono && <p><strong>Teléfono:</strong> {userData.telefono}</p>}
                    </>
                )}

                {!userData && !loading && !error && (
                    <p style={{ textAlign: 'center', color: '#6c757d' }}>No hay datos de perfil disponibles en esta sesión.</p>
                )}
            </div>
        </section>
    );
};

export default UserPerfil; 