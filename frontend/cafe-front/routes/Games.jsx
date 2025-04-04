import React, { useState } from 'react';
import heroImage from '../src/assets/hero/gamesHero.png';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import GameCard from '../components/GameCard';
import '../components/Style/GameCardStyles.css'
import Paginate from '../components/Pagination';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';


function Games() {
    const [gamesInfo, setGamesInfo] = useState([])
    const [filteredGames, setFilteredGames] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchFilter, setSearchFilter] = useState("");
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const gamesPerPage = 30

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;

    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame)

    useEffect(() => {
		const fetchGames = async () => {
			try {
				const response = await fetch("https://boardgamegeek.com/xmlapi2/collection?username=Cafebg");
				const xmlString = await response.text();
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
				setFilteredGames(itemArray);
			} catch (error) {
				console.error("Failed to load games", error);
			} finally {
				setLoading(false);
			}
		};
	
		fetchGames();
	}, []);

    const FilterGames = (e) => {
        const filtered =
            gamesInfo &&
            gamesInfo.filter((item) => {
            return item.title.toLowerCase().includes(e.toLowerCase());
          });
          setFilteredGames(filtered);
      };

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
				<CircularProgress size="4rem" thickness={5} color="inherit"/>
			</div>
		);
	}
    return (
        <>
            <Navbar />
            <Hero
                cName="hero"
                heroImage={heroImage}
                title={t("Our Game Collection", { keySeparator: false })}
				text={t("Enjoy the best board games with us.", { keySeparator: false })}
				linkText={t("Book Now", { keySeparator: false })}
                linkClass="show"
                url="/bookings"
            />
            <h1 style={{ margin: '30px' }}>{t("gamesPage.collectionHeader")}</h1>

            <input
            className='searchbar'
            type="search"
            placeholder={t("gamesPage.searchPlaceholder")}
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              FilterGames(e.target.value);
            }}/>

            <div className='gameGen'>
                {currentGames.map((gamesInfo, id) =>
                    <GameCard key={id} gamesInfo={gamesInfo} />
                )}
            </div>
            <div className='pagination'>
                <Paginate gamesPerPage={gamesPerPage} totalGames={filteredGames.length} paginate={paginate} />
            </div>
            <Footer />
        </>
    );
}

export default Games;
