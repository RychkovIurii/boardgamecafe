import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "./Style/HeroStyles.css";
import { colors } from '../components/Style/Colors';
//import { fonts } from '../components/Style/Fonts';

function Hero(props) {
  const { t } = useTranslation();
  const { cName, heroImage, title, text, url, linkClass, linkText } = props;

  return (
    <div className={cName}>
      <img className="imgClass" alt="HeroImg" src={heroImage} />
      {(title || text || linkText) && (
        <div className="hero-text" style={{ color: colors.color.fontHeroTitle }}>
          {title && <h1>{t(`hero.${title}`)}</h1>}
          {text && (
            <div className="hero-text-content" style={{ color: colors.color.fontHeroSubTitle}}>
              {typeof text === 'string' ? t(`hero.${text}`) : text}
            </div>
          )}
          <div className='p-5'>   {linkText && url && (
            <Link to={url} className={linkClass}>
              {t(`hero.${linkText}`)}
            </Link>
          )}</div>

        </div>
      )}
    </div>
  );
}

export default Hero;
