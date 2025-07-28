import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import '../../CSS/UserInterface.css'; 

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [userName, setUserName] = useState('');
    const [userCedula, setUserCedula] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('currentUserName');
        const storedCedula = localStorage.getItem('currentUserCedula');
        if (storedName) {
            setUserName(storedName);
        }
        if (storedCedula) {
            setUserCedula(storedCedula);
        }

        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.header-right')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isDropdownOpen]);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = (e) => { 
        e.preventDefault(); 
        localStorage.removeItem('currentUserCedula');
        localStorage.removeItem('currentUserName');
        localStorage.removeItem('currentUserArea');
        localStorage.removeItem('currentUserRole');
        localStorage.removeItem('currentUser'); 
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/user-dashboard') {
            return location.pathname === '/user-dashboard'; 
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="user-dashboard-container">
            <header className="main-header-top">
                <div className="header-left">
                    <img src="/img/logo_uleam.png" alt="Logo Uleam" className="header-logo" />
                </div>

                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/user-dashboard" className={`nav-link ${isActive('/user-dashboard') ? 'active' : ''}`}>
                                <i className="fa-solid fa-house"></i>Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/capacitacion" className={`nav-link ${isActive('/user-dashboard/capacitacion') ? 'active' : ''}`}>
                                <i className="fa-solid fa-graduation-cap"></i>Capacitaciones
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/certificados" className={`nav-link ${isActive('/user-dashboard/certificados') ? 'active' : ''}`}>
                                <i className="fa-solid fa-certificate"></i>Mis Certificados
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-right">
                    <button className="user-profile-icon" onClick={toggleDropdown}>
                        <i className="fa-solid fa-user-circle"></i>
                        <span className="user-name">{userName.split(' ')[0] || 'Usuario'}</span>
                    </button>
                    <div className={`user-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                        <ul>
                            <li>
                                <Link to="/user-dashboard/perfil" onClick={() => setIsDropdownOpen(false)}>
                                    <i className="fa-solid fa-id-card"></i>Mi Perfil
                                </Link>
                            </li>
                            <li>
                                <a href="#" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i>Cerrar Sesión
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <main className="main-content-area"> 
                <Outlet /> 
            </main>

        </div>
    );
};

export default UserDashboard;