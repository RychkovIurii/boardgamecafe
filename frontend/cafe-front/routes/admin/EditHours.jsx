import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminNavbar from '../../components/admin/AdminNavbar';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [specialHours, setSpecialHours] = useState([]);
  const [workingForm, setWorkingForm] = useState({ day: '', openTime: '', closeTime: '' });
  const [specialForm, setSpecialForm] = useState({ date: '', openTime: '', closeTime: '', reason: '' });
  const [selectedWorkingId, setSelectedWorkingId] = useState(null);
  const [selectedSpecialId, setSelectedSpecialId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workingRes, specialRes] = await Promise.all([
          API.get('/hours'),
          API.get('/specialHours')
        ]);
        setWorkingHours(workingRes.data);
        setSpecialHours(specialRes.data);
      } catch (err) {
        console.error('Failed to fetch hours:', err);
      }
    };
    fetchData();
  }, []);

  const handleWorkingChange = (e) => {
    setWorkingForm({ ...workingForm, [e.target.name]: e.target.value });
  };

  const handleSpecialChange = (e) => {
    setSpecialForm({ ...specialForm, [e.target.name]: e.target.value });
  };

  const handleWorkingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWorkingId) {
        const res = await API.put(`/hours/${selectedWorkingId}`, workingForm);
        setWorkingHours(workingHours.map(item => item._id === selectedWorkingId ? res.data : item));
      } else {
        const res = await API.post('/hours', workingForm);
        setWorkingHours([...workingHours, res.data]);
      }
      setWorkingForm({ day: '', openTime: '', closeTime: '' });
      setSelectedWorkingId(null);
    } catch (err) {
      console.error('Saving working hour failed:', err);
    }
  };

  const handleSpecialSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSpecialId) {
        const res = await API.put(`/specialHours/${selectedSpecialId}`, specialForm);
        setSpecialHours(specialHours.map(item => item._id === selectedSpecialId ? res.data : item));
      } else {
        const res = await API.post('/specialHours', specialForm);
        setSpecialHours([...specialHours, res.data]);
      }
      setSpecialForm({ date: '', openTime: '', closeTime: '', reason: '' });
      setSelectedSpecialId(null);
    } catch (err) {
      console.error('Saving special hour failed:', err);
    }
  };

  const handleWorkingEdit = (entry) => {
    setWorkingForm(entry);
    setSelectedWorkingId(entry._id);
  };

  const handleSpecialEdit = (entry) => {
    setSpecialForm({
      ...entry,
      date: entry.date?.slice(0, 10) // format to YYYY-MM-DD for input
    });
    setSelectedSpecialId(entry._id);
  };

  return (
    <div>
      <AdminNavbar />
      <h1 style={{ marginTop: '30px' }}>Edit Opening Hours</h1>

      <h2>Regular Weekly Hours</h2>
      <form onSubmit={handleWorkingSubmit}>
        <select name="day" value={workingForm.day} onChange={handleWorkingChange} required>
          <option value="">Select Day</option>
          {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
        <input type="time" name="openTime" value={workingForm.openTime} onChange={handleWorkingChange} />
        <input type="time" name="closeTime" value={workingForm.closeTime} onChange={handleWorkingChange} />
        <button type="submit">{selectedWorkingId ? 'Update' : 'Add'}</button>
      </form>
      <ul className='edits_close'>
        {workingHours.map(hour => (
          <li className='items' key={hour._id}>
            {hour.day}: {hour.openTime || 'Closed'} - {hour.closeTime || 'Closed'}
            <button className='edit_but' onClick={() => handleWorkingEdit(hour)}>Edit</button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '40px' }}>Special Dates</h2>
      <form onSubmit={handleSpecialSubmit}>
        <input type="date" name="date" value={specialForm.date} onChange={handleSpecialChange} required />
        <input type="time" name="openTime" value={specialForm.openTime} onChange={handleSpecialChange} />
        <input type="time" name="closeTime" value={specialForm.closeTime} onChange={handleSpecialChange} />
        <input type="text" name="reason" placeholder="Reason (e.g. Christmas)" value={specialForm.reason} onChange={handleSpecialChange} />
        <button type="submit">{selectedSpecialId ? 'Update' : 'Add'}</button>
      </form>
      <ul className='edits_close'>
        {specialHours.map(hour => (
          <li className='items' key={hour._id}>
            {hour.date?.slice(0, 10)}: {hour.openTime || 'Closed'} - {hour.closeTime || 'Closed'} {hour.reason && `(${hour.reason})`}
            <button className='edit_but' onClick={() => handleSpecialEdit(hour)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditHours;
