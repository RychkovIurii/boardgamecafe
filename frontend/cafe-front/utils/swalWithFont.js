import Swal from 'sweetalert2';

const swalWithFont = Swal.mixin({
    confirmButtonColor: '#065f46', // Tailwind bg-green-800
    cancelButtonColor: '#374151',  // Tailwind bg-gray-700
    customClass: {
      popup: 'swal-custom-font'
    }
});

export default swalWithFont;
