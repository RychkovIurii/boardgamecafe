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

  const handleSpecialDelete = async (selectedSpecialId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this date?')
    if (confirmDelete) {
      try {
        await API.delete(`/specialHours/${selectedSpecialId}`, specialForm);
        setSpecialHours(specialHours.filter(item => item._id != selectedSpecialId))
      } catch (error) {
        console.error('Error deleting date:', error);
      }
    }
  }

  return (
    <div>
      <AdminNavbar />
      <div className="admin-section-wrapper">
        <h1 className="admin-section-title">Edit Opening Hours</h1>

        <section >
          <h2 className="md:px-10 md:pt-10 md:mt-5 md:pb-5 pt-10 pb-2 text-2xl md:text-3xl font-medium text-gray-800">Special Dates</h2>
          <form onSubmit={handleSpecialSubmit} className="flex flex-col gap-4 mt-3 mb-5">
            <input type="date" name="date" value={specialForm.date} onChange={handleSpecialChange} required className="border px-4 py-2 rounded" />
            <input type="time" name="openTime" value={specialForm.openTime} onChange={handleSpecialChange} className="border px-4 py-2 rounded" />
            <input type="time" name="closeTime" value={specialForm.closeTime} onChange={handleSpecialChange} className="border px-4 py-2 rounded" />
            <input type="text" name="reason" placeholder="Reason (e.g. Christmas)" value={specialForm.reason} onChange={handleSpecialChange} className="border px-4 py-2 rounded" />
            <div className="flex gap-4 justify-center mt-4">
              <button type="submit" className="bg-green-800 text-white w-20 py-1 rounded hover:bg-green-500 text-center">
                {selectedSpecialId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecialForm({ date: '', openTime: '', closeTime: '', reason: '' });
                  setSelectedSpecialId(null);
                }}
                className="bg-gray-700 text-white w-20 py-1 rounded hover:bg-gray-500 text-center"
              >
                Cancel
              </button>
            </div>
          </form>
          <div className="overflow-x-auto pt-5 w-[800px] mx-auto">
            <table className="table-auto w-full border border-gray-300 shadow-sm rounded-md">
              <thead className="bg-gray-100 text-center">
                <tr>
                  <th className="admin-section-td">Date</th>
                  <th className="admin-section-td">Open Time</th>
                  <th className="admin-section-td">Close Time</th>
                  <th className="admin-section-td">Reason</th>
                  <th className="admin-section-td"></th>
                  <th className="admin-section-td"></th>
                </tr>
              </thead>
              <tbody>
                {specialHours.map(hour => (
                  <tr key={hour._id} className="text-center hover:bg-gray-50">
                    <td className="admin-section-td">{hour.date?.slice(0, 10)}</td>
                    <td className="admin-section-td">{hour.openTime || 'Closed'}</td>
                    <td className="admin-section-td">{hour.closeTime || 'Closed'}</td>
                    <td className="admin-section-td">{hour.reason || '-'}</td>
                    <td className="admin-section-td">
                      <button className="admin-button-edit" onClick={() => handleSpecialEdit(hour)}>
                        Edit
                      </button>
                    </td>
                    <td className="admin-section-td">
                      <button className="admin-button-cancle-delete" onClick={() => handleSpecialDelete(hour._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="md:px-10 md:pt-10 md:mt-7 md:pb-5 pt-10 pb-2 text-2xl md:text-3xl font-medium text-gray-800">Regular Weekly Hours</h2>
          <form onSubmit={handleWorkingSubmit} className="flex flex-col gap-4 mt-3 mb-5">
            <select
              name="day"
              value={workingForm.day}
              onChange={handleWorkingChange}
              required
              className="border rounded px-4 py-2"
            >
              <option value="">Select Day</option>
              {weekDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              name="openTime"
              value={workingForm.openTime}
              onChange={handleWorkingChange}
              className="border rounded px-4 py-2"
            />
            <input
              type="time"
              name="closeTime"
              value={workingForm.closeTime}
              onChange={handleWorkingChange}
              className="border rounded px-4 py-2"
            />
            <div className="flex gap-4 justify-center mt-4">
              <button
                type="submit"
                className="bg-green-800 text-white w-20 py-1 rounded hover:bg-green-500 text-center"
              >
                {selectedWorkingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setWorkingForm({ day: '', openTime: '', closeTime: '' });
                  setSelectedWorkingId(null);
                }}
                className="bg-gray-700 text-white w-20 py-1 rounded hover:bg-gray-500 text-center"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="overflow-x-auto pt-5 w-[800px] mx-auto">
            <table className="table-auto w-full border border-gray-300 shadow-sm rounded-md">
              <thead className="bg-gray-100 text-center">
                <tr>
                  <th className="admin-section-td">Day</th>
                  <th className="admin-section-td">Open Time</th>
                  <th className="admin-section-td">Close Time</th>
                  <th className="admin-section-td"></th>
                </tr>
              </thead>
              <tbody>
                {workingHours.map(hour => (
                  <tr key={hour._id} className="text-center hover:bg-gray-50">
                    <td className="admin-section-td">{hour.day}</td>
                    <td className="admin-section-td">{hour.openTime || 'Closed'}</td>
                    <td className="admin-section-td">{hour.closeTime || 'Closed'}</td>
                    <td className="admin-section-td">
                      <button
                        onClick={() => handleWorkingEdit(hour)}
                        className="admin-button-edit"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


      </div>
    </div >
  );
};

export default EditHours;
