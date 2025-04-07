import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../components/Style/ContactStyles.css";
import contactImage from '../src/assets/elements/contact.png';
import { colors } from '../components/Style/Colors';
import Swal from 'sweetalert2';
import API from '../api/axios'




function Contact() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/contact/send-email', formData); // Your backend endpoint
            console.log(response.data)
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your message has been sent successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setFormData({ firstName: '', lastName: '', email: '', message: '' }); // Clear the form after success
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error sending your message. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <>
            <Navbar />

            <div className='contactHeader'>

                <div className="contact-container" style={{ backgroundColor: colors.color.background }}>
                    <div className="contact-card">
                        <img src={contactImage} className="contact-image" alt="Contact" />
                        <div className="contact-info">
                            <h1>{t(`contact.heroTitle`)}</h1>
                            <h2>{t(`contact.heroText`)}</h2>
                            <p>📞 +358 50 566 2613</p>
                            <p>📧 info@cafeboardgame.fi</p>
                            <p>📍 Eerikinkatu 14, 00100 Helsinki</p>
                        </div>
                    </div>

                    <div>
                        {/*contact form*/}
                        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                    {t(`contact.formTitle`)}
                                </h2>
                                <p className="mt-2 text-lg text-gray-600">
                                    {t(`contact.formText`)}
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                                            {t(`contact.firstnameLable`)}
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="first-name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                                            {t(`contact.lastnameLable`)}
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="last-name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            autoComplete="family-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                                            {t(`contact.emailLable`)}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                                            {t(`contact.messageLable`)}
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: "#8b5a2b",
                                            color: "white",
                                            padding: "0.75rem",
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            borderRadius: "0.375rem",
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "background 0.3s ease",
                                        }}
                                        className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs"
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#6b4226")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#8b5a2b")}
                                    >
                                        {t(`contact.sendmessageLable`)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>



                    {/* Google map*/}
                    <div className="map-container">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.8433087346455!2d24.9340427453176!3d60.16677280917141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcb17ddbd81%3A0x67a94b090b3b0efa!2sEerikinkatu%2014%2C%2000100%20Helsinki!5e0!3m2!1sen!2sfi!4v1739120944592!5m2!1sen!2sfi"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}


export default Contact;
