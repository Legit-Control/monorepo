/* eslint-disable @next/next/no-img-element */
import {
  MapPinIcon,
  ListBulletIcon,
  KeyIcon,
  ArrowTurnDownRightIcon,
} from '@heroicons/react/16/solid';
import Font from '../Font';
import SmallGrid from '../SmallGrid';

const data = {
  title: (
    <>
    Infrastructure for
    
     <span className="text-primary"> AI-native applications</span>
    </>
  ),
  description: (
    <>
      <b className="text-black">
        From undo-redo to rollback , branching to experiments, sync and more.
      </b>{' '}
      Deliver reliability and collaboration without building your own version
      control and powered by Git.
    </>
  ),
  caption: 'Features',
  primaryFeature: {
    title: 'Version History',
    description: (
      <>
        <b className="text-black">
          Let your user move through the entire history like a living timeline.
        </b>{' '}
        They can jump back to previous moments, explore past states, and restore
        them instantly.
      </>
    ),
    image: '/timetravel.svg',
  },
  secondaryFeatures: [
    {
      title: 'Branch Experiments',
      description: (
        <>
          <b className="text-black">
            Give users the power of Branches &rarr; an isolated workspace for 
            <span className="text-primary"> AI experiments</span>.
          </b>
          <br />
        
          Let users run agents in parallel branches, compare diffs, and merge only what they want back into the original document.
        </>
      ),
      image: '/branch.svg',
    },
    {
      title: 'Rollback Anytime',
      description: (
        <>
          Let User recover from AI mistakes. Instantly undo, restore any earlier version, and stay fully in control of AI-assisted changes
          <b className="text-black"> stay fully in control of AI-assisted changes. </b>
         

        </>
      ),
      image: '/rollback.svg',
    },
  ],
  tertiaryFeatures: [
    {
      title: 'Local-First Sync',
      description: 'Start local and sync seamlessly across all devices later.',
      icon: <MapPinIcon />,
    },
    {
      title: 'Audit Trail',
      description:
        'Every change is tracked with full context and accountability.',
      icon: <ListBulletIcon />,
    },
    {
      title: 'Access Control',
      description: 'Control who can view or edit your data.',
      icon: <KeyIcon />,
    },
    {
      title: 'Rules & Triggers',
      description:
        'Define rules and triggers that run whenever AI or users modify data.',
      icon: <ArrowTurnDownRightIcon />,
    },
  ],
};

const Features = () => {
  return (
    <SmallGrid>
      <Font
        type="mono"
        className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-2"
      >
        {data.caption}
      </Font>
      <Font type="h2" className="mb-4 col-span-12 lg:col-span-8 lg:col-start-2">
        {data.title}
      </Font>
      <Font
        type="p"
        className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-2"
      >
        {data.description}
      </Font>
      <div className="col-span-12 lg:col-span-6 lg:col-start-2 my-12 w-full">
        <img
          src={data.primaryFeature.image}
          alt={data.primaryFeature.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hidden md:block col-span-12 lg:col-span-3 lg:col-start-9 my-12 lg:my-auto">
        <Font type="h3">{data.primaryFeature.title}</Font>
        <Font className="text-zinc-500 pt-4" type="p">
          {data.primaryFeature.description}
        </Font>
      </div>
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 bg-zinc-100 h-px" />
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 flex justify-between flex-col md:flex-row">
        <div className="flex-1 mt-12 mb-16 md:mb-32">
          <Font type="h3">{data.secondaryFeatures[0].title}</Font>
          <Font className="text-zinc-500 pt-4 sm:pr-16" type="p">
            {data.secondaryFeatures[0].description}
          </Font>
          <img
            src={data.secondaryFeatures[0].image}
            alt={data.secondaryFeatures[0].title}
            className="w-full h-full object-fit"
          />
        </div>
        <div className="bg-zinc-100 w-px h-[calc(100%+1rem)] -mt-2 mx-12" />
        <div className="flex-1 mt-12 mb-16 md:mb-32">
          <Font type="h3">{data.secondaryFeatures[1].title}</Font>
          <Font className="text-zinc-500 pt-4 sm:pr-16" type="p">
            {data.secondaryFeatures[1].description}
          </Font>
          <img
            src={data.secondaryFeatures[1].image}
            alt={data.secondaryFeatures[1].title}
            className="w-full h-full object-fit"
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 bg-zinc-100 h-px" />
      <div className="my-12 col-span-12 lg:col-span-10 lg:col-start-2 flex flex-wrap gap-x-4 gap-y-8">
        {data.tertiaryFeatures.map(feature => (
          <div className="flex-1 min-w-[200px] gap-4" key={feature.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-4">{feature.icon}</span>
              <Font type="h4">{feature.title}</Font>
            </div>
            <Font type="ps" className="text-zinc-500 pr-12">
              {feature.description}
            </Font>
          </div>
        ))}
      </div>
    </SmallGrid>
  );
};

export default Features;
