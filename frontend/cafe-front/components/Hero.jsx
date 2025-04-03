import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "./Style/HeroStyles.css";

function Hero(props) {
  const { t } = useTranslation();
  const { cName, heroImage, title, text, url, linkClass, linkText } = props;

  return (
    <div className={cName}>
      <img className="imgClass" alt="HeroImg" src={heroImage} />
      {(title || text || linkText) && (
        <div className="hero-text">
          {title && <h1 className="text-outline">{t(`hero.${title}`)}</h1>}
          {text && (
            <div className="hero-text-content ">
              <p className='text-2xl inline-block bg-gray-500 bg-opacity-50 p-1'>{typeof text === 'string' ? t(`hero.${text}`) : text}</p>
            </div>
          )}
          {linkText && url && (
            <Link to={url} className={linkClass}>
              {t(`hero.${linkText}`)}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Hero;
