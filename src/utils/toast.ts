import toast from "react-hot-toast";
import type { ToastOptions } from "react-hot-toast";

export const toastOptions: ToastOptions = {
  duration: 3500,
  style: {
    borderRadius: "10px",
    fontSize: "14px",
  },
};

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: "#10B981",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
      ...options,
    }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: "#EF4444",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
      },
      ...options,
    }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: "#3B82F6",
        color: "#fff",
      },
      icon: "ℹ️",
      ...options,
    }),
};

