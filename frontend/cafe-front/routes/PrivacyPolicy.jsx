import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../components/Style/PrivacyPolicyStyle.css";

function PrivacyPolicy() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar />
            <div className="container">
      <h1>{t(`privacyPolicy.title`)}</h1>
      <h2>{t(`privacyPolicy.statement`)}</h2>
      <p>
      {t(`privacyPolicy.statementP`)}
      </p>

      <h3>{t(`privacyPolicy.controller`)}</h3>
      <p><strong>{t(`privacyPolicy.company`)}</strong></p>
      <p>{t(`privacyPolicy.contact_info`)}<br />Eerikinkatu 14<br /> 00100 Helsinki</p>
      <p>{t(`privacyPolicy.inquiries`)}<br />Petri Grönholm<br />Eerikinkatu 14<br /> 00100 Helsinki<br />+358505662613<br />info@cafeboardgame.fi</p>

      <h3>{t(`privacyPolicy.dataSubjects`)}</h3>
      <p>{t(`privacyPolicy.dataSubjectsDesc`)}</p>

      <h3>{t(`privacyPolicy.purpose`)}</h3>
      <p>
      {t(`privacyPolicy.purposes`)}
      </p>

      <h3>{t(`privacyPolicy.recordedData`)}</h3>
      <p>{t(`privacyPolicy.recordedDataP`)}</p>
      <p>
      {t(`privacyPolicy.dataList`)}
      </p>

      <h3>{t(`privacyPolicy.rights`)}</h3>
      <p>{t(`privacyPolicy.rightsP`)}</p>

      <h3>{t(`privacyPolicy.sources`)}</h3>
      <p>{t(`privacyPolicy.sourcesP`)}</p>

      <h3>{t(`privacyPolicy.disclosure`)}</h3>
      <p>{t(`privacyPolicy.disclosureP`)}</p>

      <h3>{t(`privacyPolicy.duration`)}</h3>
      <p>{t(`privacyPolicy.durationP`)}</p>

      <h3>{t(`privacyPolicy.processors`)}</h3>
      <p>{t(`privacyPolicy.processorsP`)}</p>

      <h3>{t(`privacyPolicy.transfer`)}</h3>
      <p>{t(`privacyPolicy.transferP`)}</p>

      <h3>{t(`privacyPolicy.decisionMaking`)}</h3>
      <p>{t(`privacyPolicy.decisionMakingP`)}</p>
    </div>
  

            <Footer />
        </>
    );
}

export default PrivacyPolicy;