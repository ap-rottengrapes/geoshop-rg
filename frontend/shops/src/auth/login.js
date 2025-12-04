import React, { useState } from 'react'

export default function LoginForm({ onSwitchToSignup, onLoginSuccess }) {

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
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
                    type='email'
                    placeholder='abc@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    className='w-full p-2 border rounded mb-4'
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={onLoginSuccess} className='w-full bg-green-900 text-white p-2 rounded'>Login</button>
                <p className='text-center mt-4 text-sm'>Not yet Register? <button onClick={onSwitchToSignup} className='text-blue-500'>Signup</button></p>
            </div>
        </div>
    </div>
  )
}