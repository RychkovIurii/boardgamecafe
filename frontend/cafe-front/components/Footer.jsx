import React from 'react';
import logo from "../assets/logo3.png";
import './Style/FooterStyles.css';

export default function Footer() {
    return (
        <div className='footer'>
            <div className='top'>
                <a className="footer-logo" href="/"><img src={logo} width={80} height={80} alt="logo"/>BoardGameCafe</a>
                <p>© 2024 Created by Varia Students. All rights reserved.</p>
                <div className='social-links'>
                    <a href='/'>
                        <i className='fa-brands fa-facebook-f'></i>
                    </a>
                    <a href='/'>
                        <i className='fa-brands fa-instagram'></i>
                    </a>
                    <a href='/'>
                        <i className='fa-brands fa-youtube'></i>
                    </a>
                    <a href='/'>
                        <i className='fa-brands fa-whatsapp'></i>
                    </a>
                </div>
            </div>

            <div className='bottom'>
                <div>
                    <h4>Contact</h4>
                    <a href='/'>Call us</a>
                    <a href='/'>Email us</a>
                    <a href='/'>Careers</a>
                </div>
                <div>
                    <h4>About</h4>
                    <a href='/'>About Us</a>
                    <a href='/'>Staff</a>
                    <a href='/'>Partners</a>
                </div>
                <div>
                    <h4>Others</h4>
                    <a href='/'>Privacy Policy</a>
                    <a href='/'>License</a>
                    <a href='/'>Terms of Service</a>
                </div>
            </div>
        </div>
    )
}
