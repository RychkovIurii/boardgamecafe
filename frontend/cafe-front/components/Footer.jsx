import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from "../assets/logo3.png";
import './Style/FooterStyles.css';
import Award1 from "../assets/Award1.png";
import Award2 from "../assets/Award2.png";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <div className='footer'>
            <div className='top'>
                <a className="footer-logo" href="/"><img src={logo} width={80} height={80} alt="logo" />BoardGameCafe</a>
                <p>{t('footer.Created by Varia Students')}</p>
                <div className='social-links'>
                    <a href='https://discord.gg/wwQGdKVrma'>
                        <i className='fa-brands fa-discord'></i>
                    </a>
                    <a href='https://www.facebook.com/CafeBoardgameHelsinki'>
                        <i className='fa-brands fa-facebook-f'></i>
                    </a>
                    <a href='https://www.instagram.com/cafeboardgamehki/'>
                        <i className='fa-brands fa-instagram'></i>
                    </a>
                    <a href='https://youtu.be/h6R1rXko73c?si=dq0aTHtJ5yvjcpUg'>
                        <i className='fa-brands fa-youtube'></i>
                    </a>
                    <a href='https://www.tiktok.com/@cafeboardgame?_t=8gVHgyYj0C1&_r=1'>
                        <i className='fa-brands fa-tiktok'></i>
                    </a>
                </div>
            </div>

            <div className='bottom'>
                <div>
					<h4>{t('footer.About')}</h4> //Change to Links
                    <a href='/'>{t('footer.About Us')}</a>
                    <a href='/'>{t('footer.Careers')}</a>
                    <a href='/'>{t('footer.Partners')}</a>
                    <a href='/'>{t('footer.Privacy Policy')}</a>
                </div>
                <div>
                    <h4>Opening Hours</h4>
                    <ul className="text-md leading-loose">
                        <li>Monday - Thursday 16:00 - 24:00 </li>
                        <li>Friday 16:00 - 02:00</li>
                        <li>Saturday 14:00 - 02:00 </li>
                        <li>Sunday Closed</li>
                    </ul>
                </div>

                <div>
					<h4>{t('footer.Contact')}</h4> //Contact us
                    <ul className="text-md leading-loose">
                        <li>+358 50 566 2613</li>
                        <li>info@cafeboardgame.fi</li>
                        <li>Eerikinkatu 14</li>
                        <li>00100 Helsinki</li>
                    </ul>
                </div>
                <div>
                    <h4>Awards</h4>
                    <div className="awards">
                        <div><img src={Award1} height={50} alt="Award1" /></div>
                        <div><img src={Award2} height={50} alt="Award2" /></div>
                    </div>

                </div>
            </div>
        </div>
    );
}


{/* <div className='bottom'>
<div>
  <h4>{t('footer.Contact')}</h4>
  <a href='/'>{t('footer.Call us')}</a>
  <a href='/'>{t('footer.Email us')}</a>
  <a href='/'>{t('footer.Careers')}</a>
</div>
<div>
  <h4>{t('footer.About')}</h4>
  <a href='/'>{t('footer.About Us')}</a>
  <a href='/'>{t('footer.Staff')}</a>
  <a href='/'>{t('footer.Partners')}</a>
</div>
<div>
  <h4>{t('footer.Others')}</h4>
  <a href='/'>{t('footer.Privacy Policy')}</a>
  <a href='/'>{t('footer.License')}</a>
  <a href='/'>{t('footer.Terms of Service')}</a>
</div> */}
