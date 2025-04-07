import React, { useState } from 'react';
import heroImage from '../src/assets/hero/hero_signin.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import '../components/Style/SignInStyles.css';

function SignIn() {
    const [formState, setFormState] = useState('login');
	
	const renderForm = () => {
		switch (formState) {
			case 'login':
				return <Login onToggleForm={() => setFormState('register')} onForgotPassword={() => setFormState('forgot')} />;
			case 'register':
				return <Register onToggleForm={() => setFormState('login')} />;
			case 'forgot':
				return <ForgotPassword onToggleForm={() => setFormState('login')} />;
			default:
				return null;
		}
	};
    return (
        <>
            <Navbar />
            <Hero
                cName="heroSignIn"
                heroImage={heroImage}
            />
			{renderForm()}
            <Footer />
        </>
    );
}

export default SignIn;
