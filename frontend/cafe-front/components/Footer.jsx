import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from "../assets/logo3.png";
import './Style/FooterStyles.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className='footer'>
      <div className='top'>
        <a className="footer-logo" href="/"><img src={logo} width={80} height={80} alt="logo"/>BoardGameCafe</a>
        <p>{t('footer.Created by Varia Students')}</p>
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
        </div>
      </div>
    </div>
  );
}
