import {  toast } from 'react-toastify';

export function toastSuccess(msg){
    toast.success(msg, {
      position: "top-center",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
// transition: Bounce,
        });
}
export function toastError(msg){
    toast.error(msg, {
   position: "top-center",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
// transition: Bounce,
        });
}
