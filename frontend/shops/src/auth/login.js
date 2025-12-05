import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
    const navigate = useNavigate()
    
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const handleLogin = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if (response.ok) {
            try {
                const data = await response.json()
                localStorage.setItem('token', data.token )
                navigate('/dashboard')
            } catch (error) {
                navigate('/dashboard')
            }
        } else {
            alert('Login failed')
        }
    };
  return (
    <div className='h-screen bg-gray-100'>
        <nav className='bg-green-900 p-4'>
            <h1 className='text-xl text-green-100'>GeoShop</h1>
        </nav>
        <div className='flex justify-center pt-20'>
            <div className='bg-white p-8 rounded shadow w-80'>
                <h3 className='text-lg font-bold mb-4'>Login</h3>
                <input 
                    className='w-full p-2 border rounded mb-3'
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    className='w-full p-2 border rounded mb-4'
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className='w-full bg-green-900 text-white p-2 rounded'>Login</button>
                <p className='text-center mt-4 text-sm'>Not yet Register? <button onClick={() => navigate('/signup')} className='text-blue-500'>Signup</button></p>
            </div>
        </div>
    </div>
  )
}