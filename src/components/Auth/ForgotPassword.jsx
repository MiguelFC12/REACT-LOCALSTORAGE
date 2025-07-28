import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/AuthForms.css'; 

const ForgotPassword = () => {
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cedula') {
      setCedula(value);
    } else if (name === 'email') {
      setEmail(value);
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
    setMessage({ text: '', type: '' });
  };

  const validateCedulaFormat = (cedulaValue) => {
    // Valida que sean exactamente 10 dígitos numéricos
    return /^\d{10}$/.test(cedulaValue);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!cedula.trim()) {
      newErrors.cedula = 'La cédula es obligatoria.';
      isValid = false;
    } else if (!validateCedulaFormat(cedula.trim())) {
      newErrors.cedula = 'La cédula debe contener exactamente 10 dígitos numéricos.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
      isValid = false;
    } else if (!/^[^\s@]+@uleam\.edu\.ec$/.test(email.trim())) {
      newErrors.email = 'Por favor, introduce un correo válido con dominio @uleam.edu.ec.';
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

    // --- CAMBIO CLAVE ---
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Buscar si existe un usuario que coincida con la cédula Y el correo
    const userToReset = storedUsers.find(
      (user) => user.cedula === cedula.trim() && user.correo === email.trim()
    );

    if (userToReset) {
      // Guardar la cédula del usuario a restablecer en localStorage
      // Esto es crucial para que el componente ResetPassword sepa qué usuario actualizar
      localStorage.setItem('userCedulaToReset', cedula.trim());

      setMessage({ text: 'Usuario verificado. Redirigiendo para restablecer contraseña...', type: 'success' });
      
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
      
    } else {
      setMessage({ text: 'Cédula o correo no encontrados en nuestros registros.', type: 'error' });
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/img/logo_uleam.png" alt="Logo ULEAM" className="auth-logo" />
      </div>
      
      <div className="auth-content">
        <h2 className="form-title">¿Olvidaste tu Contraseña?</h2>
        <p className="form-description">
            Ingresa tu cédula y correo electrónico registrado para verificar tu cuenta y restablecer tu contraseña.
        </p>

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
              placeholder="Ingrese su número de cédula"
              value={cedula}
              onChange={handleChange}
              required
            />
            {errors.cedula && <p className="error-text">{errors.cedula}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Correo:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@uleam.edu.ec"
              value={email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          
          <div className="button-group">
            <button type="button" className="btn btn-cancel" onClick={handleBackToLogin}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Verificar y Restablecer
            </button>
          </div>
        </form>
      </div>

      <footer className="site-footer">
        <p>&copy; 2025 Departamento de Talento Humano ULEAM.</p>
        <p>Contacto: departamentotalentohumanouleam@gmail.com</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;