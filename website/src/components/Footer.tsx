import Link from "next/link";
import Font from "./Font";
import Logo from "./Logo";

const Footer = () => {

  type LinksType = {
    label: string;
    href: string;
  }

  const links: { [key: string]: LinksType[] } = {
    "Documentation": [
      {
        label: "Introduction",
        href: "/docs",
      },
      {
        label: "Quickstart",
        href: "/docs/quickstart",
      },
      {
        label: "Concepts",
        href: "/docs/concepts/problem",
      },
      {
        label: "Examples",
        href: "/docs/examples",
      },
      {
        label: "FAQ",
        href: "/docs/faq",
      },
      {
        label: "Style Guide",
        href: "/docs/styleguide",
      }
    ],
    "Resources": [
      {
        label: "Vision",
        href: "/vision",
      },
      {
        label: "Documentation",
        href: "/docs",
      },
      {
        label: "SDK",
        href: "/",
      },
    ],
    "Community": [
      {
        label: "Discord",
        href: "https://discord.gg/34K4t5K9Ra",
      },
      
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/legit-control",
      },
       {
        label: "Twitter",
        href: "https://twitter.com/legitcontrol",
      },
      {
        label: "Github",
        href: "https://github.com/legit-control/monorepo",
      },
      {
        label: "Get in touch",
        href: "mailto:hello@legitcontrol.com",
      }
    ]
  }


  return (
    <div className="pb-0 xl:pb-16">
      <div
        className="relative w-full gap-12 lg:gap-0 flex flex-col items-end lg:items-stretch lg:flex-row bg-primary max-w-[1390px] overflow-hidden mt-24 mx-auto"
      >
        <div className="p-8 flex flex-col lg:flex-row lg:flex-1 gap-8 lg:gap-20 w-full">
          <div className="flex flex-col justify-between">
            <Link href="/" className="font-regular cursor-pointer mb-2">
              <Logo onDarkSurface />
            </Link>
            <Font type="p" className="text-white mb-12 lg:mb-0">© Legit Control 2025</Font>
          </div>
          {Object.entries(links).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2">
              <Font type="p" className="text-white mb-2"><b>{key}</b></Font>
              {value.map((link) => (
                <div key={link.label} className="relative group">
                  <Link href={link.href} className="cursor-pointer text-white/70 group-hover:text-white transition-all duration-200">{link.label}</Link>
                  <div className="absolute top-[50%] translate-y-[-50%] -translate-x-5 left-0 w-2 h-2 rounded-full bg-white/0 group-hover:bg-white transition-all duration-200" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <LegitText />
      </div>
    </div>
  )
}

export default Footer


const LegitText = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="231"
      height="574"
      fill="none"
      viewBox="0 0 231 574"
    >
      <path
        fill="#000"
        d="M.717 573.442v-38.904h142.565v-82.979H178v121.883zm180.238-197.803q0 20.19-8.618 34.964-8.619 14.528-23.884 22.406-15.266 7.633-34.472 7.633-19.205 0-34.472-7.633-15.265-7.878-23.884-22.406-8.618-14.774-8.618-34.964 0-30.779 18.96-47.768 18.96-17.236 51.707-17.236h7.387v94.797q13.543-2.215 21.176-9.849 7.386-7.634 7.387-19.944 0-20.438-15.02-28.07v-34.718q19.452 6.154 31.024 22.653 11.327 16.497 11.327 40.135m-80.024-29.548q-12.558 2.709-19.452 10.342-7.14 7.633-7.14 19.206t7.14 19.205q6.894 7.633 19.452 10.096zM230.2 232.59q0 27.577-12.311 42.844-12.066 15.266-33.487 16.497v-35.457q18.22-1.97 18.221-25.361 0-12.558-6.156-20.683-6.156-8.372-21.668-8.372h-16.005q17.236 13.296 17.236 38.165 0 17.975-8.125 30.779-8.371 12.557-22.899 19.205-14.774 6.402-33.487 6.402-18.468 0-32.995-6.402-14.773-6.648-23.145-19.205-8.372-12.804-8.372-30.779 0-25.854 18.467-39.15H49.962v-34.964h124.837q27.085 0 41.12 18.713Q230.2 203.29 230.2 232.59m-118.681 27.332q16.989 0 26.838-7.141 9.603-7.14 9.603-21.914t-9.603-21.914q-9.849-7.387-26.838-7.387t-26.593 7.387q-9.603 7.14-9.603 21.914t9.603 21.914 26.593 7.141M49.962 141.634v-36.195H178v36.195zm-49.245 0v-35.949h30.778v35.949zm9.849-109.845h39.396V.27h26.839V31.79h63.034q5.909 0 8.618-2.463 2.708-2.709 2.708-9.356V.27H178V29.82q0 18.22-7.141 28.316-7.386 9.849-27.331 9.849H76.801v21.914H49.962V67.984H10.566z"
      ></path>
    </svg>
  )
}
