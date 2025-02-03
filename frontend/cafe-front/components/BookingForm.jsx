import React from 'react'
import { useState } from 'react';
import './Style/BookingFormStyles.css';
import floorplan from '../assets/floorplan.png'

export default function BookingForm() {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
        alert("Booking successful!")
    }

    return (
        <div>
            <div className='backgroundBooking'>
                <div>
                    <form className='form'>
                        <label>Name:
                            <input
                                type='text'
                                name="contact_name"
                                value={inputs.contact_name || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>Phone Number:
                            <input
                                type='text'
                                name="contact_phone"
                                value={inputs.contact_phone || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>Date:
                            <input
                                type='date'
                                min={new Date().toJSON().slice(0, 10)}
                                name="rez_date"
                                value={inputs.rez_date || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>Start time:
                            <input
                                type='time'
                                name="start_time"
                                value={inputs.start_time || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>End time:
                            <input
                                type='time'
                                name='end_time'
                                value={inputs.end_time || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>Table number*:
                            <input
                                type='number'
                                min={1}
                                max={12}
                                name='table_num'
                                value={inputs.table_num || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label> People*:
                            <input
                                type='number'
                                min={1}
                                max={8}
                                name='people_num'
                                value={inputs.people_num || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>I wish to reserve a specific game*:
                            <input
                                type='text'
                                name='game_rez'
                                value={inputs.game_rez || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>Other: (if you need an additional chair, it's a birthday, or you have other notes, please put them in this field)<br />
                            <textarea
                                name='other_rez'
                                value={inputs.other_rez || ""}
                                onChange={handleChange}>
                            </textarea>
                        </label>
                        <input type='submit' onClick={handleSubmit} />
                    </form>
                </div>
                <img className="floorplann" src='../assets/floorplan.png' />
            </div>

        </div>
    )
}
