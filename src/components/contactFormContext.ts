import { createContext, useContext } from 'react';

export const OpenContactFormContext = createContext<() => void>(() => {});

/** Returns a function that opens the contact form dialog. */
export const useOpenContactForm = () => useContext(OpenContactFormContext);
