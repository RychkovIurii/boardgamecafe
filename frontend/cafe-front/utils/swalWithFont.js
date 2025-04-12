import Swal from 'sweetalert2';

const swalWithFont = Swal.mixin({
  customClass: {
    popup: 'swal-custom-font'
  }
});

export default swalWithFont;
