import React from 'react'
import { useState } from 'react';
import './Style/BookingFormStyles.css';
import API from '../api/axios';


export default function BookingForm() {

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



    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const validateDuration = (duration) => {
        const value = parseInt(duration, 10);
        return value >= 60 && value % 30 === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validates duration and players
        const parsedDuration = parseInt(inputs.duration, 10);
        const parsedPlayers = parseInt(inputs.players, 10);

        if (!validateDuration(parsedDuration)) {
            setError("Duration must be at least 60 minutes and a multiple of 30 (e.g., 60, 90, 120).");
            setLoading(false);
            return;
        }
        if (isNaN(parsedPlayers) || parsedPlayers < 1) {
            setError("Players must be at least 1.");
            setLoading(false);
            return;
        }

        const bookingData = {
            date: inputs.date,
            startTime: inputs.startTime,
            duration: parsedDuration,
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
            setInputs({
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
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='backgroundBooking'>
                <div>
                    <form className='form' onSubmit={handleSubmit}>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {success && <p style={{ color: "green" }}>Booking created successfully!</p>}
                        <div className='formItem'>
                            <label>Name: </label>
                            <input
                                type='text'
                                name="contactName"
                                value={inputs.contactName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formItem'>
                            <label>Phone Number: </label>
                            <input
                                type='text'
                                name="contactPhone"
                                value={inputs.contactPhone || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formItem'>
                            <label>Date: </label>
                            <input
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
                                type='time'
                                name="startTime"
                                value={inputs.startTime || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Duration: </label>
                            <input
                                type='number'
                                name='duration'
                                value={inputs.duration || ""}
                                onChange={handleChange}
                                min="60"
                                step="30"
                                placeholder="Duration (minutes)"
                                required
                            />

                        </div>
                        <div className='formItem'>
                            <label>Table number*: </label>
                            <input
                                type='number'
                                min={1}
                                max={12}
                                name='tableId'
                                value={inputs.tableId || ""}
                                placeholder="Table ID"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formItem'>
                            <label> People*: </label>
                            <input
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
                        <label>I wish to reserve a specific game:</label>
                        <input
                            type='text'
                            name='gameId'
                            value={inputs.gameId || ""}
                            onChange={handleChange}
                            placeholder="Game (optional)"
                        />
                        {/*                         <label>Other: (if you need an additional chair, it's a birthday, or you have other notes, please put them in this field)<br /></label>
                        <textarea
                            name='other_rez'
                            value={inputs.other_rez || ""}
                            onChange={handleChange}>
                        </textarea> */}
                        <button type='submit' className="submitButt" disabled={loading}>{loading ? "Booking..." : "Book Now"}</button>
                    </form>
                </div>
                <img className="floorplann" src='../assets/floorplan.png' />
            </div >

        </div >
    )
}
