import { toast, type ExternalToast } from "sonner";
import React from 'react'; // Required for JSX in toast options

// Define a custom type that extends ExternalToast to explicitly include React.ReactNode for icon
interface ToastOptionsWithIcon extends ExternalToast {
  icon?: React.ReactNode;
}

export const showSuccess = (message: string, options?: ToastOptionsWithIcon) => {
  toast.success(message, options);
};

export const showError = (message: string, options?: ToastOptionsWithIcon) => {
  toast.error(message, options);
};

export const showLoading = (message: string, options?: ExternalToast) => {
  return toast.loading(message, options);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};