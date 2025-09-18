import { toast, type ExternalToast } from "sonner";
import React from 'react'; // Required for JSX in toast options

export const showSuccess = (message: string, options?: ExternalToast) => {
  toast.success(message, options);
};

export const showError = (message: string, options?: ExternalToast) => {
  toast.error(message, options);
};

export const showLoading = (message: string, options?: ExternalToast) => {
  return toast.loading(message, options);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};