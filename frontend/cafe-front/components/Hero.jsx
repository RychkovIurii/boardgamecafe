import React from 'react';
import { useTranslation } from 'react-i18next';
import "./Style/HeroStyles.css";

function Hero(props) {
  const { t } = useTranslation();

  return (
    <div className={props.cName}>
      <img className="imgClass" alt="HeroImg" src={props.heroImage} />

      <div className="hero-text">
        <h1>{t(`hero.${props.title}`)}</h1>
        <p>{typeof props.text === 'string' ? t(`hero.${props.text}`) : props.text}</p>
        <a href={props.url} className={props.linkClass}>
          {t(`hero.${props.linkText}`)}
        </a>
      </div>
    </div>
  );
}

export default Hero;
