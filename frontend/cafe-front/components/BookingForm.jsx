import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Style/BookingFormStyles.css';
import Swal from '../utils/swalWithFont';
import API from '../api/axios';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  StepContent,
  FormHelperText,
  Slider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { isValidPhoneNumber } from 'libphonenumber-js';
import floorplan from '../src/assets/elements/floorplan.png';
import { colors } from '../components/Style/Colors';

const nameRegex = new RegExp(/^[\p{Letter}][\p{Letter}\s\-.']*$/u);
const duraOpt = Array.from({ length: (600 - 60) / 30 + 1 }, (_, i) => (60 + i * 30).toString());

dayjs.extend(isSameOrAfter);

/**
 StepOne, StepTwo, and StepThree are separated for clarity.
 You can define them inline, in separate files, or as your project needs.*/
function StepOne({ inputs, handleChange, handleTimeChange, nameError, phoneError, playersError, getHoursForSelectedDate }) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(dayjs('2022-04-17T16:00'));
  const durationError = inputs.duration && !duraOpt.includes(inputs.duration.toString());

  return (
    <>
      {/* <Box sx={{ fontFamily: "Fontdiner Swanky" }}> */}
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        {/* {t(`bookingForm.step1`)} */}
      </Typography>
      <div className='formItem'>
        <label>{t(`bookingForm.step1Name`)}</label>
        <input
          className='formInput'
          placeholder='Ex: Maija Meikäläinen'
          type='text'
          name="contactName"
          value={inputs.contactName || ""}
          maxLength={30}
          onKeyDown={(e) => {
            const allowedKeys = [
              'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
              '-', '.', "'", ' '
            ];
            const isLetter = /^[\p{L}]$/u.test(e.key); // supports letters from all alphabets
            if (!isLetter && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          required
        />
        {nameError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{nameError}</span>}
      </div>
      <div className='formItem'>
        <label>{t(`bookingForm.step1Phone`)}</label>
        <input
          className='formInput'
          placeholder='Ex: +358505662613'
          type='tel'
          name="contactPhone"
          value={inputs.contactPhone || ""}
          maxLength={15}
          onKeyDown={(e) => {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            const isDigit = /^[0-9]$/.test(e.key);
            const isPlus = e.key === '+';
            const currentValue = e.currentTarget.value;
            const cursorPos = e.currentTarget.selectionStart;
        
            /* // Block digit as first char (must start with +)
            if (isDigit && currentValue.length === 0) {
              e.preventDefault();
            } */
        
            // Allow only one + at the beginning
            if (isPlus && (cursorPos !== 0 || currentValue.includes('+'))) {
              e.preventDefault();
            }
        
            // Block everything else that's not a number or allowed key
            if (!isDigit && !isPlus && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          required
        />
        {phoneError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{phoneError}</span>}
      </div>
      <div className='formItem'>
        <label>{t(`bookingForm.step1People`)} </label>
        <input
          className='formInput'
          name='players'
          type='number'
          min={1}
          max={10}
          value={inputs.players || ""}
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 2) {
              handleChange(e); // keep logic in sync
            }
          }}
          placeholder={t(`bookingForm.step1Number`)}
          required
        />
        {playersError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{playersError}</span>}
      </div>
      <Typography variant="body2" sx={{ fontFamily: "Fontdiner Swanky", paddingTop: 1 }} gutterBottom>
      {t(`bookingForm.step1Text`)}
        </Typography>
      
      <div className='formItem'>
        <label>{t(`bookingForm.step1Date`)} </label>
        <input
          className='formInput'
          type='date'
          min={new Date().toJSON().slice(0, 10)}
          max={new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().slice(0, 10)}
          name="date"
          value={inputs.date || ""}
          onChange={handleChange}
          required
        />
        {(() => {
            const hours = getHoursForSelectedDate();
            if (!hours) return null;
            if (hours.type === 'closed') {
                return <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '6px', marginBottom: '2px' }}>{t('bookingForm.closedDay')}</div>;
            }
            return (
                <div style={{ fontSize: '0.9rem', marginTop: '6px', marginBottom: '2px', color: '#065f46' }}>
                {hours.type === 'special' ? t('bookingForm.specialHours') : t('bookingForm.workingHours')}:
                <strong> {hours.open} - {hours.close}</strong>
                </div>
            );
            })()}
      </div>

      <div className='formItem'>
        <label>{t(`bookingForm.step1Time`)} </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='formInput'>
            <TimePicker
              name="startTime"
              timeSteps={{ minutes: 30 }}
              minutesStep={30}
              value={inputs.startTime}
              onChange={handleTimeChange}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
              required
            />
          </div>
        </LocalizationProvider>
      </div>

      <div className='formItem'>
        <label>{t(`bookingForm.step1Duration`)} </label>
        <Slider
          name="duration"
          step={30}
          min={60}
          max={600}
          marks
          value={parseInt(inputs.duration) || 60}
          onChange={(e, newVal) =>
            handleChange({ target: { name: 'duration', value: newVal.toString() } })
          }
          valueLabelDisplay="auto"
        />
        <FormHelperText>
          {durationError
            ? t('alerts.durationError')
            : `${t('bookingForm.step1DurationI')} (${inputs.duration || 60} min)`}
        </FormHelperText>

      </div>
      {/* </Box> */}
    </>
  );
}

function StepTwo({ inputs, handleChange, tables, setInputs, tableError, setTableError }) {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        {/* {t(`bookingForm.step2`)} */}
      </Typography>
      <label>{t(`bookingForm.step2Table`)} </label>
      <input
        className='formInput'
        type='number'
        min={1}
        max={50}
        name='tableNumber'
        value={inputs.tableNumber || ""}
        placeholder={t(`bookingForm.step2TableNum`)}
        onKeyDown={(e) => {
            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 2) {
              handleChange(e); // keep logic in sync
            }
          }}
        required
      />
        {tableError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{tableError}</span>}
      <div className='tables'>
        <div className='tablesChild'>
          <div className='lefties'>{t(`bookingForm.step2Suggested`)}</div>
          <div className='suggestedTableTokens'>
          {tables.suggested && tables.suggested.map((table) => (
            <div key={table.number}
              className='table'
              onClick={() => {
                setInputs(prev => ({ ...prev, tableNumber: table.number }));
                setTableError('');
              }}>
              {table.number}
            </div>
          ))}
        </div>
        </div>
        <div className='tablesChild'>
          <div className='lefties'>{t(`bookingForm.step2AlsoAvailable`)}</div>
          <div className='suggestedTableTokens'>
          {tables.alsoAvailable && tables.alsoAvailable.map((table) => (
            <div key={table.number}
              className='table'
              onClick={() => {
                setInputs(prev => ({ ...prev, tableNumber: table.number }));
                setTableError('');
              }}>
              {table.number}
            </div>
          ))}
          </div>
        </div>
      </div>
      <label>{t(`bookingForm.step2Game`)} </label>
      <input
        className='formInput'
        type='text'
        name="game"
        value={inputs.game || ""}
        maxLength={50}
        onChange={handleChange}
      />
      <div className='smallerText'>
        {t(`bookingForm.step2Text`)}
      </div>
    </Box>
  );
}

