import React, { createContext, useContext, useState, useCallback } from 'react';
import { type ErrorWithAlertInfo } from './AlertInfo.js';

interface ErrorContextType {
  errors: ErrorWithAlertInfo[];
  addError: (err: ErrorWithAlertInfo) => void;
  removeError: (errorId: number) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorWithAlertInfo[]>([]);

  const addError = useCallback((err: ErrorWithAlertInfo) => {
    setErrors(prev => [...prev, err]);
  }, []);

  const removeError = useCallback((errorId: number) => {
    setErrors(prev => prev.filter(err => err.errorId !== errorId));
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
}; 