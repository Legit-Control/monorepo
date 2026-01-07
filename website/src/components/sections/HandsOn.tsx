/* eslint-disable @next/next/no-img-element */
import Font from "../Font"
import Label from "../Label"
import PrimaryButton from "../PrimaryButton"
import SmallGrid from "../SmallGrid"
import SyntaxHighlighter from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import { ContentCard } from "../ContentCard";

const data = {
  title: "As easy as implementing read and write files.",
  description: <><b className="text-black">Everything is based on the filesystem API.</b> If you know how to read and write files, you already know how to use Legit SDK.</>,
  caption: "Examples",
  button: "Documentation",
  button_link: "/docs/quickstart",
  showcaseTitle: "See examples built with Legit SDK",
  showcaseItems: [
    {
      href: "https://legit-assistant-form-example.vercel.app/",
      title: "Assistant UI",
      description: "Interactive example of Assistant UI + Legit where chat updates the form and shows live diffs directly in the conversation.",
      image: "/showcase/AssistantUi.png",
      date: "Nov. 2025",
      author: "Legit Team"
    },
    {
      href: "https://legit-starter-react.vercel.app/",
      title: "Legit React Starter",
      description: "React starter template powered by Legit SDK—edit files, track versions, view history, all built for fast, reactive dev workflows.",
      image: "/showcase/LegitReactStarter.png",
      date: "Nov. 2025",
      author: "Legit Team"
    },
    {
      href: "https://replit.com/@jannes-blobel/Legit-x-Plate-Template",
      title: "Replit x Legit x Plate",
      description: "Boilerplate for running Legit and Plate on Replit with built-in versioning, editing, and project scaffolding.",
      image: "/showcase/LegitPlateReplit.png",
      date: "Nov. 2025",
      author: "Legit Team"
    }
  ]
}

const code = `
import { LegitProvider, useLegitFile } 
  from '@legit-sdk/react';
 
function App() {
  return (
    <LegitProvider>
      <Editor />
    </LegitProvider>
  );
}
 
function Editor() {
  const { content, setContent, history } 
    = useLegitFile('/document.txt');

  return (
    <textarea
      value={content || ''}
      onChange={e => setContent(e.target.value)}
    />
  );
}
`


const HandsOn = () => {
  return (
    <SmallGrid>
      <Font type="mono" className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-2">{data.caption}</Font>
      <Font type="h2" className="mb-6 col-span-12 lg:col-span-5 lg:col-start-2">
          {data.title}
      </Font>
      <div className="hidden lg:block col-span-12 lg:col-span-3 lg:col-start-2">
          <PrimaryButton href={data.button_link}>{data.button}</PrimaryButton>
      </div>
      <Font type="p" className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-5 mb-4">
        {data.description}
      </Font>
      <div className="block lg:hidden col-span-12 lg:col-span-3 lg:col-start-2">
          <PrimaryButton href={data.button_link}>{data.button}</PrimaryButton>
      </div>
      
      <Font type="h3" className="col-span-12 lg:col-span-10 lg:col-start-2  mb-6">
        {data.showcaseTitle}
      </Font>
      <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {data.showcaseItems.map((item) => (
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
  )
}

export default HandsOn