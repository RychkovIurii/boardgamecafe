import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Style/BookingFormStyles.css';
import Swal from 'sweetalert2';
import API from '../api/axios';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  StepContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import floorplan from '../src/assets/elements/floorplan.png';

const regex = new RegExp(/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/)
const nameRegex = new RegExp(/^[\p{Letter}\s\-.']+$/u)
const duraOpt = ["60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360", "390", "420", "450", "480", "510", "540", "570", "600"]

/**
 StepOne, StepTwo, and StepThree are separated for clarity.
 You can define them inline, in separate files, or as your project needs.*/
function StepOne({ inputs, handleChange, handleTimeChange }) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(dayjs('2022-04-17T16:00'));

  return (
    <>
      {/* <Box sx={{ fontFamily: "Fontdiner Swanky" }}> */}
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        {t(`bookingForm.step1`)}
      </Typography>
      <div className='formItem'>
        <label>{t(`bookingForm.step1Name`)}</label>
        <input
          className='formInput'
          type='text'
          name="contactName"
          value={inputs.contactName || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>{t(`bookingForm.step1Phone`)}</label>
        <input
          className='formInput'
          type='tel'
          name="contactPhone"
          value={inputs.contactPhone || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>{t(`bookingForm.step1People`)} </label>
        <input
          className='formInput'
          name='players'
          value={inputs.players || ""}
          onChange={(e) => { handleChange(e) }
          
        }
          placeholder={t(`bookingForm.step1Number`)}
          required
        />
      </div>
      {t(`bookingForm.step1Text`)}
      <div className='formItem'>
        <label>{t(`bookingForm.step1Date`)} </label>
        <input
          className='formInput'
          type='date'
          min={new Date().toJSON().slice(0, 10)}
          name="date"
          value={inputs.date || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className='formItem'>
        <label>{t(`bookingForm.step1Time`)} </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            name="startTime"
            timeSteps={{ minutes: 30 }}
            minutesStep={30}
            value={inputs.startTime}
            onChange={handleTimeChange}
            ampm={false}
            required
          />
        </LocalizationProvider>
      </div>

      <div className='formItem'>
        <label>{t(`bookingForm.step1Duration`)} </label>
        <input
          className='formInput'
          type='number'
          name='duration'
          value={inputs.duration || ""}
          onChange={handleChange}
          min="60"
          step={30}
          max="600"
          placeholder={t(`bookingForm.step1DurationI`)}
          required
        />

      </div>
      {/* </Box> */}
    </>
  );
}

function StepTwo({ inputs, handleChange, tables, setInputs }) {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        {t(`bookingForm.step2`)}
      </Typography>
      <div className='smallerText'>
        {t(`bookingForm.step2Text`)}
      </div>
      <label>{t(`bookingForm.step2Table`)} </label>
      <input
        className='formInput'
        type='number'
        min={1}
        max={50}
        name='tableNumber'
        value={inputs.tableNumber || ""}
        placeholder={t(`bookingForm.step2TableNum`)}
        onChange={handleChange}
        required
      />
      <div className='tables'>{t(`bookingForm.step2Suggested`)}
        {tables.map((table) => <div key={table.number} className='table' onClick={(e) => { setInputs({ ...inputs, tableNumber: table.number }); }}> {table.number}</div>)}
      </div>
      <label>{t(`bookingForm.step2Game`)} </label>
      <input
        className='formInput'
        type='text'
        name="game"
        value={inputs.game || ""}
        onChange={handleChange}
      />
      {/* <label>Other:</label>
      <textarea className='formInput'
        name='other_rez'
        value={inputs.other_rez || ""}
        onChange={handleChange}
        placeholder="if you need an additional chair, it's a birthday, or you have other notes, please put them in this field."
      >
      </textarea> */}
    </Box>
  );
}

function StepThree({ inputs, handleChange, handleSubmit }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ fontFamily: "Fontdiner Swanky" }}>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="h6" gutterBottom>
        {t(`bookingForm.step3`)}
      </Typography>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="body1" gutterBottom>
        {t(`bookingForm.step3Submit`)}
      </Typography>
    </Box>
  );
}



