import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AuthForms.css'; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});
  const [userCedulaToReset, setUserCedulaToReset] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar el componente, obtener la cédula del usuario que se verificó
    const cedula = localStorage.getItem('userCedulaToReset');
    if (cedula) {
      setUserCedulaToReset(cedula);
    } else {
      // Si no hay cédula, significa que no pasaron por ForgotPassword
      setMessage({ text: 'Acceso no autorizado. Por favor, verifica tu cuenta primero.', type: 'error' });
      setTimeout(() => navigate('/forgot-password'), 2000); 
    }
  }, [navigate]); 

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria.';
      isValid = false;
    } else if (newPassword.length < 6) { 
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userCedulaToReset) {
        setMessage({ text: 'No se ha podido identificar al usuario para restablecer la contraseña.', type: 'error' });
        return;
    }

    if (!validateForm()) {
      setMessage({ text: 'Por favor, corrige los errores en el formulario.', type: 'error' });
      return;
    }

    // Obtener todos los usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Encontrar el índice del usuario que estamos intentando restablecer
    const userIndex = storedUsers.findIndex(user => user.cedula === userCedulaToReset);

    if (userIndex !== -1) {
      // Si el usuario es encontrado, actualizamos su contraseña
      storedUsers[userIndex].contrasena = newPassword; 
      
      localStorage.setItem('users', JSON.stringify(storedUsers));
      localStorage.removeItem('userCedulaToReset');

      setMessage({ text: 'Contraseña restablecida exitosamente. Redirigiendo a inicio de sesión...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessage({ text: 'Error: Usuario no encontrado en los registros para restablecer la contraseña.', type: 'error' });
    }
  };

  if (!userCedulaToReset && !message.text) { 
      return (
        <div className="auth-container">
            <div className="auth-content">
                <p>Cargando...</p> 
            </div>
        </div>
      );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/img/logo_uleam.png" alt="Logo ULEAM" className="auth-logo" />
      </div>
      <div className="auth-content">
        <h2 className="form-title">Restablecer Contraseña</h2>
        <p className="form-description">
          Ingresa tu nueva contraseña.
        </p>

        {message.text && (
          <div id="message" className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">
              <i className="fas fa-lock"></i> Nueva Contraseña:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Ingrese su nueva contraseña"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors(prev => ({ ...prev, newPassword: '' }));
                setMessage({ text: '', type: '' }); // Limpiar mensaje al escribir
              }}
              required
            />
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i> Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme su nueva contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                setMessage({ text: '', type: '' }); // Limpiar mensaje al escribir
              }}
              required
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Cambiar Contraseña
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

export default ResetPassword;