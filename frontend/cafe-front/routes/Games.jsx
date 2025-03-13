import React, { useState } from 'react';
import heroImage from '../assets/gamesHero.png';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import GameCard from '../components/GameCard';
import '../components/Style/GameCardStyles.css'
import Paginate from '../components/Pagination';


function Games() {
    const [gamesInfo, setGamesInfo] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const gamesPerPage = 30

    const indexOfLastGame = currentPage *gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;

    const currentGames = gamesInfo.slice(indexOfFirstGame, indexOfLastGame)

    useEffect(() => {
        fetch("https://boardgamegeek.com/xmlapi2/collection?username=Cafebg")
            .then((response) => response.text())
            .then((xmlString) => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlString, "text/xml");
                const items = xml.getElementsByTagName("item");
                const itemArray = Array.from(items).map((itemNode) => {
                    const objectId = itemNode.getAttribute("objectid");

                    const name = itemNode.querySelector("name");
                    const image = itemNode.querySelector("image");
                    const thumb = itemNode.querySelector("thumbnail");
                    const year = itemNode.querySelector("yearpublished");

                    return {
                        id: objectId,
                        title: name ? name.textContent : "",
                        image: image ? image.textContent.trim() : "",
                        thumbnail: thumb ? thumb.textContent.trim() : "",
                        year: year ? year.textContent : ""
                    };
                });
                setGamesInfo(itemArray);

            })
    }, [paginate]);

    return (
        <>
            <Navbar />
            <Hero
                cName="hero"
                heroImage={heroImage}
                title="Our Game Collection"
                text="Enjoy the best board games with us."
                linkText="Book Now"
                linkClass="show"
                url="/bookings"
            />
            <h1>The Collection of Games in Cafe Boardgame:</h1>

            <div className='gameGen'>
                {currentGames.map((gamesInfo, id) =>
                    <GameCard key={id} gamesInfo={gamesInfo} />
                )}
            </div>
            <div className='pagination'>
            <Paginate gamesPerPage={gamesPerPage} totalGames={gamesInfo.length} paginate={paginate} />
            </div>
            <Footer />
        </>
    );
}

export default Games;
