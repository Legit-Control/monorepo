'use client';

import { SignupForm } from '@/components/SignupForm';
import { AssistantSidebar } from '@/components/assistant-ui/assistant-sidebar';
import { Form } from '@/components/ui/form';
import { useAssistantForm } from '@assistant-ui/react-hook-form';
import { useAssistantInstructions } from '@assistant-ui/react';
import { useEffect } from 'react';
import { CloudMessageWithoutId, useLegitFs } from '@legit-sdk/assistant-ui';
import { CheckIcon } from 'lucide-react';
import { AssistantFormProvider } from '@/lib/assistantFormContext';

const SetFormFieldTool = () => {
  return (
    <p className="text-[14px] font-medium text-gray-400 flex items-center gap-2">
      <CheckIcon className="w-4 h-4 inline-block" />
      Update field
    </p>
  );
};

const SubmitFormTool = () => {
  return (
    <p className="text-center font-mono text-sm font-bold text-blue-500">
      Submitting the form...
    </p>
  );
};

export default function Home() {
  useAssistantInstructions("Help users sign up for Simon's hackathon.");
  const form = useAssistantForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      cityAndCountry: '',
    },
    assistant: {
      tools: {
        set_form_field: {
          render: SetFormFieldTool,
        },
        submit_form: {
          render: SubmitFormTool,
        },
      },
    },
  });

  const formValues = form.watch();
  const legit = useLegitFs();

  useEffect(() => {
    const saveFormValues = async () => {
      await legit.saveData('/form-values.json', JSON.stringify(formValues));
    };
    saveFormValues();
  }, [formValues, legit.saveData]);

  return (
    <AssistantFormProvider form={form}>
      <div className="flex min-h-screen max-w-6xl mx-auto flex-col p-8 gap-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <AssistantSidebar>
            <div className="h-full overflow-y-scroll">
              <main className="container p-8">
                <h1 className="mb-2 text-2xl font-semibold">AI Form</h1>
                <Form {...form}>
                  <SignupForm />
                </Form>
              </main>
            </div>
          </AssistantSidebar>
        </div>
      </div>
    </AssistantFormProvider>
  );
}
