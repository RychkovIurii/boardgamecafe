import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../components/Style/AdminStyles.css';

const ManageMenuItems = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        menuType: '',
        image: '',
        details: {
            description: '',
            pricing: [{ item: '', options: [], price: '' }]
        }
    });
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await API.get('/prices');
                const normalized = response.data.map(item => ({
                    ...item,
                    details: {
                        ...item.details,
                        pricing: item.details.pricing.map(p => ({
                            ...p,
                            options: Array.isArray(p.options) ? p.options : []
                        }))
                    }
                }));
                setMenuItems(normalized);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDetailsChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPricing = [...newMenuItem.details.pricing];
        updatedPricing[index][name] =
            name === 'options'
                ? value.split(',').map(opt => opt.trim())
                : value;

        setNewMenuItem(prev => ({
            ...prev,
            details: {
                ...prev.details,
                pricing: updatedPricing
            }
        }));
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/prices', newMenuItem);
            setMenuItems([...menuItems, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    const handleEditMenuItem = (item) => {
        const normalized = {
            ...item,
            details: {
                ...item.details,
                pricing: item.details.pricing.map(p => ({
                    ...p,
                    options: Array.isArray(p.options) ? p.options : []
                }))
            }
        };
        setSelectedMenuItemId(item._id);
        setNewMenuItem(normalized);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateMenuItem = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put(`/prices/${selectedMenuItemId}`, newMenuItem);
            setMenuItems(menuItems.map(item => item._id === selectedMenuItemId ? response.data : item));
            resetForm();
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await API.delete(`/prices/${id}`);
                setMenuItems(menuItems.filter(item => item._id !== id));
            } catch (error) {
                console.error('Error deleting menu item:', error);
            }
        }
    };

    const resetForm = () => {
        setNewMenuItem({
            menuType: '',
            image: '',
            details: {
                description: '',
                pricing: [{ item: '', options: [], price: '' }]
            }
        });
        setSelectedMenuItemId(null);
    };

    return (
        <div>
            <AdminNavbar />
            <div className="admin-section-wrapper">
                <h1 className="admin-section-title">Manage Menu Items</h1>
                <form
                    onSubmit={selectedMenuItemId ? handleUpdateMenuItem : handleAddMenuItem}
                    className="flex flex-col gap-4 bg-white p-6 rounded shadow mt-5"
                >
                    <input
                        type="text"
                        name="menuType"
                        placeholder="Menu Type"
                        value={newMenuItem.menuType}
                        onChange={handleChange}
                        required
                        className="border px-4 py-2 rounded-md"
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="Image Path"
                        value={newMenuItem.image}
                        onChange={handleChange}
                        required
                        className="border px-4 py-2 rounded-md"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newMenuItem.details.description}
                        onChange={(e) => setNewMenuItem(prev => ({
                            ...prev,
                            details: { ...prev.details, description: e.target.value }
                        }))}
                        className="border px-4 py-2 rounded-md min-h-[100px]"
                    />
                    {newMenuItem.details.pricing.map((pricingItem, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="item"
                                placeholder="Item"
                                value={pricingItem.item}
                                onChange={(e) => handleDetailsChange(e, index)}
                                className="border px-4 py-2 rounded-md"
                                required
                            />
                            <div>
                                <label className="text-sm text-gray-600">Options (e.g. Small, Medium, Large)</label>
                                <input
                                    type="text"
                                    name="options"
                                    placeholder="Comma-separated options"
                                    value={Array.isArray(pricingItem.options) ? pricingItem.options.join(', ') : ''}
                                    onChange={(e) => handleDetailsChange(e, index)}
                                    className="border px-4 py-2 rounded-md"
                                />
                            </div>
                            <input
                                type="text"
                                name="price"
                                placeholder="Price"
                                value={pricingItem.price}
                                onChange={(e) => handleDetailsChange(e, index)}
                                className="border px-4 py-2 rounded-md"
                                required
                            />
                        </div>
                    ))}
                    <div className="flex gap-4 pt-2 justify-center">
                        <button type="submit" className="bg-green-800 text-white px-6 py-2 rounded">
                            {selectedMenuItemId ? 'Update Menu' : 'Add Menu'}
                        </button>
                        {selectedMenuItemId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="admin-button-cancle-delete"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <section className='w-[800px] mx-auto'>
                    <h2 className='md:px-10 md:pt-10 md:mt-10 md:pb-5 pt-10 pb-5 text-2xl md:text-3xl font-medium text-gray-800'>Existing Menu Items</h2>
                    <ul className="space-y-4">
                        {menuItems.map(item => (
                            <li key={item._id} className="border p-4 rounded shadow">
                                <div className="font-medium text-lg mb-2 text-start">
                                    <p className='font-semibold'>{item.menuType}</p>
                                    <p>{item.details.description}</p>
                                </div>
                                <div className="flex gap-2 justify-center pt-2">
                                    <button
                                        onClick={() => handleEditMenuItem(item)}
                                        className="admin-button-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMenuItem(item._id)}
                                        className="admin-button-cancle-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

            </div>
        </div>
    );
};

export default ManageMenuItems;
