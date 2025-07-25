import React, { useState } from 'react';
import api from '../api';

function Login() {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/login', { email, password });
            alert('Login successful!');
            // You can redirect or set user state here
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
