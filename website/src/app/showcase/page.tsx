import Font from '@/components/Font';
import PageGrid from '@/components/Grid';
import SmallGrid from '@/components/SmallGrid';
import { ContentCard } from '@/components/ContentCard';

const data = {
  title: 'Explore Showcases built with the Legit SDK',
  description:
    'Discover real-world examples and implementations of Legit SDK. See how developers are using version control for AI-powered applications.',
};

const showcasePage = () => {
  // Descriptions are truncated to 138 characters in the card component
  const showcaseItems = [
    {
      href: 'https://legit-assistant-form-example.vercel.app/',
      title: 'Assistant UI',
      description:
        'Interactive example of Assistant UI + Legit where chat updates the form and shows live diffs directly in the conversation.',
      image: '/showcase/AssistantUi.png',
      date: 'Nov. 2025',
      author: 'Legit Team',
    },
    {
      href: 'https://legit-starter-react.vercel.app/',
      title: 'Legit React Starter',
      description:
        'React starter template powered by Legit SDK—edit files, track versions, view history, all built for fast, reactive dev workflows.',
      image: '/showcase/LegitReactStarter.png',
      date: 'Nov. 2025',
      author: 'Legit Team',
    },
    {
      href: 'https://legit-react-example-sync-phcl.vercel.app/',
      title: 'Legit React Sync example',
      description:
        'Example of Legit React with sync functionality.',
      image: '/showcase/LegitReactSync.png',
      date: 'Nov. 2025',
      author: 'Legit Team',
    },
    {
      href: 'https://replit.com/@jannes-blobel/Legit-x-Plate-Template',
      title: 'Replit x Legit x Plate Template',
      description:
        'Boilerplate for running Legit and Plate on Replit with built-in versioning, editing, and project scaffolding.',
      image: '/showcase/LegitPlateReplit.png',
      date: 'Nov. 2025',
      author: 'Legit Team',
    },
    {
      href: 'https://github.com/Legit-Control/webMCP-exploration',
      title: 'Legit x WebMCP exploration',
      description:
        'Example of Legit with WebMCP integration.',
      image: '/showcase/LegitxWebMCP.png',
      date: 'Nov. 2025',
      author: 'Legit Team + Alex Nahas',
    },
    {
      href: 'https://discord.gg/34K4t5K9Ra',
      title: 'Add your Own Showcase',
      description:
        'Want to showcase your project? Reach out on Discord to get featured.',
      image: '/showcase/WeAreWaitingForYou.png',
      date: 'Nov. 2025',
      author: 'Legit Team',
    },
  ];

  // Sort by date (newest first)
  const sortedItems = [...showcaseItems].sort((a, b) => {
    const parseDate = (dateStr: string) => {
      // Parse format like "Nov. 2025" or "Nov 2025"
      const parts = dateStr.trim().split(/[\s.]+/);
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = monthNames.indexOf(parts[0]);
      const year = parseInt(parts[1] || '0');
      return new Date(year, month || 0);
    };

    const dateA = parseDate(a.date || '');
    const dateB = parseDate(b.date || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });

  return (
    <PageGrid>
      <SmallGrid className="pt-16">
        <Font type="h1" className="col-span-12 lg:col-span-6 lg:col-start-2">
          {data.title}
        </Font>

        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <Font type="p" className="text-zinc-500 mb-6 mt-4">
            {data.description}
          </Font>
        </div>
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {sortedItems.map(item => (
            <div key={item.href} className="h-full">
              <ContentCard
                href={item.href}
                title={item.title}
                description={item.description}
                image={item.image}
                date={item.date}
                author={item.author}
              />
            </div>
          ))}
        </div>
      </SmallGrid>
    </PageGrid>
  );
};

export default showcasePage;
