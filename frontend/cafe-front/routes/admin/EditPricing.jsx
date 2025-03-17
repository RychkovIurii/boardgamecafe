import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminNavbar from '../../components/admin/AdminNavbar';

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
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem({
            ...newMenuItem,
            [name]: value
        });
    };

    const handleDetailsChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPricing = [...newMenuItem.details.pricing];
        updatedPricing[index][name] = value;
        setNewMenuItem({
            ...newMenuItem,
            details: {
                ...newMenuItem.details,
                pricing: updatedPricing
            }
        });
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/prices', newMenuItem);
            setMenuItems([...menuItems, response.data]);
            setNewMenuItem({
                menuType: '',
                image: '',
                details: {
                    description: '',
                    pricing: [{ item: '', options: [], price: '' }]
                }
            });
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    const handleEditMenuItem = (item) => {
        setSelectedMenuItemId(item._id);
        setNewMenuItem(item);
    };

    const handleUpdateMenuItem = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put(`/prices/${selectedMenuItemId}`, newMenuItem);
            setMenuItems(menuItems.map(item => (item._id === selectedMenuItemId ? response.data : item)));
            setSelectedMenuItemId(null);
            setNewMenuItem({
                menuType: '',
                image: '',
                details: {
                    description: '',
                    pricing: [{ item: '', options: [], price: '' }]
                }
            });
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    const handleDeleteMenuItem = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this menu item?');
        if (confirmDelete) {
            try {
                await API.delete(`/prices/${id}`);
                setMenuItems(menuItems.filter(item => item._id !== id));
            } catch (error) {
                console.error('Error deleting menu item:', error);
            }
        }
    };

	return (
		<div>
			<AdminNavbar />
			<h1 style={{ marginTop: '30px' }}>Manage Menu Items</h1>
			<form onSubmit={selectedMenuItemId ? handleUpdateMenuItem : handleAddMenuItem}>
				<input
					type="text"
					name="menuType"
					placeholder="Menu Type"
					value={newMenuItem.menuType}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="image"
					placeholder="Image Path"
					value={newMenuItem.image}
					onChange={handleChange}
					required
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={newMenuItem.details.description}
					onChange={(e) => setNewMenuItem({
						...newMenuItem,
						details: { ...newMenuItem.details, description: e.target.value }
					})}
				/>
				{newMenuItem.details.pricing.map((pricingItem, index) => (
					<div key={index}>
						<input
							type="text"
							name="item"
							placeholder="Item"
							value={pricingItem.item}
							onChange={(e) => handleDetailsChange(e, index)}
							required
						/>
						<input
							type="text"
							name="options"
							placeholder="Options (comma separated)"
							value={pricingItem.options.join(', ')}
							onChange={(e) => handleDetailsChange(e, index)}
						/>
						<input
							type="text"
							name="price"
							placeholder="Price"
							value={pricingItem.price}
							onChange={(e) => handleDetailsChange(e, index)}
							required
						/>
					</div>
				))}
				<button type="submit">{selectedMenuItemId ? 'Update Menu Item' : 'Add Menu Item'}</button>
			</form>
			<h2 style={{ marginTop: '30px' }}>Existing Menu Items</h2>
			<ul style={{ textAlign: 'left' }}>
				{menuItems.map(item => (
					<li key={item._id}>
						{item.menuType} - {item.details.description}
						<button onClick={() => handleEditMenuItem(item)}>Edit</button>
						<button onClick={() => handleDeleteMenuItem(item._id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ManageMenuItems;
