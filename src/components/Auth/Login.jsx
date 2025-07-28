import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/AuthForms.css';

const ADMIN_AREA = 'Departamento de Talento Humano'; 

const Login = () => {
    const [formData, setFormData] = useState({
        cedula: '',
        contrasena: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
        setMessage({ text: '', type: '' });
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es obligatoria.';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.cedula.trim())) {
            newErrors.cedula = 'La cédula debe contener exactamente 10 dígitos numéricos.';
            isValid = false;
        }

        if (!formData.contrasena) {
            newErrors.contrasena = 'La contraseña es obligatoria.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage({ text: 'Por favor, corrige los errores en el formulario.', type: 'error' });
            return;
        }

        const enteredCedula = formData.cedula.trim();
        const enteredContrasena = formData.contrasena;
        let authenticatedUser = null;

        // 1. Intentar autenticar como el administrador predefinido
        const adminCedula = '1234567890';
        const adminContrasena = 'admin123';

        if (enteredCedula === adminCedula && enteredContrasena === adminContrasena) {
            authenticatedUser = {
                cedula: adminCedula,
                contrasena: adminContrasena,
                nombres: 'Admin Talento Humano',
                area_trabajo: ADMIN_AREA,
                role: 'admin' 
            };
        } else {
            // 2. Si no es el admin, buscar en la lista de usuarios registrados
            try {
                // Leer el array de usuarios desde localStorage 
                const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
                console.log("Usuarios cargados desde localStorage para autenticación:", storedUsers); 

                // Buscar el usuario en el array
                authenticatedUser = storedUsers.find(
                    user => user.cedula === enteredCedula && user.contrasena === enteredContrasena
                );

            } catch (error) {
                console.error("Error al leer usuarios de localStorage durante el login:", error);
                setMessage({ text: 'Ocurrió un error al cargar datos de usuario. Intenta de nuevo.', type: 'error' });
                return;
            }
        }

        if (authenticatedUser) {
            setMessage({ text: `¡Inicio de sesión con éxito!`, type: 'success' });
            console.log('Usuario autenticado:', authenticatedUser.cedula, 'Área:', authenticatedUser.area_trabajo, 'Rol:', authenticatedUser.role);

            localStorage.setItem('currentUserCedula', authenticatedUser.cedula);
            localStorage.setItem('currentUserName', authenticatedUser.nombres || authenticatedUser.cedula);
            localStorage.setItem('currentUserArea', authenticatedUser.area_trabajo);
            localStorage.setItem('currentUserRole', authenticatedUser.role || 'user'); 
            localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
            localStorage.removeItem('registeredUser'); 

            setTimeout(() => {
                setFormData({ cedula: '', contrasena: '' });
                setMessage({ text: '', type: '' });

                // Redirigir según el rol
                if (authenticatedUser.role === 'admin') {
                    navigate('/dashboard'); 
                } else {
                    navigate('/user-dashboard'); 
                }
            }, 1500);

        } else {
            setMessage({ text: 'Cédula o contraseña incorrectas.', type: 'error' });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <img src="/img/logo_uleam.png" alt="Logo ULEAM" className="auth-logo" />
            </div>

            <div className="auth-content">
                <h2 className="form-title">Iniciar Sesión</h2>

                {message.text && (
                    <div id="message" className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="cedula">
                            <i className="fas fa-id-card"></i> Cédula:
                        </label>
                        <input
                            type="text"
                            id="cedula"
                            name="cedula"
                            placeholder="Ingrese su cédula"
                            value={formData.cedula}
                            onChange={handleChange}
                            required
                        />
                        {errors.cedula && <p className="error-text">{errors.cedula}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="contrasena">
                            <i className="fas fa-lock"></i> Contraseña:
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            placeholder="Ingrese su contraseña"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                        {errors.contrasena && <p className="error-text">{errors.contrasena}</p>}
                    </div>

                    <Link to="/forgot-password" className="link-forgot-password">¿Olvidaste tu contraseña?</Link>

                    <div className="button-group">
                        <button type="submit" className="btn btn-primary">
                            Entrar
                        </button>
                    </div>

                    <p className="auth-footer-links">
                        ¿No tienes una cuenta? <Link to="/register" className="link-register">Regístrate aquí</Link>
                    </p>
                </form>
            </div>

            <footer className="site-footer">
                <p>&copy; 2025 Departamento de Talento Humano ULEAM.</p>
                <p>Contacto: departamentotalentohumanouleam@gmail.com</p>
            </footer>
        </div>
    );
};

export default Login;