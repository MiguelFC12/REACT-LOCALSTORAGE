import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes de Autenticación
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

// Importa tus componentes de Administrador
import AdminDashboard from './components/Admin/AdminDashboard';
import CapacitacionesAdmin from './components/Admin/Capacitaciones'; 
import AnunciosAdmin from './components/Admin/Anuncios'; 
import CertificadosAdmin from './components/Admin/Certificados'; 
import UsuariosAdmin from './components/Admin/Usuarios'; 

// Importa tus componentes de Usuario
import UserDashboard from './components/User/UserDashboard'; 
import Capacitacion from './components/User/Capacitacion'; 
import UserAnuncios from './components/User/UserAnuncios'; 
import UserCertificados from './components/User/UserCertificados'; 
import UserPerfil from './components/User/UserPerfil'; 
import PaginaCursoDetalle from './components/User/PaginaCursoDetalle'; 

function App() {
    return (
        <Router>
            <Routes>
                {/* --- RUTAS DE AUTENTICACIÓN --- */}
                <Route path="/" element={<Login />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* --- RUTAS DEL DASHBOARD DE ADMINISTRADOR --- */}
                <Route path="/dashboard" element={<AdminDashboard />}>
                    <Route path="capacitaciones" element={<CapacitacionesAdmin />} />
                    <Route path="anuncios" element={<AnunciosAdmin />} />
                    <Route path="certificados" element={<CertificadosAdmin />} />
                    <Route path="usuarios" element={<UsuariosAdmin />} />
                </Route>

                {/* --- RUTAS DEL DASHBOARD DE USUARIOS --- */}
                <Route path="/user-dashboard" element={<UserDashboard />}>
                    <Route index element={<UserAnuncios />} /> 
                    <Route path="capacitacion" element={<Capacitacion />} /> 
                    <Route path="certificados" element={<UserCertificados />} />
                    <Route path="perfil" element={<UserPerfil />} />
                    <Route path="curso/:id" element={<PaginaCursoDetalle />} /> 
                </Route>

            </Routes>
        </Router>
    );
}

export default App;