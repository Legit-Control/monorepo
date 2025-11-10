'use client';

import { SignupForm } from '@/components/SignupForm';
import { AssistantSidebar } from '@/components/assistant-ui/assistant-sidebar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useLegitApi } from '@/lib/legit/context';
import { useAssistantInstructions } from '@assistant-ui/react';
import { useAssistantForm } from '@assistant-ui/react-hook-form';
import { useCallback, useEffect, useRef } from 'react';

const SetFormFieldTool = () => {
  return (
    <p className="text-center font-mono text-sm font-bold text-blue-500">
      set_form_field(...)
    </p>
  );
};

const SubmitFormTool = () => {
  return (
    <p className="text-center font-mono text-sm font-bold text-blue-500">
      submit_form(...)
    </p>
  );
};

export default function Home() {
  useAssistantInstructions("Help users sign up for Simon's hackathon.");
  const legit = useLegitApi();
  const form = useAssistantForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      cityAndCountry: '',
      projectIdea: '',
      proficientTechnologies: '',
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

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queuePersistForm = useCallback(
    (values: Record<string, unknown>) => {
      if (!legit) return;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      const snapshot = { ...values };
      saveTimeoutRef.current = setTimeout(() => {
        void legit.saveForm(snapshot);
      }, 300);
    },
    [legit]
  );

  useEffect(() => {
    if (!legit) {
      return;
    }

    const subscription = form.watch(values => {
      queuePersistForm(values as Record<string, unknown>);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [form, legit, queuePersistForm]);

  const handleLogHistory = useCallback(async () => {
    if (!legit) return;
    const history = await legit.getHistory();
    console.log('Legit history', history);
  }, [legit]);

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto flex-col p-8 gap-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <AssistantSidebar>
          <div className="h-full overflow-y-scroll">
            <main className="container p-8">
              <h1 className="mb-2 text-2xl font-semibold">AI Form</h1>
              <div className="mb-4 flex items-center justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLogHistory}
                  disabled={!legit}
                >
                  Log Form History
                </Button>
              </div>
              <Form {...form}>
                <SignupForm />
              </Form>
            </main>
          </div>
        </AssistantSidebar>
      </div>
    </div>
  );
}
