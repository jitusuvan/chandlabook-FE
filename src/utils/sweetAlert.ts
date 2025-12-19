import Swal from 'sweetalert2';

export const confirmDelete = async (message?: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: message || "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });
  
  return result.isConfirmed;
};

export const showSuccess = (message: string) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#28a745'
  });
};

export const showError = (message: string) => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#dc3545'
  });
};

export const confirmAction = async (title: string, text?: string): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, proceed!'
  });
  
  return result.isConfirmed;
};