export default function BookingForm() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState();
  const [bookingId, setBookingId] = useState(null);
  const [filteredTables, setFilteredTables] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    date: "",
    startTime: dayjs('2022-04-17T16:00'),
    duration: "",
    tableNumber: "",
    players: "",
    game: "",
    userId: "",
    contactName: "",
    contactPhone: ""
  });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await API.get('/tables');
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setInputs(prev => ({
        ...prev,
        contactName: prev.contactName || user.name || '',
        contactPhone: prev.contactPhone || user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  function checkAvailability(people) {
    if (people < 1) {
      const message = t(`bookingForm.availabilityPeople`);
      return message;
    }

    const seatCapacities = [2, 4, 5, 6, 8, 10]; // ✅ Define allowed seat counts
    const seatLimit = seatCapacities.find(capacity => people <= capacity); // ✅ Find the smallest matching capacity

    if (!seatLimit) {
      const message1 = t(`bookingForm.availabilityText`)
      return message1;
    }

    // ✅ Filter tables that match the found `seatLimit`
    const filtered = tables.filter(table => table.capacity === seatLimit);
    setFilteredTables(filtered);
  }

  // Define the labels for each step.
  const steps = [
    t('bookingForm.stepLabel1'),
    t('bookingForm.stepLabel2'),
    t('bookingForm.stepLabel3')
  ];

  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      // Step 1 validation
      const { contactName, contactPhone, players, date, startTime, duration } = inputs;
      console.log(inputs);

      if (!contactName || !contactPhone || !players || !date || !startTime || !duration) {
        Swal.fire({
          icon: 'warning',
          title: t('alerts.incompleteTitle'),
          text: t('alerts.incompleteText'),
        });
        return;
      }

      if (!nameRegex.test(contactName)){
        Swal.fire({
            icon: 'warning',
            title: "Invalid name",
            text: "Names may not include numbers",
          });
          return;
        }

      if (!regex.test(contactPhone)){
        Swal.fire({
            icon: 'warning',
            title: "Invalid phone number",
            text: "please enter a valid phone number",
          });
          return;
        }
      
      if (isNaN(players) || players < 1 || players > 10){
        Swal.fire({
          icon: 'warning',
          title: "Invalid players input",
          text: "players must be a number and between 1 to 10",
        });
        return;
      }
      
      if (isNaN(duration) || !duraOpt.includes(duration)){
        Swal.fire({
            icon: 'warning',
            title: "Invalid duration",
            text: "Duration must be at least 60 minutes, at most 600 minutes and in increments of 30 minutes.",
          });
          return;
        }
    }

    if (activeStep === 1) {
      // Step 2 validation
      if (!inputs.tableNumber) {
        Swal.fire({
          icon: 'warning',
          title: t('alerts.tableTitle'),
          text: t('alerts.tableText'),
        });
        return;
      }
    }

    // Everything is valid
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    checkAvailability(inputs.players);
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTimeChange = (value) => {
    setInputs({ ...inputs, startTime: value });
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const startTimeString = inputs.startTime.format('HH:mm');

    // Validates duration and players
    const parsedPlayers = parseInt(inputs.players, 10);

    /* if (!validateDuration(inputs.duration)) {
      setError("Duration must be at least 60 minutes and a multiple of 30 (e.g., 60, 90, 120).");
      setLoading(false);
      return;
    } */
    if (isNaN(parsedPlayers) || parsedPlayers < 1) {
      setError("Players must be at least 1.");
      setLoading(false);
      return;
    }

    const bookingData = {
      date: inputs.date,
      startTime: startTimeString,
      duration: inputs.duration,
      tableNumber: inputs.tableNumber,
      players: parsedPlayers,
      game: inputs.game || null,
      userId: isAuthenticated && user ? user._id : null,
      contactName: inputs.contactName,
      contactPhone: inputs.contactPhone,
      // id: window.crypto.randomUUID()
    }

    try {
      const response = await API.post('/bookings', bookingData);
      setSuccess(true);
      const createdBookingId = response.data._id;
      setBookingId(createdBookingId);
      setInputs({
        date: "",
        startTime: "",
        duration: "",
        tableNumber: "",
        players: "",
        game: "",
        userId: "",
        contactName: "",
        contactPhone: ""
      });
      Swal.fire({
        icon: 'success',
        title: t('alerts.bookingSuccessTitle'),
        text: t('alerts.bookingSuccessText'),
        showDenyButton: true,
        confirmButtonText: t('alerts.goHome'),
        denyButtonText: t('alerts.payNow'),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        } else if (result.isDenied && createdBookingId) {
          navigate(`/checkout?bookingId=${createdBookingId}`);
        }
      });
    }
    catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating booking";

      await Swal.fire({
        icon: 'error',
        title: t('alerts.bookingErrorTitle'),
        text: errorMessage,
        confirmButtonText: 'OK'
      });

      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

  // Renders the content for each step
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepOne inputs={inputs} handleChange={handleChange} handleTimeChange={handleTimeChange}/>;
      case 1:
        return <StepTwo inputs={inputs} handleChange={handleChange} tables={filteredTables} setInputs={setInputs} />;
      case 2:
        return <StepThree inputs={inputs} handleChange={handleChange} handleSubmit={handleSubmit} />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <>
      <div className='backgroundBooking'>
        <img className="floorplann" src={floorplan} alt="floorplan" />
        <div className='stepperStyle'>

          <Box className='stepperStyle2' sx={{ width: '100%', maxWidth: '700px', margin: '0 auto', fontFamily: "Fontdiner Swanky", px: 2 }} >
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Booking created successfully!</p>}
            <Stepper activeStep={activeStep} orientation='vertical' sx={{ fontFamily: "Fontdiner Swanky" }}>
              {steps.map((label, index) => (
                <Step key={index} sx={{ fontFamily: "Fontdiner Swanky" }}>
                  <StepLabel sx={{ fontFamily: "Fontdiner Swanky" }} >{label}</StepLabel>
                  <StepContent sx={{ fontFamily: "Fontdiner Swanky" }} >
                    {renderStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontFamily: "Fontdiner Swanky" }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="contained"
                      >
                        {t('bookingForm.back')}
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button onClick={handleSubmit} variant="contained" color="primary" >
                          {t('bookingForm.submit')}
                        </Button>
                      ) : (
                        <Button onClick={handleNext} variant="contained" color="primary" >
                          {t('bookingForm.next')}
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

          </Box>
        </div>
      </div>
    </>
  );
}

