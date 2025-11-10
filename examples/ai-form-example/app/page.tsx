'use client';

import { SignupForm } from '@/components/SignupForm';
import { AssistantSidebar } from '@/components/assistant-ui/assistant-sidebar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAssistantForm } from '@assistant-ui/react-hook-form';
import { useAssistantInstructions } from '@assistant-ui/react';
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
  const lastSnapshotRef = useRef<string | null>(null);

  const queuePersistFormState = useCallback((values: unknown) => {
    const snapshot = JSON.stringify(values);

    if (snapshot === lastSnapshotRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      lastSnapshotRef.current = snapshot;
      try {
        await fetch('/api/forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formState: JSON.parse(snapshot),
          }),
        });
      } catch (error) {
        console.error('Failed to persist form state', error);
      }
    }, 400);
  }, []);

  useEffect(() => {
    const subscription = form.watch(values => {
      queuePersistFormState(values);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [form, queuePersistFormState]);

  const handleLogHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/forms/history');
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const history = await response.json();
      console.log('Form history', history);
    } catch (error) {
      console.error('Failed to fetch form history', error);
    }
  }, []);

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto flex-col p-8 gap-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <AssistantSidebar>
          <div className="h-full overflow-y-scroll">
            <main className="container p-8">
              <h1 className="mb-2 text-2xl font-semibold">AI Form</h1>
              <Button
                type="button"
                variant="secondary"
                className="mb-4"
                onClick={handleLogHistory}
              >
                Log Form History
              </Button>
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
