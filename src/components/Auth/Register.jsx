import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/AuthForms.css'; 

const Register = () => {
  // Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    cedula: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmar_contrasena: '',
    area_trabajo: ''
  });

  // Estado para el mensaje general de éxito/error 
  const [message, setMessage] = useState({ text: '', type: '' });

  // Estado para errores por campo 
  const [errors, setErrors] = useState({}); 

  // Hook para la navegación programática
  const navigate = useNavigate();

  // Maneja los cambios en los inputs y select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    // Limpiar el error específico del campo y el mensaje general cuando el usuario empieza a escribir
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '' // Limpia el error de este campo
    }));
    setMessage({ text: '', type: '' }); // Limpia el mensaje general
  };

  const validateCedulaFormat = (cedula) => {
    return /^\d{10}$/.test(cedula); 
  };

  const validateForm = () => {
    let newErrors = {}; 
    let isValid = true; 

    // --- Cargar usuarios existentes para la validación de unicidad ---
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 1. Validar Nombres:
    //    - No vacío
    //    - Solo letras y espacios 
    if (!formData.nombres.trim()) { 
      newErrors.nombres = 'Los nombres son obligatorios.';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombres.trim())) {
      newErrors.nombres = 'Los nombres solo pueden contener letras y espacios.';
      isValid = false;
    }

    // 2. Validar Cédula:
    //    - No vacía
    //    - Exactamente 10 dígitos numéricos 
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es obligatoria.';
      isValid = false;
    } else if (!validateCedulaFormat(formData.cedula.trim())) { 
        newErrors.cedula = 'La cédula debe contener exactamente 10 dígitos numéricos.';
        isValid = false;
    } else if (users.some(user => user.cedula === formData.cedula.trim())) { 
            newErrors.cedula = 'Esta cédula ya está registrada. Por favor, usa otra.';
            isValid = false;
        }

    // 3. Validar Correo:
    //    - No vacío
    //    - Formato válido de email con dominio @uleam.edu.ec
    const emailRegex = /^[^\s@]+@uleam\.edu\.ec$/; // Solo correos @uleam.edu.ec
  	if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
      isValid = false;
    } else if (!emailRegex.test(formData.correo.trim())) {
      newErrors.correo = 'Por favor, introduce un correo válido con dominio @uleam.edu.ec.';
      isValid = false;
    } else if (users.some(user => user.correo === formData.correo.trim())) { 
            newErrors.correo = 'Este correo electrónico ya está registrado. Por favor, usa otro.';
            isValid = false;
        }

    // 4. Validar Teléfono:
    //    - No vacío
  	//    - Solo 10 dígitos numéricos
  	if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
  	} else if (!/^\d{10}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'El número de teléfono debe contener exactamente 10 dígitos numéricos.';
      isValid = false;
  	}

  	// 5. Validar Contraseña: 
  	//    - No vacía
  	//    - Mínimo 6 caracteres
  	if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es obligatoria.';
      isValid = false;
  	} else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
  	} 

  	// 6. Validar Confirmar Contraseña:
  	//    - No vacía
  	//    - Debe coincidir con la contraseña
  	if (!formData.confirmar_contrasena) {
      newErrors.confirmar_contrasena = 'Confirmar contraseña es obligatorio.';
      isValid = false;
  	} else if (formData.contrasena !== formData.confirmar_contrasena) {
      newErrors.confirmar_contrasena = 'Las contraseñas no coinciden.';
      isValid = false;
  	}

  	// 7. Validar Área de Trabajo:
  	//    - No puede ser la opción por defecto (vacía)
  	if (!formData.area_trabajo) {
      newErrors.area_trabajo = 'Debes seleccionar un área de trabajo.';
      isValid = false;
  	}

  	setErrors(newErrors); 
  	return isValid; 
  };

  const handleSubmit = (e) => {
  	e.preventDefault(); 

  	// Ejecutar todas las validaciones antes de intentar enviar los datos
  	if (!validateForm()) {
      	setMessage({ text: 'Por favor, corrige los errores en el formulario.', type: 'error' });
      	return; 
  	}

  	// Si todas las validaciones pasan, procede con la lógica de registro
  	console.log('Datos de registro validados y listos para enviar:', formData);

  	// --- LÓGICA PARA GUARDAR EL NUEVO USUARIO EN LOCALSTORAGE ---
    try {
        let users = JSON.parse(localStorage.getItem('users')) || []; // Obtener la lista actual de usuarios
        
        // Asignar un rol al nuevo usuario (ej. 'user' por defecto)
        const newUser = { ...formData, role: 'user' }; 

        users.push(newUser); // Añadir el nuevo usuario a la lista
        localStorage.setItem('users', JSON.stringify(users)); // Guardar la lista actualizada

        setMessage({ text: 'Registro exitoso. ¡Ahora puedes iniciar sesión!', type: 'success' });
        
        setTimeout(() => {
            navigate('/login'); // Redirige al usuario a la página de login
        }, 2000); 

    } catch (error) {
        console.error("Error al guardar el usuario en localStorage:", error);
        setMessage({ text: 'Ocurrió un error al intentar registrarte. Por favor, intenta de nuevo.', type: 'error' });
    }
  };

  // Maneja el clic en el botón "Cancelar"
  const handleCancel = () => {
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-header">
          <img src="/img/logo_uleam.png" alt="Logo ULEAM" className="auth-logo" />
        </div>
        
        <div className="auth-content">
          <h1 className="form-title">Registro de Usuario</h1>
          
          {message.text && (
            <div id="message" className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nombres">Nombres:</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                placeholder="Ingrese sus nombres completos"
                required
                value={formData.nombres}
                onChange={handleChange}
              />
              {errors.nombres && <p className="error-text">{errors.nombres}</p>}
            </div>
            
            <div className="input-group">
              <label htmlFor="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                placeholder="Ingrese su número de cédula"
                required
                value={formData.cedula}
                onChange={handleChange}
              />
              {errors.cedula && <p className="error-text">{errors.cedula}</p>}
            </div>
            
            <div className="input-group">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@uleam.edu.ec"
                required
                value={formData.correo}
                onChange={handleChange}
              />
              {errors.correo && <p className="error-text">{errors.correo}</p>}
            </div>
            
            <div className="input-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Ingrese su número de teléfono"
                required
                value={formData.telefono}
                onChange={handleChange}
              />
              {errors.telefono && <p className="error-text">{errors.telefono}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="contrasena">Contraseña:</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                placeholder="Cree una contraseña"
                required
                value={formData.contrasena}
                onChange={handleChange}
              />
              {errors.contrasena && <p className="error-text">{errors.contrasena}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="confirmar_contrasena">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmar_contrasena"
                name="confirmar_contrasena"
                placeholder="Confirme su contraseña"
                required
                value={formData.confirmar_contrasena}
                onChange={handleChange}
              />
              {errors.confirmar_contrasena && <p className="error-text">{errors.confirmar_contrasena}</p>}
            </div>
            
            <div className="input-group">
              <label htmlFor="area">Área de trabajo:</label>
              <select
                id="area"
                name="area_trabajo"
                required
                value={formData.area_trabajo}
                onChange={handleChange}
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="Decanato">Decanato</option>
                <option value="Vicedecanato">Vicedecanato</option>
                <option value="Direccion de Carrera">Dirección de Carrera</option>
                <option value="Docencia">Docencia</option>
                <option value="Investigacion">Investigación</option>
                <option value="Secretaria Academica">Secretaría Académica</option>
                <option value="Tecnico de Laboratorio">Técnico de Laboratorio</option>
                <option value="Soporte Informatico">Soporte Informático</option>
                <option value="Administracion de Redes">Administración de Redes</option>
                <option value="Desarrollo de Software Interno">Desarrollo de Software Interno</option>
                <option value="Vinculacion con la Sociedad">Vinculación con la Sociedad</option>
                <option value="Gestion Administrativa">Gestión Administrativa</option>
                <option value="Coordinacion de Proyectos">Coordinación de Proyectos</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Bases de Datos">Bases de Datos</option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Robotica">Robótica</option>
                <option value="Analisis de Datos">Análisis de Datos</option>
                <option value="Gestion de Calidad">Gestión de Calidad</option>
                <option value="Asesoria Estudiantil">Asesoría Estudiantil</option>
              </select>
              {errors.area_trabajo && <p className="error-text">{errors.area_trabajo}</p>}
            </div>
            
            <div className="button-group">
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary"> 
                Guardar
              </button>
            </div>
          </form> 
        </div>
        
        <footer className="site-footer">
          <p>&copy; 2025 Departamento de Talento Humano ULEAM.</p>
          <p>Contacto: departamentotalentohumanouleam@gmail.com</p>
        </footer>
      </div>
    </>
  );
};

export default Register;