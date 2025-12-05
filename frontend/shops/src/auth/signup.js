import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const navigate = useNavigate();
    const [firstname,setFirstName]=useState('');
    const [lastname,setLastName]=useState('');
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [errors,setErrors]=useState({});

    const handleRegister = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    first_name: firstname,
                    last_name: lastname,
                    password,
                    password2: confirmPassword
                })
            })
            const data = await response.json() 
            if (response.ok) {
                alert('Registration successful!')
                navigate('/login')
            } else {
                alert(data.message || 'Registration failed')
            }
        } catch (error) {
            alert('Network error: ' + error.message)
        }
    }

    useEffect(() => {
        if (confirmPassword && password) {
            if (password !== confirmPassword) {
                setErrors(prestate => ({...prestate, confirmPassword: 'Passwords do not match'}));
            } else {
                setErrors(prestate => ({...prestate, confirmPassword: ''}));
            }
        }
    }, [password, confirmPassword]);

  return (
    <div className='h-screen bg-gray-100'>
        <nav className='bg-green-900 p-4'>
            <h1 className='text-xl text-green-100'>GeoShop</h1>
        </nav>
        <div className='flex justify-center pt-24'>
            <div className='bg-white p-8 rounded shadow w-82'>
            <h3 className='text-lg font-bold mb-4'>Create an Account</h3>
            
            <div className='flex space-x-2 mb-3'>
                <input 
                    className='w-full p-2 border rounded'
                    type='text'
                    placeholder='Firstname'
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    className='w-full p-2 border rounded' 
                    type='text'
                    placeholder='Lastname'
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            
            <input 
                className='w-full p-2 border rounded mb-3'
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            
            <input 
                className='w-full p-2 border rounded mb-3'
                type='email'
                placeholder='abc@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className='flex space-x-2 mb-1'>
                <input 
                    className='w-full p-2 border rounded'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                    className='w-full p-2 border rounded'
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            {errors.confirmPassword && <p className='text-red-500 text-sm mb-3'>{errors.confirmPassword}</p>}
            <button onClick={handleRegister} className='w-full bg-green-900 text-white p-2 rounded mb-4'>Register</button>
            <p className='text-center text-sm'>Already have an account? <button onClick={()=>navigate('/login')} className='text-blue-500'>Login</button></p>
            </div>
        </div>    
    </div>
  )
}