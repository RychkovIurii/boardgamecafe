// import React, {useEffect, useState} from 'react'
// import { useParams } from 'react-router-dom'
// import { serviceMenu } from '../assets/image_assets/assets';

// const ServiceType = () => {

//     const {serviceId} = useParams();
//     const [serviceInfo, setServiceInfo] = useState(false)

//     const fetchServiceInfo = async () => {

//         serviceMenu.map((item) => {
//             if (item._id === serviceId) {
//                 setServiceInfo(item)
//                 console.log();
//                 return null;
//             }
//         })
//     }
    
//     useEffect(()=> {
//         fetchServiceInfo();
//     }, [serviceId, serviceMenu])

//   return (
//     <div>
      
//     </div>
//   )
// }

// export default ServiceType
