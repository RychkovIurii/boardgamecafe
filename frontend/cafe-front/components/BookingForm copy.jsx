import React , { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style/BookingFormStyles.css';
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

/* const tables = [
	{
	  "id": 1,
	  "seats": 2,
	  "location": "ground"
	},
	{
	  "id": 2,
	  "seats": 2,
	  "location": "ground"
	},
	{
	  "id": 3,
	  "seats": 6,
	  "location": "ground"
	},
	{
	  "id": 4,
	  "seats": 5,
	  "location": "ground"
	},
	{
	  "id": 5,
	  "seats": 5,
	  "location": "ground"
	},
	{
	  "id": 6,
	  "seats": 6,
	  "location": "ground"
	},
	{
	  "id": 7,
	  "seats": 8,
	  "location": "ground"
	},
	{
	  "id": 8,
	  "seats": 8,
	  "location": "ground"
	},
	{
	  "id": 9,
	  "seats": 2,
	  "location": "ground"
	},
	{
	  "id": 10,
	  "seats": 2,
	  "location": "ground"
	},
	{
	  "id": 11,
	  "seats": 2,
	  "location": "ground"
	},
	{
	  "id": 12,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 13,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 14,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 15,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 16,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 17,
	  "seats": 10,
	  "location": "upstairs"
	},
	{
	  "id": 18,
	  "seats": 2,
	  "location": "upstairs"
	},
	{
	  "id": 19,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 20,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 21,
	  "seats": 4,
	  "location": "upstairs"
	},
	{
	  "id": 22,
	  "seats": 2,
	  "location": "upstairs"
	},
	{
	  "id": 23,
	  "seats": 8,
	  "location": "upstairs"
	},
	{
	  "id": 24,
	  "seats": 4,
	  "location": "terrace"
	},
	{
	  "id": 25,
	  "seats": 8,
	  "location": "terrace"
	},
	{
	  "id": 26,
	  "seats": 8,
	  "location": "terrace"
	},
	{
	  "id": 27,
	  "seats": 4,
	  "location": "terrace"
	}
  ] */

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
  console.log(tables)
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
         {tables.map((table) => <div key={table.number} className='table' onClick={(e) => {setInputs({ ...inputs, tableNumber: table.number }); console.log(inputs)}}> {table.number}</div> )} 
      </div>
      <label>Game: </label>
      <input
        className='formInput'
        type='text'
        name="gameId"
        value={inputs.gameId || ""}
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
  const [filteredTables, setFilteredTables] = useState([]);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    date: "",
    startTime: "",
    duration: "",
    tableNumber: "",
    players: "",
    gameId: "",
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

/*   function checkAvailability(people) {
    if (people <= 2) {
      //table id can be 1, 2, 9, 10, 11, 18, 22
      const filtered = tables.filter((tables) => tables.seats == 2)
      setFilteredTables(filtered)
    }
    else if (people >= 2 && people <= 4) {
      const filtered = tables.filter((tables) => tables.seats == 4)
      setFilteredTables(filtered)
    }
    else if (people >= 4 && people <= 5) {
      const filtered = tables.filter((tables) => tables.seats == 5)
      setFilteredTables(filtered)
    }
    else if (people >= 5 && people <= 6) {
      const filtered = tables.filter((tables) => tables.seats == 6)
      setFilteredTables(filtered)
    }
    else if (people >= 6 && people <= 8) {
      const filtered = tables.filter((tables) => tables.seats == 8)
      setFilteredTables(filtered)
    }
    else if (people >= 8 && people <= 10) {
      const filtered = tables.filter((tables) => tables.seats == 10)
      setFilteredTables(filtered)
    }
    else {
      return "There are no available tables able to seat your group, please call to check if there are ways to host your group."
    }
  } */

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
      gameId: inputs.gameId || null,
      userId: inputs.userId || null,
      contactName: inputs.contactName,
      contactPhone: inputs.contactPhone,
      // id: window.crypto.randomUUID()
    }

    try {
      const response = await API.post('/bookings', bookingData);
      console.log(response)
      setSuccess(true);
      alert("Booking created successfully!");
	  setTimeout(() => {
        navigate('/');
      }, 2000);
      setInputs({
        date: "",
        startTime: "",
        duration: "",
        tableNumber: "",
        players: "",
        gameId: "",
        userId: "",
        contactName: "",
        contactPhone: ""
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

