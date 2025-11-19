'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

type AssistantFormContextValue = UseFormReturn<any>;

const AssistantFormContext = createContext<AssistantFormContextValue | null>(
  null
);

type AssistantFormProviderProps = {
  form: AssistantFormContextValue;
  children: ReactNode;
};

export function AssistantFormProvider({
  form,
  children,
}: AssistantFormProviderProps) {
  return (
    <AssistantFormContext.Provider value={form}>
      {children}
    </AssistantFormContext.Provider>
  );
}

export function useSharedAssistantForm() {
  const context = useContext(AssistantFormContext);
  if (!context) {
    throw new Error(
      'useSharedAssistantForm must be used within an AssistantFormProvider'
    );
  }
  return context;
}
