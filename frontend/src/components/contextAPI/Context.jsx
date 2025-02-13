// contexts/receiverContext.js
import React, { createContext, useState } from "react";

// Context for receiverId
export const ReceiverIdContext = createContext();

// Context for receiverName
export const ReceiverNameContext = createContext();

// Provider component for both contexts
export const ReceiverProvider = ({ children }) => {
    const [receiverId, setReceiverId] = useState(""); // Initial state for receiverId
    const [receiverName, setReceiverName] = useState(""); // Initial state for receiverName

    return (
        <ReceiverIdContext.Provider value={[receiverId, setReceiverId]}>
            <ReceiverNameContext.Provider value={[receiverName, setReceiverName]}>
                {children}
            </ReceiverNameContext.Provider>
        </ReceiverIdContext.Provider>
    );
};