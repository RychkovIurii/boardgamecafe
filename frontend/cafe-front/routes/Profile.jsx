import React, { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Profile = () => {

    const [userData, setUserData] = useState({})
    const [phone, setPhone] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get('/users/profile');
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
        // Validate phone number format.
        if (!isValidPhoneNumber(phone)) {
            await Swal.fire({
                icon: 'warning',
                title: t('alerts.invalidPhoneTitle'),
                text: t('alerts.invalidPhoneText'),
                confirmButtonText: 'OK'
            });
            return;
        }
        try {
            await API.put('/users/phone', { phone });
            await Swal.fire({
                icon: 'success',
                title: t('alerts.updateSuccessTitle'),
                text: t('alerts.updateSuccessText'),
                confirmButtonText: 'OK'
            });

            //Fetch the latest data again after the update
            const response = await API.get('/users/profile');
            setUserData(response.data);
            setPhone(response.data.phone);
            setIsEdit(false);
        } catch (error) {
            console.error('Error updating phone number:', error);
            await Swal.fire({
                icon: 'error',
                title: t('alerts.updateErrorTitle'),
                text: t('alerts.updateErrorText'),
                confirmButtonText: 'OK'
            });
        }
    };


    return (
        <>
            <Navbar />
            <div className="py-20 max-w-4xl mx-auto">
                <h1 className="text-outline text-3xl md:text-4xl lg:text-5xl font-medium text-yellow-500 mt-5 mb-10">{t('profile.pageTitle')}</h1>
                <div className='flex flex-col gap-2 mt-5 '>

                    <p className='font-medium text-2xl text-neutral-800 mt-4'>{userData.name}</p>
                    <hr className='bg-zinc-400 h-[2px] border-none w-1/2 mx-auto ' />

                    <div>
                        <div className='flex flex-row gap-y-1 mt-7 text-neutral-700 justify-center'>
                            <p className='font-medium text-lg justify-center'>{t('profile.emailLabel')}</p>
                            <p className='pl-5 text-blue-500 text-lg justify-center'>{userData.email}</p> </div>
                        <div className='flex flex-row gap-y-1 mt-7 text-neutral-700 justify-center'>
                            <p className='font-medium text-lg '>{t('profile.phoneLabel')}</p>
                            {
                                isEdit
                                    ? < input className=' pl-10 bg-gray-100 max-w-52 text-lg' type='text' value={phone} onChange={e => setPhone(e.target.value)} />
                                    : <p className=' pl-10 text-blue-500 text-lg'>{userData.phone}</p>
                            }
                        </div>


                    </div>



                    <div className='mt-10 mb-20'>
                        {isEdit
                            ? <button onClick={handleUpdate} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' >{t('profile.saveButton')}</button>
                            : <button className='border bg-amber-200 text-gray-800 px-8 py-2 rounded-full hover:bg-primary  hover:text-white transition-all' onClick={() => setIsEdit(true)}>{t('profile.editButton')}</button>}


                    </div>

                </div >
            </div >
            <Footer />
        </>
    )
}

export default Profile
