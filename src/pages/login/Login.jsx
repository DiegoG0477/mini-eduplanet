import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Login.css';
import { io } from 'socket.io-client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía los datos del formulario a la API
      const response = await axios.post('http://34.197.57.0:4000/auth/login', { email, password });
      // Si la autenticación es exitosa, redirige al dashboard
      if (response.status === 200) {
        // Accede al token en la propiedad 'data' de la respuesta
        localStorage.setItem('token', JSON.stringify(response.data.token));
        // Convierte la clave a Uint8Array
        const userId = jwtDecode(response.data.token).id;
        // Verifica el token con la clave
        localStorage.setItem('userId', JSON.stringify(userId));
        navigate('/dashboard');
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  };

  

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
