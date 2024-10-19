import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Asegúrate de tener el archivo CSS

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia la carga
        setMessage(''); // Resetea el mensaje al enviar

        try {
            const res = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
            setMessage(res.data.message); // Muestra el mensaje de éxito
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al enviar el correo. Verifique el correo electrónico ingresado.');
        } finally {
            setLoading(false); // Finaliza la carga
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Olvidé mi contraseña</h2>
            <p>Introduce tu correo electrónico y te enviaremos una contraseña temporal.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"  // Añadido id
                    name="email"  // Añadido name
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            {message && (
                <p aria-live="polite" style={{ color: message.includes('Error') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default ForgotPassword;
