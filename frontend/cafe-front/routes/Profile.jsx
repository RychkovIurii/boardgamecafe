import React, { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Profile = () => {

    const [userData, setUserData] = useState({})
    const [phone, setPhone] = useState('');
    const [isEdit, setIsEdit] = useState(false)



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get('/users/profile');

                console.log('API Response:', response.data);
                setUserData(response.data);
                setPhone(response.data.phone || '')
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error);
            }
        };
        fetchUserData()
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('/users/phone', { phone });
            alert('Phone number updated successfully');

            //Fetch the latest data again after the update
            const response = await API.get('/users/profile');
            setUserData(response.data);
            setPhone(response.data.phone);
            setIsEdit(false);
        } catch (error) {
            console.error('Error updating phone number:', error);
            alert('Failed to update phone number');
        }
    };


    return (
        <>
            <Navbar />
            <div className='max-w-lg flex flex-col gap-2 text-md mt-5'>

                <p className='font-medium text-2xl text-neutral-800 mt-4'>{userData.name}</p>
                <hr className='bg-zinc-400 h-[1px] border-none' />

                <div>
                    <p className='text-neutral-700 underline mt-3'>CONTACT INFORMATION</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-1 mt-3 text-neutral-700'>
                        <p className='font-medium text-lg'>Email id:</p>
                        <p className='text-blue-500 text-lg text-left'>{userData.email}</p>
                        <p className='font-medium text-lg '>Phone:</p>
                        {
                            isEdit
                                ? < input className='bg-gray-100 max-w-52 text-lg' type='text' value={phone} onChange={e => setPhone(e.target.value)} />
                                : <p className='text-blue-500 text-lg text-left'>{userData.phone}</p>
                        }
                    </div>
                </div>



                <div className='mt-10'>
                    {isEdit
                        ? <button onClick={handleUpdate} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' > Save information</button>
                        : <button className='border bg-amber-200 text-gray-800 px-8 py-2 rounded-full hover:bg-primary  hover:text-white transition-all' onClick={() => setIsEdit(true)}> Edit for phone number</button>}


                </div>

            </div >
            <Footer />
        </>
    )
}

export default Profile