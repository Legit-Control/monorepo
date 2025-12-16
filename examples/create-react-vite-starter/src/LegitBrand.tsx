type HeaderProps = { handleShare: () => void };

export const LegitHeader = ({ handleShare }: HeaderProps) => {
  return (
    <div className="brand-header">
      <div className="brand-header__inner">
        <div className="brand-logos">
          <a href="https://legitcontrol.com" aria-label="Legit">
            <img alt="Legit Logo" src="/logo.svg" width={70} height={40} />
          </a>
          <span className="brand-divider">x</span>
          <a
            href="https://vite.dev"
            aria-label="Vite"
            className="brand-logo-pair"
          >
            <img alt="Vite Logo" src="/vite.svg" width={30} height={24} />
            <img alt="React Logo" src="/react.png" width={28} height={24} />
          </a>
        </div>
        <button
          onClick={handleShare}
          className="primary-button primary-button--dark"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export const LegitFooter = () => {
  const links = [
    { label: 'GitHub', href: 'https://github.com/legitcontrol/legit' },
    { label: 'Discord', href: 'https://discord.gg/34K4t5K9Ra' },
    { label: 'Docs', href: 'https://legitcontrol.com/docs/quickstart' },
  ];

  return (
    <div className="brand-footer">
      <div className="brand-footer__inner">
        <p className="brand-footer__note">
          This is made with{' '}
          <a className="brand-footer__highlight" href="https://legitcontrol.com">
            Legit
          </a>
          {' <3'}
        </p>
        <div className="brand-footer__links">
          {links.map(link => (
            <a key={link.href} href={link.href} className="brand-footer__link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
