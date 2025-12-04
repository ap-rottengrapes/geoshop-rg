import React, { useState } from 'react'
import LoginForm from './auth/login'
import SignupForm from './auth/signup'
import Dashboard from './Dashboard'

export default function AuthContainer() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    if (isLoggedIn) {
        return <Dashboard onLogout={() => setIsLoggedIn(false)} />
    }

    return (
        <div>
            {isLogin ? (
                <LoginForm 
                    onSwitchToSignup={() => setIsLogin(false)} 
                    onLoginSuccess={() => setIsLoggedIn(true)}
                />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    )
}