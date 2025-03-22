import React , { useState, useEffect } from 'react';
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

/**
 StepOne, StepTwo, and StepThree are separated for clarity.
 You can define them inline, in separate files, or as your project needs.*/
function StepOne({ inputs, handleChange, handleFilterChange }) {
  return (
    <Box sx={{ fontFamily: "Fontdiner Swanky" }}>
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        Step 1: Personal Info
      </Typography>
      <div className='formItem'>
        <label>Name: </label>
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
        <label>Phone: </label>
        <input
          className='formInput'
          type='text'
          name="contactPhone"
          value={inputs.contactPhone || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label> People*: </label>
        <input
          className='formInput'
          type='number'
          min={1}
          max={10}
          name='players'
          value={inputs.players || ""}
          onChange={(e) => { handleChange(e)}}
          placeholder="Number of Players"
          required
        />
      </div>
      (If your group has more than 8 people, please contact us directly for your booking)
      <div className='formItem'>
        <label>Date: </label>
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
        <label>Start time: </label>
        <input
          className='formInput'
          type='time'
          name="startTime"
          value={inputs.startTime || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>Duration: </label>
        <input
          className='formInput'
          type='number'
          name='duration'
          value={inputs.duration || ""}
          onChange={handleChange}
          min={60}
          step={30}
          placeholder="Duration (minutes)"
          required
        />

      </div>
    </Box>
  );
}

function StepTwo({ inputs, handleChange, tables, setInputs }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: "Fontdiner Swanky" }} gutterBottom>
        Step 2: Optional Requests
      </Typography>
      <div className='smallerText'>
        Here you can optionally request a specific table or game. You can skip this step if you have no specific items to request. Please keep in mind that the Cafe reserves the right to change tables as needed.
      </div>
      <label>Table: </label>
      <input
        className='formInput'
        type='number'
        min={1}
        max={50}
        name='tableNumber'
        value={inputs.tableNumber || ""}
        placeholder="Table number"
        onChange={handleChange}
        required
      />
      <div className='tables'>Suggested: 
         {tables.map((table) => <div key={table.number} className='table' onClick={(e) => {setInputs({ ...inputs, tableNumber: table.number });}}> {table.number}</div> )} 
      </div>
      <label>Game: </label>
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
  return (
    <Box sx={{ fontFamily: "Fontdiner Swanky" }}>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="h6" gutterBottom>
        Step 3: Submit
      </Typography>
      <Typography sx={{ fontFamily: "Fontdiner Swanky" }} variant="body1" gutterBottom>
        By submitting this form you agree to the Terms and Conditions of Cafe Boardgame.
      </Typography>
    </Box>
  );
}



export default function BookingForm() {
  const [tables, setTables] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState();
  const [bookingId, setBookingId] = useState(null);
  const [filteredTables, setFilteredTables] = useState([]);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
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

  function checkAvailability(people) {
	if (people < 1) {
	  return "Invalid number of players.";
	}
  
	const seatCapacities = [2, 4, 5, 6, 8, 10]; // ✅ Define allowed seat counts
	const seatLimit = seatCapacities.find(capacity => people <= capacity); // ✅ Find the smallest matching capacity
  
	if (!seatLimit) {
	  return "There are no available tables able to seat your group, please call to check if there are ways to host your group.";
	}
  
	// ✅ Filter tables that match the found `seatLimit`
	const filtered = tables.filter(table => table.capacity === seatLimit);
	setFilteredTables(filtered);
  }

  // Define the labels for each step.
  const steps = ['Personal Info', 'Optional Requests', 'Submit'];

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    checkAvailability(inputs.players)
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

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
      startTime: inputs.startTime,
      duration: inputs.duration,
      tableNumber: inputs.tableNumber,
      players: parsedPlayers,
      game: inputs.game || null,
      userId: inputs.userId || null,
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
		title: 'Booking Confirmed!',
		text: 'Thank you! Your table is now reserved.',
		showDenyButton: true,
		confirmButtonText: 'Go to Home',
		denyButtonText: 'Pay Now (Optional)',
		}).then((result) => {
			if (result.isConfirmed) {
				navigate('/');
			} else if (result.isDenied && createdBookingId) {
				navigate(`/checkout?bookingId=${createdBookingId}`);
			}
		});
    }
    catch (error) {
      setError(error.response?.data?.message || "Error creating booking");
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }

  // Renders the content for each step
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepOne inputs={inputs} handleChange={handleChange}/>;
      case 1:
        return <StepTwo inputs={inputs} handleChange={handleChange} tables={filteredTables} setInputs={setInputs}/>;
      case 2:
        return <StepThree inputs={inputs} handleChange={handleChange} handleSubmit={handleSubmit} />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <>
      <div className='backgroundBooking'>
        <img className="floorplann" src='../assets/floorplan.png' />
        <div className='stepperStyle'>

          <Box className='stepperStyle2' sx={{ minWidth: '400px', maxWidth: '700px', margin: '0 auto', fontFamily: "Fontdiner Swanky" }} >
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
                        Back
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button onClick={handleSubmit} variant="contained" color="primary" >
                          Submit
                        </Button>
                      ) : (
                        <Button onClick={handleNext} variant="contained" color="primary" >
                          Next
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

