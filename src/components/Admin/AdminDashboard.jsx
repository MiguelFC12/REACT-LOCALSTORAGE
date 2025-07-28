import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import '../../CSS/AdminInterface.css';

const ADMIN_AREA = 'Departamento de Talento Humano';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [userArea, setUserArea] = useState('');

    useEffect(() => {
        const storedArea = localStorage.getItem('currentUserArea');
        const storedName = localStorage.getItem('currentUserName');

        if (!storedArea || storedArea !== ADMIN_AREA) {
            alert('Acceso denegado. Debes iniciar sesión como administrador.');
            // Usamos setTimeout para asegurar que la alerta se muestre antes de la redirección
            setTimeout(() => {
                navigate('/login');
            }, 0); 
        } else {
            setUserName(storedName || 'Administrador');
            setUserArea(storedArea);
        }
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUserCedula');
        localStorage.removeItem('currentUserName');
        localStorage.removeItem('currentUserArea');
        navigate('/login');
    };

    if (userArea !== ADMIN_AREA) {
        return null;
    }

    const isDashboardRoot = location.pathname === '/dashboard';

    const mainContentClass = `main-content ${isDashboardRoot ? 'main-content-home-bg' : ''}`;

    return (
        <div className="admin-dashboard-wrapper">
            <div className="sidebar">
                <div className="logo">
                    <i className="fas fa-cubes"></i> ULEAM
                </div>
                <ul>
                    <li>
                        <Link
                            to="/dashboard"
                            className={isDashboardRoot ? 'active' : ''}
                        >
                            <i className="fas fa-home"></i> Inicio
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/capacitaciones"
                            className={location.pathname === '/dashboard/capacitaciones' ? 'active' : ''}
                        >
                            <i className="fas fa-chalkboard-teacher"></i> Capacitaciones
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/anuncios"
                            className={location.pathname === '/dashboard/anuncios' ? 'active' : ''}
                        >
                            <i className="fas fa-bullhorn"></i> Anuncios
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/certificados"
                            className={location.pathname === '/dashboard/certificados' ? 'active' : ''}
                        >
                            <i className="fas fa-certificate"></i> Certificados
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/usuarios"
                            className={location.pathname === '/dashboard/usuarios' ? 'active' : ''}
                        >
                            <i className="fas fa-user-circle"></i> Usuarios
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </a>
                    </li>
                </ul>
            </div>

            <div className={mainContentClass}> 
                {isDashboardRoot && (
                    <>
                        <div className="anuncios-bar">
                            <div className="anuncio-item">
                                <span className="icon"><i className="fas fa-bell"></i></span>
                                <p>Bienvenido, <strong>{ADMIN_AREA}</strong></p>
                            </div>
                        </div>
                    </>
                )}

                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;