/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';

// Component to detect OS and show appropriate download button
const DownloadButton = () => {
  const [os] = useState<string>(() => {
    if (typeof navigator === 'undefined') {
      return 'Mac';
    }

    const { userAgent } = navigator;

    if (userAgent.indexOf('Win') !== -1) {
      return 'Windows';
    }

    // Mac and Linux typically use the same binary
    return 'Mac';
  });

  if (!os) {
    // Show loading state or default to Mac
    return <span className="font-medium mr-2">Download for Mac.</span>;
  }

  return <span className="font-medium mr-2">Download for {os}.</span>;
};

const Index = () => (
  <div className="bg-white">
    {/* <Meta
      title="Collaboration Infrastructure for Human–AI Teams"
      description="We're building the tools to make AI a true collaborator with version control, conversational memory, and coordinated workflows. Inspired by Git. Built for the future of work."
      canonical="https://legit.control"
    /> */}
    {/* Header */}
    <div className="w-full flex items-center justify-between h-16 sm:h-24 max-w-[1350px] mx-auto px-4 sm:px-8">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" alt="Legit Logo" className="w-6 h-6" />
          <div className="font-medium text-xl">legit</div>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <div className="font-regular">
          updates
          <span className="font-medium text-zinc-500 bg-zinc-200 px-2 pb-0.5 rounded-full text-sm ml-2">
            soon
          </span>
        </div>
        {/* <div className="font-regular">imprint</div> */}
      </div>
    </div>
    {/* hero desktop */}
    <div className="hidden md:flex w-full flex-col items-center justify-center max-w-[1350px] mx-auto px-4 py-20">
      <div className="block md:grid grid-cols-12 w-full gap-5">
        <h1 className="col-start-3 col-end-11 text-3xl md:text-5xl font-bold leading-[1.2]">
          Collaboration Infrastructure for Human–AI Teams
        </h1>
        <div className="col-start-3 col-end-6 py-8">
          <div className="flex items-center">
            <span className="flex items-center justify-center text-xl h-10 w-10 bg-primary text-white mr-4">
              →
            </span>
            <DownloadButton />
            <span className="font-medium text-zinc-500 bg-zinc-200 px-2 pb-0.5 rounded-full text-sm">
              soon
            </span>
          </div>
        </div>
        <h3 className="col-start-6 col-end-11 text-xl py-8 leading-[1.7]">
          We&apos;re building the tools to make AI a true collaborator with
          version control, conversational memory, and coordinated workflows.
          Inspired by Git. Built for the future of work.
        </h3>
      </div>
    </div>
    {/* hero mobile */}
    <div className="flex md:hidden w-full flex-col justify-center max-w-[1350px] mx-auto px-4 py-12">
      <h1 className="col-start-3 col-end-11 text-3xl md:text-5xl font-bold leading-[1.2]">
        Collaboration Infrastructure for Human–AI Teams
      </h1>
      <h3 className="col-start-6 col-end-11 text-xl py-8 leading-[1.7]">
        We&apos;re building the tools to make AI a true collaborator with
        version control, conversational memory, and coordinated workflows.
        Inspired by Git. Built for the future of work.
      </h3>
      <div className="col-start-3 col-end-6 py-8">
        <div className="flex items-center">
          <span className="flex items-center justify-center text-xl h-10 w-10 bg-primary text-white mr-4">
            →
          </span>
          <DownloadButton />
          <span className="font-medium text-zinc-500 bg-zinc-200 px-2 pb-0.5 rounded-full text-sm">
            soon
          </span>
        </div>
      </div>
    </div>
    {/* visual */}
    <div className="bg-zinc-50 w-full flex flex-col items-center py-48 md:py-20 justify-center max-w-[1350px] mx-auto px-4">
      <img
        className="rotate-90 md:rotate-0 max-w-[800px] w-[160%] md:w-full"
        src="/schematic_large.png"
        alt="hero"
      />
    </div>
    {/* prolog */}
    <div className="w-full flex flex-col items-center justify-center max-w-[1350px] mx-auto px-4 py-20">
      <div className="block md:grid grid-cols-12 w-full gap-5">
        <h2 className="col-start-3 col-end-6 text-xl font-bold leading-[1.5] mb-4">
          Beyond Prompts: Building the Future of Human-AI Collaboration
        </h2>
        <div className="col-start-6 col-end-11 flex flex-col gap-4">
          <p className="leading-[1.7]">
            AI is evolving at an astonishing pace—writing, designing,
            suggesting, even reasoning. Yet our conversations with it still feel
            one‑dimensional: you issue a prompt, it replies, and then everything
            resets. No memory. No context. No trace of how we arrived where we
            are. That isn&apos;t collaboration—it&apos;s pure output.
          </p>
          <p className="leading-[1.7]">
            True collaboration demands structure. It means guiding the thought
            process from broad concept down to fine detail, surfacing
            what&apos;s happening now and what came before, and handing over the
            full narrative so that every participant—human or machine—knows
            exactly where we stand and why. Whether it&apos;s AI talking to AI,
            human talking to human, or AI and human working side by side, the
            key is a shared framework for exchanging knowledge, taking action,
            and reviewing decisions.
          </p>
          <p className="leading-[1.7]">
            We believe three pillars will transform AI from an isolated
            generator into a genuine partner:
          </p>
        </div>
        <h3 className="text-lg leading-[1.5] mb-2 mt-16 md:mt-0 col-start-3 col-end-6">
          Version Control
        </h3>
        <div className="col-start-6 col-end-11">
          <p className="leading-[1.7]">
            Just as scientists record every hypothesis and software teams track
            every change, AI-generated work needs complete version histories—not
            only of final deliverables, but of the thinking, the
            &quot;what,&quot; &quot;why,&quot; and &quot;when&quot; behind every
            edit.
          </p>
        </div>
        <h3 className="text-lg leading-[1.5] mb-2 mt-16 md:mt-0 col-start-3 col-end-6">
          Conversation Context
        </h3>
        <div className="col-start-6 col-end-11 flex flex-col gap-4">
          <p className="leading-[1.7]">
            Interfaces must build memory and reasoning into their very fabric,
            so you can follow—and challenge—each step of the journey, not just
            the destination.
          </p>
        </div>
        <h3 className="text-lg leading-[1.5] mb-2 mt-16 md:mt-0 col-start-3 col-end-6">
          Coordinated Workflows
        </h3>
        <div className="col-start-6 col-end-11 flex flex-col gap-4">
          <p className="leading-[1.7]">
            AI lives in ecosystems of people, machines, and rules. We need tools
            to orchestrate that complexity, overseeing permissions,
            dependencies, and interactions at scale.
          </p>
          <p className="leading-[1.7]">
            We draw inspiration from Git—not for its file storage, but for its
            cultural impact on collaboration. Git taught developers to work
            asynchronously, contextually, and transparently; it made large-scale
            projects manageable. That&apos;s exactly the mindset we need to make
            AI a true teammate.
          </p>
          <p className="leading-[1.7]">
            We&apos;re beginning this journey in research, but our ambition
            extends far beyond. We aim to build real infrastructure—and,
            ultimately, products—that weave AI seamlessly into the way we work,
            iterate, and evolve ideas over time. If you believe this future is
            worth building, join us.
          </p>
        </div>
      </div>
    </div>
    {/* <BlogGallery posts={props.posts} pagination={props.pagination} /> */}
    {/* footer */}
    <div
      style={{
        height: (() => {
          // Calculate the width of the text "legit" at 360px font size
          // This is an approximation - for more precision, you'd measure in useEffect
          const text = 'legit';
          const fontSize = 300;
          const approximateCharWidth = fontSize * 0.421; // Rough estimate for Aspekta font
          return `${text.length * approximateCharWidth}px`;
        })(),
      }}
      className="relative w-full flex bg-primary flex-col max-w-[1350px] mx-auto px-4 overflow-hidden"
    >
      <div className="p-8 flex flex-col justify-between sm:h-full text-white">
        <div className="flex flex-col gap-4">
          <Link href="/">
            <div className="font-regular cursor-pointer">home</div>
          </Link>
          <div className="font-regular">
            updates
            <span className="font-medium text-zinc-950 bg-white/50 px-2 pb-0.5 rounded-full text-sm ml-2">
              soon
            </span>
          </div>
          {/* <div className="font-regular">imprint</div> */}
        </div>
        <p className="font-regular mt-8 sm:mt-0">© legit control 2025</p>
      </div>
      <div className="absolute top-[0%] right-0 text-black font-bold rotate-[-90deg] text-[300px] h-[155px] translate-y-[600px] sm:translate-y-[242px]">
        legit
      </div>
    </div>
  </div>
);

// export const getStaticProps: GetStaticProps<IBlogGalleryProps> = async () => {
//   const posts = getAllPosts(['title', 'date', 'slug']);
//   const pagination: IPaginationProps = {};

//   if (posts.length > AppConfig.pagination_size) {
//     pagination.next = '/page2';
//   }

//   return {
//     props: {
//       posts: posts.slice(0, AppConfig.pagination_size),
//       pagination,
//     },
//   };
// };

export default Index;
