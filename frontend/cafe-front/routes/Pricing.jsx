import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import HeroJina from '../components/HeroJina';
import Footer from '../components/Footer';
import MenuIcon from '../components/MenuIcon';
import MenuAccordions from '../components/MenuAccordions';



const Pricing = () => {

    const [activeId, setActiveId] = useState(null)

    return (
        <div>
            <Navbar />
            <HeroJina />

            <div>
                <MenuIcon activeId={activeId} setActiveId={setActiveId} />
                <MenuAccordions activeId={activeId} setActiveId={setActiveId} />
            </div>

            <Footer />
        </div>
    )
}

export default Pricing
