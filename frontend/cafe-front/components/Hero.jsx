import React from 'react';
import { useTranslation } from 'react-i18next';
import "./Style/HeroStyles.css";

function Hero(props) {
  const { t } = useTranslation();
  const { cName, heroImage, title, text, url, linkClass, linkText } = props;

  return (
    <div className={cName}>
      <img className="imgClass" alt="HeroImg" src={heroImage} />
      {(title || text || linkText) && (
        <div className="hero-text">
          {title && <h1>{t(`hero.${title}`)}</h1>}
          {text && (
            <div className="hero-text-content">
              {typeof text === 'string' ? t(`hero.${text}`) : text}
            </div>
          )}
          {linkText && url && (
            <a href={url} className={linkClass}>
              {t(`hero.${linkText}`)}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default Hero;
