import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../components/Style/ContactStyles.css";




function Contact() {
  

    return (
        <>
            <Navbar />
            
            <div className='contactHeader'> 
             
              <div className="contact-container">
      <div className="contact-card">
        <img
          src="/assets/contact.png" 
         
          className="contact-image"
        />
        <div className="contact-info">
          <h1>Get in Touch!</h1>
          <h2>Have a question or just want to say hi? Feel free to reach out we’d love to hear from you!</h2>
          <p>📞 +358 50 566 2613</p>
          <p>📧 info@boardgamecafe.fi</p>
          <p>📍 Eerikinkatu 14, 00100 Helsinki</p>
        </div>
      </div>
      <div>
         {/*contact form*/}
         
         
          
         <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Contact Us
                            </h2>
                            <p className="mt-2 text-lg text-gray-600">
                                Have any questions? Fill out the form below and we'll get back to you.
                            </p>
                        </div>
                        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
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
        Send Message
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
