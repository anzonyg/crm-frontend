import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('name', res.data.name);
            navigate('/'); // Redirige al home o dashboard después del login
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error al iniciar sesión:', error.response.data.message);
                alert(`Error al iniciar sesión: ${error.response.data.message}`);
            } else {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión. Verifica tus credenciales');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Aquí agrego el logo */}
                <div className="logo-container">
                    <img src={process.env.PUBLIC_URL + '/assets/logo-CRM2024.png'} alt="CRM Logo" className="login-logo" />
                </div>

                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Accede a tu cuenta</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-login">Iniciar Sesión</button>
                </form>

                <div className="forgot-password">
                    <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                </div>

                <div className="signup-link">
                    <a href="/register">No tienes una cuenta? Regístrate aquí</a>
                </div>
            </div>
        </div>
    );
};

export default Login;


