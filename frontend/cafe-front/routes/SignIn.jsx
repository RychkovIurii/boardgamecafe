import React, { useState } from 'react';
import heroImage from '../src/assets/hero/hero_signin.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../components/Login';
import Register from '../components/Register';
import '../components/Style/SignInStyles.css';

function SignIn() {
    const [isLogin, setIsLogin] = useState(true); // State to toggle forms
	
	const toggleForm = () => setIsLogin(!isLogin); // Toggle between login and registration
    return (
        <>
            <Navbar />
            <Hero
                cName="heroSignIn"
                heroImage={heroImage}
            />
			{isLogin ? <Login onToggleForm={toggleForm} /> : <Register onToggleForm={toggleForm} />}
            <Footer />
        </>
    );
}

export default SignIn;
