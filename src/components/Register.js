import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Asegúrate de tener el archivo CSS

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegurarse de enviar los datos en formato JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Enviar la solicitud al servidor
            await axios.post(
                'http://localhost:4000/api/auth/register',
                { email, password, name },
                config
            );

            alert('Usuario registrado exitosamente');
            navigate('/login'); // Redirigir al usuario a la página de inicio de sesión después del registro
        } catch (error) {
            console.error('Error al registrar usuario', error.response?.data || error.message);
            alert('Error al registrar usuario. Intenta nuevamente');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Regístrate</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <button type="submit" className="btn-register">Crear Cuenta</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
