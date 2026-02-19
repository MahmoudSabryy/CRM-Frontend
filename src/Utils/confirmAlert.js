import Swal from "sweetalert2";

export const confirmAlert = async ({
  title = "Are you sure?",
  text = "You won't be able to undo this!",
  confirmText = "Yes",
  cancelText = "No",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  return result.isConfirmed;
};
