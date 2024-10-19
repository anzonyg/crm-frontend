import React, { useState } from 'react';
import './UserMenu.css'; // Asegúrate de tener el archivo CSS con los estilos correctos

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const userName = localStorage.getItem('name') || 'Usuario';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.href = '/login';
    };

    return (
        <div className="user-menu-container">
            <div className="user-info" onClick={toggleMenu}>
                <img
                    src="https://via.placeholder.com/50"
                    alt="User Avatar"
                    className="user-avatar"
                />
                <span className="user-name">{userName}</span>
            </div>
            {isOpen && (
                <div className="user-menu-dropdown">
                    <ul>
                        <li><a href="/perfil">Perfil</a></li>
                        <li><a href="/configuracion">Configuración</a></li>
                        <li><a href="/dashboard">Tablero</a></li>
                        <li><a href="/ganancias">Ganancias</a></li>
                        <li><a href="/descargas">Descargas</a></li>
                        <li><button onClick={handleLogout} className="logout-button">Cerrar Sesión</button></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
