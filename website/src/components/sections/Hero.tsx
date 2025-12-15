import {
  CircleStackIcon,
  ArchiveBoxArrowDownIcon,
  ArrowUturnLeftIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/16/solid';
import Font from '../Font';
import PrimaryButton from '../PrimaryButton';
import SmallGrid from '../SmallGrid';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const data = {
  title: (
    <>
      Make Agents a <br />
      <b className="text-primary">Safe Collaborator</b> <br />
      in your App
    </>
  ),
  description: (
    <>
      Let AI edit, generate, and refactor — with automatic versioning, diffing,
      and rollback for every change.
    </>
  ),
  main_button: {
    title: 'Get started',
    link: '/docs/quickstart',
  },
  secondary_buttons: [
    {
      title: (
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.532 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </div>
      ),
      link: 'https://github.com/legit-control/monorepo',
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          Discord
        </div>
      ),
      link: 'https://discord.gg/34K4t5K9Ra',
    },
  ],
  tag: {
    label: '⭑ Give a Star on GitHub',
    href: 'https://github.com/legit-control/monorepo',
  },
  benefits: [
    {
      title: 'Track Changes',
      description:
        'Tracks any changes that are made to any of your data or applications',
      icon: <ArchiveBoxArrowDownIcon />,
    },
    {
      title: 'Revert Mistakes',
      description:
        'Revert mistakes and Rollback to any point in time in the history',
      icon: <ArrowUturnLeftIcon />,
    },
    {
      title: 'Collaborattion',
      description:
        'Allows collaboration between; users to users to agents to agents.  ',
      icon: <ChatBubbleLeftRightIcon />,
    },
    {
      title: 'Any File format',
      description:
        'Works with any file format, from JSON to SQLite to Word to XLSX',
      icon: <CircleStackIcon />,
    },
  ],
};

const Hero = () => {
  return (
    <SmallGrid className="pt-14">
      <div className="col-span-12 lg:col-span-5 lg:col-start-2">
        <a
          href={data.tag.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group font-mono text-sm text-zinc-800 border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 transition-all duration-100 flex items-center gap-2 w-fit"
        >
          <p>
            <span className="text-zinc-400 group-hover:text-black">
              {'// '}
            </span>{' '}
            {data.tag.label}
          </p>
          <ArrowUpRightIcon className="w-4 h-4" />
        </a>
        <Font type="h1" className="mt-8">
          {data.title}
        </Font>
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-8 flex flex-col justify-end h-full">
        <Font type="p" className="text-zinc-500 mb-6 mt-4">
          {data.description}
        </Font>
        {/* TODO remove the second github button and just keep the star button */}
        <div className="flex items-center gap-3 mb-6">
          {data.secondary_buttons.map((button, i) => (
            <a
              key={
                typeof button.title === 'string'
                  ? button.title
                  : `secondary-button-${i}`
              }
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group font-mono text-sm text-zinc-800 border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 transition-all duration-100 flex items-center gap-2 w-fit"
            >
              <p className="flex items-center gap-2">
                <span className="text-zinc-400 group-hover:text-black">
                  {'// '}
                </span>{' '}
                {button.title}
              </p>
              <ArrowUpRightIcon className="w-4 h-4" />
            </a>
          ))}
        </div>
        <PrimaryButton href={data.main_button.link}>
          {data.main_button.title}
        </PrimaryButton>
      </div>
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 flex flex-wrap gap-x-4 gap-y-12 mt-24">
        {data.benefits.map(benefit => (
          <div className="flex-1 min-w-[200px] gap-4" key={benefit.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-4">{benefit.icon}</span>
              <Font type="h4">{benefit.title}</Font>
            </div>
            <Font type="ps" className="text-zinc-500 pr-12">
              {benefit.description}
            </Font>
          </div>
        ))}
      </div>
    </SmallGrid>
  );
};

export default Hero;