function StepThree({ inputs, handleChange, handleSubmit }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ fontFamily: "Fontdiner Swanky" }}>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="h6" gutterBottom>
        {/* {t(`bookingForm.step3`)} */}
      </Typography>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="body1" gutterBottom>
        {t(`bookingForm.step3Submit`)}
      </Typography>
    </Box>
  );
}

export default function BookingForm() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [filteredTables, setFilteredTables] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [workingHours, setWorkingHours] = useState([]);
  const [specialHours, setSpecialHours] = useState([]);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [playersError, setPlayersError] = useState('');
  const [tableError, setTableError] = useState('');
  const [inputs, setInputs] = useState({
    date: "",
    startTime: dayjs('2022-04-17T16:00'),
    duration: "60",
    tableNumber: "",
    players: "",
    game: "",
    userId: "",
    contactName: "",
    contactPhone: ""
  });

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const [whRes, shRes] = await Promise.all([
          API.get('/hours'),
          API.get('/specialHours')
        ]);
        setWorkingHours(whRes.data);
        setSpecialHours(shRes.data);
      } catch (err) {
        console.error("Error fetching hours", err);
      }
    };
    fetchHours();
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

  async function checkAvailability(people) {
    if (people < 1) {
      const message = t(`bookingForm.availabilityPeople`);
      return message;
    }

    const seatCapacities = [2, 4, 5, 6, 8, 10]; // ✅ Define allowed seat counts
    const seatLimit = seatCapacities.find(capacity => people <= capacity); // ✅ Find the smallest matching capacity

    if (!seatLimit) {
      Swal.fire({
        icon: 'warning',
        title: t('alerts.capacityError'),
        text: t('bookingForm.availabilityText')
      });
      return;
    }

    const start = dayjs(inputs.startTime);
    const duration = parseInt(inputs.duration, 10);

    try {
      const res = await API.get('/bookings/suggested-tables', {
        params: {
          date: inputs.date,
          startTime: start.format("HH:mm"),
          duration: duration,
        }
      });

      // Split tables into two groups:
      const suggestedTables = res.data
        .filter(table => table.capacity === seatLimit)
        .sort((a, b) => a.capacity - b.capacity);
      const alsoAvailableTables = res.data
        .filter(table => table.capacity > seatLimit)
        .sort((a, b) => a.capacity - b.capacity);
      setFilteredTables({ suggested: suggestedTables, alsoAvailable: alsoAvailableTables });

    } catch (err) {
      console.error('Failed to fetch available tables:', err);
      Swal.fire({
        icon: 'error',
        title: 'Availability check failed',
        text: 'Please try again later.'
      });
    }
  }

  const getHoursForSelectedDate = () => {
    if (!inputs.date) return null;
  
    const selectedDay = dayjs(inputs.date);
    const special = specialHours.find(s => dayjs(s.date).isSame(selectedDay, 'day'));
  
    if (special && special.openTime && special.closeTime) {
      return { type: 'special', open: special.openTime, close: special.closeTime };
    }
  
    const dayName = selectedDay.format('dddd'); // e.g., 'Friday'
    const regular = workingHours.find(w => w.day === dayName);
  
    if (regular && regular.openTime && regular.closeTime) {
      return { type: 'regular', open: regular.openTime, close: regular.closeTime };
    }
  
    return { type: 'closed' };
  };

  const isWithinWorkingHours = () => {
    if (!inputs.date || !inputs.startTime) return false;

    const selectedTime = dayjs(`${inputs.date}T${inputs.startTime.format('HH:mm')}`);

    const special = specialHours.find(s => dayjs(s.date).isSame(dayjs(inputs.date), 'day'));
    let openTime, closeTime;

    if (special) {
      if (!special.openTime || !special.closeTime) return false; // Closed
      openTime = dayjs(`${special.date}T${special.openTime}`);
      closeTime = dayjs(`${special.date}T${special.closeTime}`);
    } else {
      const dayName = dayjs(inputs.date).format('dddd'); // e.g., 'Friday'
      const workingDay = workingHours.find(w => w.day === dayName);
      if (!workingDay || !workingDay.openTime || !workingDay.closeTime) return false;

      openTime = dayjs(`${inputs.date}T${workingDay.openTime}`);
      closeTime = dayjs(`${inputs.date}T${workingDay.closeTime}`);

      if (closeTime.isBefore(openTime)) {
        closeTime = closeTime.add(1, 'day'); // handle past-midnight
      }
    }

    return selectedTime.isSameOrAfter(openTime) && selectedTime.isBefore(closeTime);
  };


  // Define the labels for each step.
  const steps = [
    t('bookingForm.stepLabel1'),
    t('bookingForm.stepLabel2'),
    t('bookingForm.stepLabel3')
  ];

  // Handle next step
  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 1 validation
      const { contactName, contactPhone, players, date, startTime, duration } = inputs;
      if (!contactName || !contactPhone || !players || !date || !startTime || !duration) {
        Swal.fire({
          icon: 'warning',
          title: t('alerts.incompleteTitle'),
          text: t('alerts.incompleteText'),
        });
        return;
      }
      if (!nameRegex.test(contactName)) {
        Swal.fire({
          icon: 'warning',
          title: "Invalid name",
          text: "Names may not include numbers",
        });
        return;
      }

      if (!isValidPhoneNumber(contactPhone)) {
        Swal.fire({
          icon: 'warning',
          title: "Invalid phone number",
          text: "Please enter a valid phone number in the format: +[CountryCode][Number]",
        });
        return;
      }

      if (isNaN(players) || players < 1 || players > 10) {
        Swal.fire({
          icon: 'warning',
          title: "Invalid players input",
          text: "players must be a number and between 1 to 10",
        });
        return;
      }

      if (isNaN(duration) || !duraOpt.includes(duration)) {
        Swal.fire({
          icon: 'warning',
          title: "Invalid duration",
          text: "Duration must be at least 60 minutes, at most 600 minutes and in increments of 30 minutes.",
        });
        return;
      }
      if (!isWithinWorkingHours()) {
        Swal.fire({
          icon: 'warning',
          title: t('alerts.invalidTimeTitle'),
          text: t('alerts.invalidTimeText'),
        });
        return;
      }
      await checkAvailability(inputs.players);
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
      const allAvailableTables = [
        ...(filteredTables.suggested || []),
        ...(filteredTables.alsoAvailable || [])
      ];
      const selectedTable = allAvailableTables.find(
        (table) => table.number === parseInt(inputs.tableNumber, 10)
      );
      if (!selectedTable || selectedTable.capacity < Number(inputs.players)) {
        Swal.fire({
          icon: 'warning',
          title: t('alerts.tableNotAvailableTitle'),
          text: t('alerts.tableNotFoundText'),
        });
        return;
      }
    };
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  // Handle previous step
  const handleBack = () => {
    if (activeStep === 1) {
        setTableError('');
        setInputs(prev => ({ ...prev, tableNumber: "" }));
      }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  };

  const handleTimeChange = (value) => {
    setInputs({ ...inputs, startTime: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'contactName') {
        const trimmed = value.trim();
      if (!nameRegex.test(trimmed)) {
        setNameError('Name can only contain letters, spaces, hyphens, apostrophes, and dots.');
      } else {
        setNameError('');
      }
    }

    if (name === 'contactPhone') {
        const trimmed = value.trim();
      
        if (trimmed.length < 10) {
          setPhoneError('');
        } else if (!isValidPhoneNumber(trimmed)) {
          setPhoneError('Invalid phone format. Format: +358505662613');
        } else {
          setPhoneError('');
        }
      }

    if (name === 'players') {
    const number = parseInt(value, 10);
        if (isNaN(number) || number < 1 || number > 10) {
            setPlayersError(t('bookingForm.availabilityPeople'));
        } else {
            setPlayersError('');
        }
    }

    if (name === 'tableNumber') {
        const trimmed = value.trim();
        if (trimmed.length < 1) {
            setTableError('');
        } else {
            const number = parseInt(value, 10);
            const allAvailableTables = [
            ...(filteredTables.suggested || []),
            ...(filteredTables.alsoAvailable || [])
            ];
        
            const exists = allAvailableTables.some((table) => table.number === number);
        
            if (!exists) {
            setTableError(t('alerts.tableNotFoundText'));
            } else {
            setTableError('');
            }
        }
      }
  
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

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
        return <StepOne inputs={inputs} handleChange={handleChange} handleTimeChange={handleTimeChange} nameError={nameError} phoneError={phoneError} playersError={playersError} getHoursForSelectedDate={getHoursForSelectedDate} />;
      case 1:
        return <StepTwo inputs={inputs} handleChange={handleChange} tables={filteredTables} setInputs={setInputs} tableError={tableError} setTableError={setTableError}/>;
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
                        <Button onClick={handleNext} variant="contained" color="primary" disabled={!!phoneError || !!nameError || !!playersError || !!tableError} >
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

