import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 mt-10 mb-16 rounded-xl shadow-md text-gray-800 font-roboto">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-6 pt-3 pb-3">{t(`privacyPolicy.title`)}</h1>
        <h2 className="text-xl md:text-2xl font-medium text-center mb-4">{t(`privacyPolicy.statement`)}</h2>
        <p className="mb-6 text-left">{t(`privacyPolicy.statementP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.controller`)}</h3>
        <p className="text-left font-medium">{t(`privacyPolicy.company`)}</p>
        <p className="text-left mb-4">
          {t(`privacyPolicy.contact_info`)}<br />
          Eerikinkatu 14<br />
          00100 Helsinki
        </p>
        <p className="text-left mb-6">
          {t(`privacyPolicy.inquiries`)}<br />
          Petri Grönholm<br />
          Eerikinkatu 14<br />
          00100 Helsinki<br />
          +358505662613<br />
          info@cafeboardgame.fi
        </p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.dataSubjects`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.dataSubjectsDesc`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.purpose`)}</h3>
        {t(`privacyPolicy.purposes`, { returnObjects: true }).map((item, idx) => (
          <p className="text-left mb-2" key={idx}>{item}</p>
        ))}

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.recordedData`)}</h3>
        <p className="text-left mb-2">{t(`privacyPolicy.recordedDataP`)}</p>
        {t(`privacyPolicy.dataList`, { returnObjects: true }).map((item, idx) => (
          <p className="text-left mb-2" key={idx}>{item}</p>
        ))}

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.rights`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.rightsP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.sources`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.sourcesP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.disclosure`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.disclosureP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.duration`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.durationP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.processors`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.processorsP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.transfer`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.transferP`)}</p>

        <h3 className="text-left text-2xl font-semibold mt-8 mb-2">{t(`privacyPolicy.decisionMaking`)}</h3>
        <p className="text-left mb-6">{t(`privacyPolicy.decisionMakingP`)}</p>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
