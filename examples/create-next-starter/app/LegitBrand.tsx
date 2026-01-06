import Image from 'next/image';
import Link from 'next/link';

export const LegitHeader = ({ handleShare }: { handleShare: () => void }) => {
  return (
    <div className="w-full border-b border-gray-200">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="https://legitcontrol.com">
            <Image alt="Legit Logo" src="/logo.svg" width={70} height={40} />
          </Link>
          <p className="text-sm text-gray-400">x</p>
          <Link href="https://nextjs.org">
            <Image alt="Next.js Logo" src="/nextjs.png" width={70} height={40} />
          </Link>
        </div>
        <button
          onClick={handleShare}
          className="bg-black text-white px-3 py-1 rounded-lg font-semibold hover:opacity-80 cursor-pointer disabled:opacity-50"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export const LegitFooter = () => {
  const links = [
    {
      label: 'GitHub',
      href: 'https://github.com/legitcontrol/legit',
    },
    {
      label: 'Discord',
      href: 'https://discord.gg/34K4t5K9Ra',
    },
    {
      label: 'Docs',
      href: 'https://legitcontrol.com/docs/quickstart',
    },
  ];
  return (
    <div className="w-full border-t border-gray-200 text-sm text-gray-600">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <p>
          This is made with{' '}
          <Link
            className="text-orange-400 font-semibold"
            href="https://legitcontrol.com"
          >
            Legit
          </Link>
          {' <3'}
        </p>
        <div className="flex gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
