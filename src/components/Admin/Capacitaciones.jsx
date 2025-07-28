import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../CSS/AdminInterface.css';

const Capacitaciones = () => {
    // Referencia para el editor de TinyMCE
    const editorRef = useRef(null);

    // Estado para la lista de capacitaciones
    // Inicializa el estado leyendo de localStorage
    const [capacitaciones, setCapacitaciones] = useState(() => {
        try {
            const storedCapacitaciones = localStorage.getItem('capacitacionesData');
            // Si hay datos en localStorage, parsea y úsalos; de lo contrario, un arreglo vacío.
            return storedCapacitaciones ? JSON.parse(storedCapacitaciones) : [];
        } catch (error) {
            console.error("Error al cargar capacitaciones de localStorage:", error);
            return []; 
        }
    });

    // useEffect para guardar las capacitaciones en localStorage cada vez que cambian
    useEffect(() => {
        try {
            localStorage.setItem('capacitacionesData', JSON.stringify(capacitaciones));
        } catch (error) {
            console.error("Error al guardar capacitaciones en localStorage:", error);
        }
    }, [capacitaciones]); 
    // Estado para controlar la visibilidad del formulario de creación/edición
    const [showForm, setShowForm] = useState(false);

    // Estado para los datos de la nueva capacitación o la que se está editando
    const [currentCapacitacion, setCurrentCapacitacion] = useState({
        id: null,
        titulo: '',
        descripcionCorta: '',
        duracion: '',
        tipoInscripcion: 'Libre', // Valor por defecto
        fechaInicio: '',
        fechaFin: '',
        contenidoCompleto: '<p>Aquí puedes añadir el temario, enlaces a videos, tareas, etc.</p>' 
    });

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCapacitacion(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar cambios en el editor TinyMCE
    const handleEditorChange = (content, editor) => {
        setCurrentCapacitacion(prev => ({ ...prev, contenidoCompleto: content }));
    };

    // Función para añadir/actualizar una capacitación
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas 
        if (!currentCapacitacion.titulo || !currentCapacitacion.descripcionCorta || !currentCapacitacion.fechaInicio || !currentCapacitacion.fechaFin) {
            alert('Por favor, completa todos los campos obligatorios: Título, Descripción Corta, Fecha Inicio y Fecha Fin.');
            return;
        }

        if (new Date(currentCapacitacion.fechaInicio) > new Date(currentCapacitacion.fechaFin)) {
            alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
            return;
        }

        if (currentCapacitacion.id) {
            // Lógica para actualizar una capacitación existente
            setCapacitaciones(prevCaps =>
                prevCaps.map(cap =>
                    cap.id === currentCapacitacion.id ? currentCapacitacion : cap
                )
            );
            alert('Capacitación actualizada con éxito.');
        } else {
            // Lógica para añadir una nueva capacitación
            const newCapacitacion = {
                ...currentCapacitacion,
                id: Date.now() // Generar un ID único 
            };
            setCapacitaciones(prevCaps => [...prevCaps, newCapacitacion]);
            alert('Capacitación creada con éxito.');
        }

        // Limpiar formulario y ocultar
        setCurrentCapacitacion({
            id: null,
            titulo: '',
            descripcionCorta: '',
            duracion: '',
            tipoInscripcion: 'Libre',
            fechaInicio: '',
            fechaFin: '',
            contenidoCompleto: '<p>Aquí puedes añadir el temario, enlaces a videos, tareas, etc.</p>' // Contenido inicial
        });
        setShowForm(false);
    };

    // Función para editar una capacitación 
    const handleEdit = (cap) => {
        setCurrentCapacitacion(cap);
        setShowForm(true);
    };

    // Función para eliminar una capacitación
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta capacitación?')) {
            setCapacitaciones(prevCaps => prevCaps.filter(cap => cap.id !== id));
            alert('Capacitación eliminada.');
        }
    };

    // Función para abrir el formulario para crear una nueva
    const handleNewCapacitacion = () => {
        setCurrentCapacitacion({
            id: null,
            titulo: '',
            descripcionCorta: '',
            duracion: '',
            tipoInscripcion: 'Libre',
            fechaInicio: '',
            fechaFin: '',
            contenidoCompleto: '<p>Aquí puedes añadir el temario, enlaces a videos, tareas, etc.</p>'
        });
        setShowForm(true);
    };

    return (
        <div className="capacitaciones-section-wrapper">
            <div className="section-header-with-button">
                <h1>Gestión de Capacitaciones</h1>
                <button
                    className="btn-add-new" 
                    onClick={handleNewCapacitacion}
                >
                    + Crear Nueva Capacitación
                </button>
            </div>

            {capacitaciones.length === 0 && !showForm && (
                <div className="empty-state-message">
                    <p>Aún no hay capacitaciones disponibles.</p>
                </div>
            )}

            {/* Tabla de capacitaciones */}
            {capacitaciones.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Descripción Corta</th>
                            <th>Duración</th>
                            <th>Tipo</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {capacitaciones.map(cap => (
                            <tr key={cap.id}>
                                <td>{cap.titulo}</td>
                                <td>{cap.descripcionCorta}</td>
                                <td>{cap.duracion}</td>
                                <td>{cap.tipoInscripcion}</td>
                                <td>{cap.fechaInicio}</td>
                                <td>{cap.fechaFin}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(cap)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleDelete(cap.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal/Formulario de Creación/Edición */}
            {showForm && (
                <div className="form-modal-overlay">
                    <div className="form-modal-content">
                        <h2>{currentCapacitacion.id ? 'Editar Capacitación' : 'Crear Nueva Capacitación'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="titulo">Título:</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    value={currentCapacitacion.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="descripcionCorta">Descripción Corta:</label>
                                <textarea
                                    id="descripcionCorta"
                                    name="descripcionCorta"
                                    value={currentCapacitacion.descripcionCorta}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="duracion">Duración Estimada:</label>
                                <input
                                    type="text"
                                    id="duracion"
                                    name="duracion"
                                    value={currentCapacitacion.duracion}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipoInscripcion">Tipo de Inscripción:</label>
                                <select
                                    id="tipoInscripcion"
                                    name="tipoInscripcion"
                                    value={currentCapacitacion.tipoInscripcion}
                                    onChange={handleChange}
                                >
                                    <option value="Libre">Libre</option>
                                    <option value="Obligatoria">Obligatoria</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                <input
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    value={currentCapacitacion.fechaInicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaFin">Fecha de Fin:</label>
                                <input
                                    type="date"
                                    id="fechaFin"
                                    name="fechaFin"
                                    value={currentCapacitacion.fechaFin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group tinymce-editor-container">
                                <label>Contenido Completo de la Capacitación:</label>
                                <Editor
                                    apiKey='lepi3l25n6c5dwjx7r02sceh34lcizihg4q58hhh135mvkic'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={currentCapacitacion.contenidoCompleto}
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'code | undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'link image media | removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit">
                                    {currentCapacitacion.id ? 'Actualizar Capacitación' : 'Crear Capacitación'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
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

export default Capacitaciones;