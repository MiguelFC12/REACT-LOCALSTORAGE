import React, { useState, useEffect } from 'react';
import '../../CSS/AdminInterface.css'; 

const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [showUserForm, setShowUserForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formMessage, setFormMessage] = useState({ text: '', type: '' });
    const [formErrors, setFormErrors] = useState({});

    // Áreas de trabajo disponibles
    const areasDeTrabajo = [
        "Decanato", "Vicedecanato", "Direccion de Carrera", "Docencia", "Investigacion",
        "Secretaria Academica", "Tecnico de Laboratorio", "Soporte Informatico",
        "Administracion de Redes", "Desarrollo de Software Interno",
        "Vinculacion con la Sociedad", "Gestion Administrativa", "Coordinacion de Proyectos",
        "Ciberseguridad", "Inteligencia Artificial", "Bases de Datos", "Desarrollo Web",
        "Robotica", "Analisis de Datos", "Gestion de Calidad", "Asesoria Estudiantil"
    ];

    useEffect(() => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            if (Array.isArray(storedUsers)) {
                setUsers(storedUsers);
            } else {
                console.warn("localStorage 'users' no es un array, se inicializará como vacío.");
                setUsers([]); 
            }
        } catch (error) {
            console.error("Error al cargar usuarios de localStorage:", error);
            setUsers([]);
        }
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        setFormMessage({ text: '', type: '' });
    };

    const validateCedulaFormat = (cedula) => /^\d{10}$/.test(cedula);

    const validateUserForm = (userData) => {
        let newErrors = {};
        let isValid = true;

        const currentUsers = users.filter(user => user.cedula !== userData.cedula);

        if (!userData.nombres.trim()) {
            newErrors.nombres = 'Los nombres son obligatorios.'; isValid = false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.nombres.trim())) {
            newErrors.nombres = 'Los nombres solo pueden contener letras y espacios.'; isValid = false;
        }

        const emailRegex = /^[^\s@]+@uleam\.edu\.ec$/;
        if (!userData.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio.'; isValid = false;
        } else if (!emailRegex.test(userData.correo.trim())) {
            newErrors.correo = 'Introduce un correo válido con dominio @uleam.edu.ec.'; isValid = false;
        } else if (currentUsers.some(user => user.correo === userData.correo.trim())) {
            newErrors.correo = 'Este correo electrónico ya está registrado por otro usuario.'; isValid = false;
        }

        if (!userData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.'; isValid = false;
        } else if (!/^\d{10}$/.test(userData.telefono.trim())) {
            newErrors.telefono = 'El número de teléfono debe contener exactamente 10 dígitos.'; isValid = false;
        }

        if (!userData.area_trabajo) {
            newErrors.area_trabajo = 'Debes seleccionar un área de trabajo.'; isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();

        if (!currentUser) {
            setFormMessage({ text: 'Error: No hay usuario seleccionado para editar.', type: 'error' });
            return;
        }

        if (!validateUserForm(currentUser)) {
            setFormMessage({ text: 'Por favor, corrige los errores en el formulario.', type: 'error' });
            return;
        }
        
        const updatedUsers = users.map(user =>
            user.cedula === currentUser.cedula ? { ...currentUser, role: user.role } : user
        );
        
        setUsers(updatedUsers); 
        localStorage.setItem('users', JSON.stringify(updatedUsers)); 

        setFormMessage({ text: 'Usuario actualizado exitosamente.', type: 'success' });
        setShowUserForm(false);
        setCurrentUser(null);
        setFormErrors({});
    };

    // Abrir el formulario para editar un usuario existente
    const handleEditUser = (user) => {
        setCurrentUser({
            nombres: user.nombres,
            cedula: user.cedula,
            correo: user.correo,
            telefono: user.telefono,
            area_trabajo: user.area_trabajo,
            role: user.role
        });
        setFormErrors({});
        setFormMessage({ text: '', type: '' });
        setShowUserForm(true);
    };

    // Eliminar un usuario 
    const handleDeleteUser = (cedula) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar a este usuario?')) {
            const updatedUsers = users.filter(user => user.cedula !== cedula);
            setUsers(updatedUsers); // Actualiza el estado local
            localStorage.setItem('users', JSON.stringify(updatedUsers)); 

            setFormMessage({ text: 'Usuario eliminado exitosamente.', type: 'success' });
            if (currentUser && currentUser.cedula === cedula) {
                setShowUserForm(false);
                setCurrentUser(null);
            }
        }
    };

    return (
        <div className="usuarios-section-wrapper">
            <h1>Gestión de Usuarios</h1>
            <hr />

            {users.length === 0 && (
                <div className="empty-state-message">
                    <p>No hay usuarios registrados.</p>
                </div>
            )}

            {users.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Cédula</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Área de Trabajo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.cedula}>
                                <td>{user.nombres}</td>
                                <td>{user.cedula}</td>
                                <td>{user.correo}</td>
                                <td>{user.telefono}</td>
                                <td>{user.area_trabajo}</td>
                                <td>{user.role}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEditUser(user)}>Editar</button>
                                    {user.role !== 'admin' && (
                                        <button className="delete-btn" onClick={() => handleDeleteUser(user.cedula)}>Eliminar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showUserForm && currentUser && (
                <div className="form-modal-overlay">
                    <div className="form-modal-content">
                        <h2>Editar Usuario</h2>
                        {formMessage.text && (
                            <div className={`message ${formMessage.type}`}>
                                {formMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleUserSubmit}>
                            <div className="form-group">
                                <label htmlFor="nombres">Nombres:</label>
                                <input
                                    type="text" id="nombres" name="nombres"
                                    value={currentUser.nombres} onChange={handleChange} required
                                />
                                {formErrors.nombres && <p className="error-text">{formErrors.nombres}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="cedula">Cédula:</label>
                                <input
                                    type="text" id="cedula" name="cedula"
                                    value={currentUser.cedula} onChange={handleChange} required
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="correo">Correo:</label>
                                <input
                                    type="email" id="correo" name="correo"
                                    value={currentUser.correo} onChange={handleChange} required
                                />
                                {formErrors.correo && <p className="error-text">{formErrors.correo}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono:</label>
                                <input
                                    type="tel" id="telefono" name="telefono"
                                    value={currentUser.telefono} onChange={handleChange} required
                                />
                                {formErrors.telefono && <p className="error-text">{formErrors.telefono}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="area_trabajo">Área de trabajo:</label>
                                <select
                                    id="area_trabajo" name="area_trabajo"
                                    value={currentUser.area_trabajo} onChange={handleChange} required
                                >
                                    <option value="" disabled>Selecciona una opción</option>
                                    {areasDeTrabajo.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                                {formErrors.area_trabajo && <p className="error-text">{formErrors.area_trabajo}</p>}
                            </div>
                            <div className="form-actions">
                                <button type="submit">Actualizar Usuario</button>
                                <button type="button" onClick={() => { setShowUserForm(false); setCurrentUser(null); setFormErrors({}); }} className="cancel-btn">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;