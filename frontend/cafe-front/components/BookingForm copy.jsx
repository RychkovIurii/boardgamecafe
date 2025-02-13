import React from 'react'
import { useState } from 'react';
import './Style/BookingFormStyles.css';
import API from '../api/axios';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
  StepContent
} from '@mui/material';


/**
 StepOne, StepTwo, and StepThree are separated for clarity.
 You can define them inline, in separate files, or as your project needs.*/
function StepOne({ inputs, handleChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
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
          onChange={handleChange}
          placeholder="Number of Players"
          required
        />
      </div>
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

function StepTwo({ inputs, handleChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Table and Game Selection (Optional)
      </Typography>
      <label>Table: </label>
      <input
        className='formInput'
        type='number'
        min={1}
        max={12}
        name='tableId'
        value={inputs.tableId || ""}
        placeholder="Table ID"
        onChange={handleChange}
        required
      />
      <br />
      <label>Game: </label>
      <input
        className='formInput'
        type='text'
        name="gameId"
        value={inputs.gameId || ""}
        onChange={handleChange}
      />
    </Box>
  );
}

function StepThree({ inputs, handleChange, handleSubmit }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Submit
      </Typography>
      <Typography variant="body1" gutterBottom>
        By submitting this form you agree to the Terms and Conditions of Cafe Boardgame.
      </Typography>
    </Box>
  );
}



export default function BookingForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [inputs, setInputs] = useState({
    date: "",
    startTime: "",
    duration: "",
    tableId: "",
    players: "",
    gameId: "",
    userId: "",
    contactName: "",
    contactPhone: ""
  });

  // Define the labels for each step.
  const steps = ['Personal Info', 'Table and Game Selection (Optional)', 'Submit'];

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
      tableId: inputs.tableId,
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
      console.log("Booking created successfully:", response.data);
      setBooking({
        date: "",
        startTime: "",
        duration: "",
        tableId: "",
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
        return <StepOne inputs={inputs} handleChange={handleChange} />;
      case 1:
        return <StepTwo inputs={inputs} handleChange={handleChange} />;
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

          <Box className='stepperStyle2' sx={{ minWidth: '400px', maxWidth: '700px', margin: '0 auto' }} >
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Booking created successfully!</p>}
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {renderStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
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

