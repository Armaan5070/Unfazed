import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type,
        });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div className="fixed right-5 top-5 z-50">
                    <div
                        className={`min-w-[280px] rounded-md px-5 py-4 shadow-lg ${
                            toast.type === "error"
                                ? "bg-red-600 text-white"
                                : "bg-black text-white"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm">
                                {toast.message}
                            </p>

                            <button
                                onClick={() => setToast(null)}
                                className="text-lg leading-none text-gray-300 hover:text-white"
                            >
                                
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}