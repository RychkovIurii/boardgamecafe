import React from 'react';
import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import '../components/Style/EventCard.css';
import { useTranslation } from 'react-i18next';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function EventsCard(props) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { t } = useTranslation();

    return (
        <div className='cardBG'>
            <div className='cardContent'>
                <h1>{props.eventTitle}</h1>
                <img className='eventImg' src={props.image}></img>
                {/* <CountdownTimer targetDate={props.eventDate}/> */}
                <div className="eventDate">
                    {props.eventDate}
                    </div>
                <div className='descr'>
                    {props.eventDescription}
                </div>
                <div className='button'>
                    <button className='LearnMore' type='button' title='Learn more' onClick={handleOpen}>{t('hero.Learn More')}</button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {props.eventTitle}
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                                {props.eventDescription}
                            </Typography>
                        </Box>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
