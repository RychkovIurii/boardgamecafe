import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../src/assets/logo.png";
import axios from 'axios';
import './Style/FooterStyles.css';
import Award1 from "../src/assets/icons/Award1.png";
import Award2 from "../src/assets/icons/Award2.png";
import footerBg from '../src/assets/elements/footer-background.png';
import { colors } from '../components/Style/Colors';

export default function Footer() {
    const { t } = useTranslation();
	const [workingHours, setWorkingHours] = useState([]);
	useEffect(() => {
		const fetchWorkingHours = async () => {
		  const ONE_DAY = 24 * 60 * 60 * 1000;
		  const cache = localStorage.getItem('workingHours');
		  const timestamp = localStorage.getItem('workingHours_timestamp');
	
		  const now = Date.now();
		  if (cache && timestamp && now - parseInt(timestamp) < ONE_DAY) {
			try {
			  const parsed = JSON.parse(cache);
			  if (Array.isArray(parsed)) {
				setWorkingHours(parsed);
				return;
			  }
			} catch (e) {
			  console.warn("Invalid cache, refetching...");
			}
		  }
	
		  try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/hours`);
			const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
			const sorted = res.data.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
	
			setWorkingHours(sorted);
			localStorage.setItem('workingHours', JSON.stringify(sorted));
			localStorage.setItem('workingHours_timestamp', now.toString());
		  } catch (err) {
			console.error("Failed to fetch working hours", err);
		  }
		};
	
		fetchWorkingHours();
	  }, []);
	
	  const renderGroupedHours = () => {
		const groupByTime = (hours) => {
		  const result = [];
		  let group = [];
		  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		  const sorted = [...hours].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
	
		  for (let i = 0; i < sorted.length; i++) {
			const current = sorted[i];
			const prev = group[group.length - 1];
	
			const timeStr = `${current.openTime || ''}-${current.closeTime || ''}`;
			const prevStr = prev ? `${prev.openTime || ''}-${prev.closeTime || ''}` : null;
	
			if (!prev || timeStr === prevStr) {
			  group.push(current);
			} else {
			  result.push(group);
			  group = [current];
			}
		  }
		  if (group.length > 0) result.push(group);
		  return result;
		};
	
		const grouped = groupByTime(workingHours);
	
		const formatDayRange = (group) => {
		  const dayName = (d) => t(`footer.${d}`);
		  if (group.length === 1) return dayName(group[0].day);
		  return `${dayName(group[0].day)} - ${dayName(group[group.length - 1].day)}`;
		};
	
		return grouped.map((group, i) => {
		  const { openTime, closeTime } = group[0];
		  const closed = !openTime || !closeTime;
		  return (
			<li key={i} style={{ color: colors.color.footerTextColor }}>
			  {formatDayRange(group)} {closed ? t("footer.Closed") : `${openTime} - ${closeTime}`}
			</li>
		  );
		});
	  };
    return (
        <div className='footerImg'>
            <div className='footerBg' style={{ backgroundImage: `url(${footerBg})` }}>
                <div className='footer'>
                    <div className='top'>
                        <Link className="footer-logo" to="/"><img src={logo} width={80} height={80} alt="logo" /></Link>
                        <p style={{ color: colors.color.footerTextColor }}>{t('footer.Created by Varia Students')}</p>
                        <div className='social-links'>
                            <a href='https://discord.gg/wwQGdKVrma'>
                                <i className='fa-brands fa-discord'style={{ color: colors.color.footerSocialmedia }}></i>
                            </a>
                            <a href='https://www.facebook.com/CafeBoardgameHelsinki'>
                                <i className='fa-brands fa-facebook-f'style={{ color: colors.color.footerSocialmedia }}></i>
                            </a>
                            <a href='https://www.instagram.com/cafeboardgamehki/'>
                                <i className='fa-brands fa-instagram'style={{ color: colors.color.footerSocialmedia }}></i>
                            </a>
                            <a href='https://youtu.be/h6R1rXko73c?si=dq0aTHtJ5yvjcpUg'>
                                <i className='fa-brands fa-youtube'style={{ color: colors.color.footerSocialmedia }}></i>
                            </a>
                            <a href='https://www.tiktok.com/@cafeboardgame?_t=8gVHgyYj0C1&_r=1'>
                                <i className='fa-brands fa-tiktok'style={{ color: colors.color.footerSocialmedia }}></i>
                            </a>
                        </div>
                    </div>
                    <div className='bottom'>
                        <div>
                            <h4 style={{ color: colors.color.footerTextColor }}>{t('footer.About')}</h4> 
                            <ul className="text-md leading-loose" >
                                <li ><Link to='/contact'style={{ color: colors.color.footerTextColor }}>{t('footer.Contact')}</Link></li>
                                <li ><Link to='/service'style={{ color: colors.color.footerTextColor }}>{t('footer.Services')}</Link></li>
								<li ><Link to='/faq'style={{ color: colors.color.footerTextColor }}>{t('footer.How it works')}</Link></li>
                                <li ><Link to='/privacy-policy'style={{ color: colors.color.footerTextColor }}>{t('footer.Privacy Policy')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: colors.color.footerTextColor }}>{t('footer.Opening hours')}</h4>
                            <ul className="text-md leading-loose">
								{renderGroupedHours()}
							</ul>
                        </div>
                        <div>
                            <h4 style={{ color: colors.color.footerTextColor }}>{t('footer.Contact')}</h4> 
                            <ul className="text-md leading-loose">
                                <li style={{ color: colors.color.footerTextColor }}>+358 50 566 2613</li>
                                <li style={{ color: colors.color.footerTextColor }}>info@cafeboardgame.fi</li>
                                <li style={{ color: colors.color.footerTextColor }}>Eerikinkatu 14</li>
                                <li style={{ color: colors.color.footerTextColor }}>00100 Helsinki</li>
                            </ul>
                        </div>
                        <div className="awards-container">
                            <h4 style={{ color: colors.color.footerTextColor }}>{t('footer.awards')}</h4>
                            <div className="awards" style={{ color: colors.color.footerTextColor }}>
                                <div><img src={Award1} height={50} alt="Award1" /></div>
                                <br></br>
                                <div><img src={Award2} height={50} alt="Award2" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
