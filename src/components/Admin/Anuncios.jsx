import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../CSS/AdminInterface.css'; 

const Anuncios = () => {
    // Referencia para el editor de TinyMCE
    const editorRef = useRef(null);

    // Estado para la lista de anuncios
    const [anuncios, setAnuncios] = useState(() => {
        try {
            const storedAnuncios = localStorage.getItem('anunciosData');
            return storedAnuncios ? JSON.parse(storedAnuncios) : [];
        } catch (error) {
            console.error("Error al cargar anuncios de localStorage:", error);
            return [];
        }
    });

    // useEffect para guardar los anuncios en localStorage cada vez que cambian
    useEffect(() => {
        try {
            localStorage.setItem('anunciosData', JSON.stringify(anuncios));
        } catch (error) {
            console.error("Error al guardar anuncios en localStorage:", error);
        }
    }, [anuncios]);

    // Estado para controlar la visibilidad del formulario de creación/edición
    const [showForm, setShowForm] = useState(false);

    // Estado para los datos del nuevo anuncio o el que se está editando
    const [currentAnuncio, setCurrentAnuncio] = useState({
        id: null,
        titulo: '',
        contenido: '<p>Aquí puedes escribir el contenido completo de tu anuncio.</p>', // Contenido inicial para el editor
        fechaPublicacion: '',
    });

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAnuncio(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar cambios en el editor TinyMCE
    const handleEditorChange = (content, editor) => {
        setCurrentAnuncio(prev => ({ ...prev, contenido: content }));
    };

    // Función para añadir/actualizar un anuncio
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!currentAnuncio.titulo.trim() || !currentAnuncio.contenido.trim() || !currentAnuncio.fechaPublicacion) {
            alert('Por favor, completa todos los campos obligatorios: Título, Contenido y Fecha de Publicación.');
            return;
        }

        if (currentAnuncio.id) {
            // Lógica para actualizar un anuncio existente
            setAnuncios(prevAnuncios =>
                prevAnuncios.map(anuncio =>
                    anuncio.id === currentAnuncio.id ? currentAnuncio : anuncio
                )
            );
            alert('Anuncio actualizado con éxito.');
        } else {
            // Lógica para añadir un nuevo anuncio
            const newAnuncio = {
                ...currentAnuncio,
                id: Date.now() // Generar un ID único 
            };
            setAnuncios(prevAnuncios => [...prevAnuncios, newAnuncio]);
            alert('Anuncio creado con éxito.');
        }

        // Limpiar formulario y ocultar
        setCurrentAnuncio({
            id: null,
            titulo: '',
            contenido: '<p>Aquí puedes escribir el contenido completo de tu anuncio.</p>',
            fechaPublicacion: '',
        });
        setShowForm(false);
    };

    // Función para editar un anuncio 
    const handleEdit = (anuncio) => {
        setCurrentAnuncio(anuncio);
        setShowForm(true);
    };

    // Función para eliminar un anuncio
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
            setAnuncios(prevAnuncios => prevAnuncios.filter(anuncio => anuncio.id !== id));
            alert('Anuncio eliminado.');
        }
    };

    // Función para abrir el formulario para crear uno nuevo
    const handleNewAnuncio = () => {
        setCurrentAnuncio({
            id: null,
            titulo: '',
            contenido: '<p>Aquí puedes escribir el contenido completo de tu anuncio.</p>',
            fechaPublicacion: new Date().toISOString().split('T')[0], // Establece la fecha actual por defecto
        });
        setShowForm(true);
    };

    return (
        <div className="anuncios-section-wrapper">
            <div className="section-header-with-button">
                <h1>Gestión de Anuncios</h1>
                <button
                    className="btn-add-new" 
                    onClick={handleNewAnuncio}
                >
                    + Crear Nuevo Anuncio
                </button>
            </div>

            {/* Mensaje cuando no hay anuncios y el formulario no está visible */}
            {anuncios.length === 0 && !showForm && (
                <div className="empty-state-message">
                    <p>No hay anuncios publicados aún.</p>
                </div>
            )}

            {/* Tabla de anuncios */}
            {anuncios.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Fecha de Publicación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anuncios.map(anuncio => (
                            <tr key={anuncio.id}>
                                <td>{anuncio.titulo}</td>
                                <td>{anuncio.fechaPublicacion}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(anuncio)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleDelete(anuncio.id)}>Eliminar</button>
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
                        <h2>{currentAnuncio.id ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="titulo">Título:</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    value={currentAnuncio.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaPublicacion">Fecha de Publicación:</label>
                                <input
                                    type="date"
                                    id="fechaPublicacion"
                                    name="fechaPublicacion"
                                    value={currentAnuncio.fechaPublicacion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group tinymce-editor-container">
                                <label>Contenido Completo del Anuncio:</label>
                                <Editor
                                    apiKey='lepi3l25n6c5dwjx7r02sceh34lcizihg4q58hhh135mvkic' // API Key de TinyMCE
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={currentAnuncio.contenido}
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
                                    {currentAnuncio.id ? 'Actualizar Anuncio' : 'Publicar Anuncio'}
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

export default Anuncios;