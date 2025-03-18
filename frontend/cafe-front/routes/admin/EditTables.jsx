import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminNavbar from '../../components/admin/AdminNavbar';

const EditTables = () => {
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState({
        number: '',
        capacity: '',
        location: '',
        availability: true
    });
    const [selectedTableId, setSelectedTableId] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTable({
            ...newTable,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTableId) {
                // Update existing table
                const response = await API.put(`/tables/${selectedTableId}`, newTable);
                setTables(tables.map(table => (table._id === selectedTableId ? response.data : table)));
            } else {
                // Create new table
                const response = await API.post('/tables', newTable);
                setTables([...tables, response.data]);
            }
            setNewTable({ number: '', capacity: '', location: '', availability: true });
            setSelectedTableId(null);
        } catch (error) {
            console.error('Error creating/updating table:', error);
        }
    };

    const handleEdit = (table) => {
        setNewTable(table);
        setSelectedTableId(table._id);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this table?');
        if (confirmDelete) {
            try {
                await API.delete(`/tables/${id}`);
                setTables(tables.filter(table => table._id !== id));
            } catch (error) {
                console.error('Error deleting table:', error);
            }
        }
    };

    return (
        <div>
            <AdminNavbar />
            <h1 style={{ marginTop: '30px' }}>Manage Tables</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="number"
                    placeholder="Table Number"
                    value={newTable.number}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={newTable.capacity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newTable.location}
                    onChange={handleChange}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="availability"
                        checked={newTable.availability}
                        onChange={(e) => setNewTable({ ...newTable, availability: e.target.checked })}
                    />
                    Available
                </label>
                <button type="submit">{selectedTableId ? 'Update Table' : 'Add Table'}</button>
            </form>
            <h2 style={{ marginTop: '30px' }}>Existing Tables</h2>
            <ul>
                {tables.map(table => (
                    <li key={table._id}>
                        Table {table.number} - Capacity: {table.capacity} - Location: {table.location} - {table.availability ? 'Available' : 'Unavailable'}
                        <button onClick={() => handleEdit(table)}>Edit</button>
                        <button onClick={() => handleDelete(table._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditTables;
