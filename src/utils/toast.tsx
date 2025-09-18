import { toast, type ExternalToast } from "sonner";
import { Check, X } from 'lucide-react'; // Import icons

// Define a custom type that extends ExternalToast to explicitly include React.ReactNode for icon
// Note: sonner's ExternalToast already supports React.ReactNode for icon, so we can simplify this.

export const showSuccess = (message: string, options?: ExternalToast) => {
  toast.success(message, {
    icon: <Check className="h-4 w-4" />, // Default success icon
    ...options,
  });
};

export const showError = (message: string, options?: ExternalToast) => {
  toast.error(message, {
    icon: <X className="h-4 w-4" />, // Default error icon
    ...options,
  });
};

export const showLoading = (message: string, options?: ExternalToast) => {
  return toast.loading(message, options);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};