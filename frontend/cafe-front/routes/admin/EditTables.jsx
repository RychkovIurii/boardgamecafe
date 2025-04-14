import { useState, useEffect } from 'react';
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
            <div className="admin-section-wrapper">
                <h1 className="admin-section-title">Manage Tables</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
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
                    <div className="flex gap-4 pt-2 justify-center">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="availability"
                                checked={newTable.availability}
                                onChange={(e) => setNewTable({ ...newTable, availability: e.target.checked })}
                            />
                            Available
                        </label>

                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                            {selectedTableId ? 'Update Table' : 'Add Table'}
                        </button>
                        {selectedTableId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setNewTable({ number: '', capacity: '', location: '', availability: true });
                                    setSelectedTableId(null);
                                }}
                                className="admin-button-cancle-delete"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <h2 className='md:px-10 md:pt-10 md:mt-10 md:pb-5 pt-10 pb-5 text-2xl md:text-3xl font-medium text-gray-800'>Existing Tables</h2>
                <div className="overflow-x-auto sm:mt-6 mt-3 w-[800px] mx-auto">
                    <table className="table-auto w-full border border-gray-300 shadow-sm rounded-md">
                        <thead className="bg-gray-100 text-center">
                            <tr>
                                <th className="admin-section-td">Table Number</th>
                                <th className="admin-section-td">Capacity</th>
                                <th className="admin-section-td">Location</th>
                                <th className="admin-section-td">Status</th>
                                <th className="admin-section-td"></th>
                                <th className="admin-section-td"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr key={table._id} className="text-center hover:bg-gray-50">
                                    <td className="admin-section-td">{table.number}</td>
                                    <td className="admin-section-td">{table.capacity}</td>
                                    <td className="admin-section-td">{table.location}</td>
                                    <td className="admin-section-td">{table.availability ? 'Available' : 'Unavailable'}</td>
                                    <td className="admin-section-td">
                                        <button
                                            onClick={() => handleEdit(table)}
                                            className="admin-button-edit"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => handleDelete(table._id)}
                                            className="admin-button-cancle-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default EditTables;
