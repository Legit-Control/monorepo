"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React from "react";

const Accordion = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full divide-y divide-zinc-200 rounded-md">
            {children}
        </div>
    );
};

const AccordionItem = ({ question, answer }: { question: string; answer: string | React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 py-4 text-left text-zinc-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
                <span className="text-base font-medium">{question}</span>
                <ChevronDownIcon className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
            </button>
            {open && (
                <div className="pb-4 pt-4 pr-12 text-base text-zinc-600 leading-8" dangerouslySetInnerHTML={{ __html: answer as string }} />
            )}
        </div>
    );
};

export { Accordion, AccordionItem };