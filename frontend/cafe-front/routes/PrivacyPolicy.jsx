import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../components/Style/PrivacyPolicyStyle.css";
import { colors } from '../components/Style/Colors';

function PrivacyPolicy() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar />
    <div className="container">
      <h1 style={{ color: colors.color.fontYellow }}>{t(`privacyPolicy.title`)}</h1>
      <h2 style={{ color: colors.color.fontTitle }}>{t(`privacyPolicy.statement`)}</h2>
      <p style={{ color: colors.color.fontParaghraph}}>
      {t(`privacyPolicy.statementP`)}
      </p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.controller`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}><strong>{t(`privacyPolicy.company`)}</strong></p>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.contact_info`)}<br />Eerikinkatu 14<br /> 00100 Helsinki</p>
      <p style={{ color: colors.color.fontParaghraph}}>{t(`privacyPolicy.inquiries`)}<br />Petri Grönholm<br />Eerikinkatu 14<br /> 00100 Helsinki<br />+358505662613<br />info@cafeboardgame.fi</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.dataSubjects`)}</h3>
      <p style={{ color: colors.color.fontParaghraph}}>{t(`privacyPolicy.dataSubjectsDesc`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.purpose`)}</h3>
      <p style={{ color: colors.color.fontParaghraph}}>
      {t(`privacyPolicy.purposes`)}
      </p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.recordedData`)}</h3>
      <p style={{ color: colors.color.fontParaghraph}}>{t(`privacyPolicy.recordedDataP`)}</p>
      <p style={{ color: colors.color.fontParaghraph}}>
      {t(`privacyPolicy.dataList`)}
      </p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.rights`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.rightsP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.sources`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.sourcesP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.disclosure`)}</h3>
      <p style={{ color: colors.color.fontParaghraph}}>{t(`privacyPolicy.disclosureP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.duration`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.durationP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.processors`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.processorsP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.transfer`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.transferP`)}</p>

      <h3 style={{ color: colors.color.fontBlack }}>{t(`privacyPolicy.decisionMaking`)}</h3>
      <p style={{ color: colors.color.fontParaghraph }}>{t(`privacyPolicy.decisionMakingP`)}</p>
    </div>
  

            <Footer />
        </>
    );
}

export default PrivacyPolicy;