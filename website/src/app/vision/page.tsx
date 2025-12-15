/* eslint-disable @next/next/no-img-element */
import Font from '@/components/Font';
import PageGrid from '@/components/Grid';
import PrimaryButton from '@/components/PrimaryButton';
import SmallGrid from '@/components/SmallGrid';
// Page-specific metadata is handled by the layout's imported metadata

const data = {
  caption: "Vision",
  title: "The infrastructure for write-enabled AI",
  description: "AI is moving from a passive assistant to a active collaborator. Legit provides the infrastructure to track, control, and coordinate every change in a world where agents can write.",
  button: "Join Community",
}

const VisionPage = () => (
  <div className="bg-white">
    {/* <Meta
      title="Collaboration Infrastructure for Human–AI Teams"
      description="We're building the tools to make AI a true collaborator with version control, conversational memory, and coordinated workflows. Inspired by Git. Built for the future of work."
      canonical="https://legit.control"
    /> */}
    {/* Header */}
      <PageGrid>
        <SmallGrid className="pt-16">
          <Font type="mono" className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-3">{data.caption}</Font>
          <Font type="h1" className="mb-6 col-span-12 lg:col-span-6 lg:col-start-3">
              {data.title}
          </Font>
          <div className="hidden lg:block col-span-12 lg:col-span-3 lg:col-start-3">
              <PrimaryButton href="mailto:hello@legitcontrol.com">{data.button}</PrimaryButton>
          </div>
          <Font type="p" className="text-zinc-500 col-span-12 lg:col-span-5 lg:col-start-6 mb-4">
            {data.description}
          </Font>
          <div className="block lg:hidden col-span-12 lg:col-span-3 lg:col-start-3">
              <PrimaryButton href="https://discord.gg/34K4t5K9Ra">{data.button}</PrimaryButton>
          </div>
        </SmallGrid>
      </PageGrid>
      {/* visual */}
      <PageGrid>
        <div className=" w-full  py-24 md:py-8 flex items-center justify-center">
          <img
            className="rotate-90 md:rotate-0 max-w-[800px] w-[140%] md:w-full"
            src="/schematic_large.png"
            alt="hero"
          />
        </div>
      </PageGrid>
      {/* prolog */}
      <PageGrid>
        <SmallGrid>
          <Font type="h4" className='col-span-12 lg:col-span-2 lg:col-start-3'>Agents are coming</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>AI has evolved in waves.</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>The <b className='text-black'>first wave brought isolated assistants</b>. Tools that could answer questions or summarize information but could not act. They observed and analyzed providing insight without consequence.</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>The <b className='text-black'>second wave connected these assistants to the world</b>. Web knowledge, internal databases and multiple data sources flowed through them. AI became context-aware pulling together information from disparate systems to guide decisions. Still, its role was largely read-only.</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>Now we are entering the <b className='text-black'>third wave, write-enabled AI</b>. It creates, edits, automates and interacts directly with systems and data. This shift is profound. Suddenly every action carries weight. Every change has consequences. The need for control, auditability and reversibility is no longer optional it is essential.</Font>
          
          <Font type="h4" className='col-span-12 lg:col-span-2 lg:col-start-3 pt-6'>The insight</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500 pt-6'>For decades engineers have relied on version control to manage complexity and coordinate teams. But AI writing introduces a new kind of challenge. Code, documents, databases and even workflows can be altered by AI. How do we track these changes? How do we let teams experiment safely? How do we ensure that AI’s creativity does not spiral into chaos?</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'><span className='text-primary'>Legit&apos;s SDK</span> provides the answer. It <b className='text-black'>gives AI the ability to write responsibly</b> while giving humans the tools to understand, guide and oversee every action. Version control, branching, state tracking and audit trails are built in. Teams can experiment freely confident that every change is safe, traceable and reversible.</Font>
        
          <Font type="h4" className='col-span-12 lg:col-span-2 lg:col-start-3 pt-6'>Why is this important?</Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500 pt-6'>This is not just a technical problem. It is a challenge for every organization embracing AI. Startups exploring generative tools, enterprises building internal AI systems and legacy software companies retrofitting AI into existing platforms all will face the same question: How do we <b className='text-black'>scale creativity without losing control?</b></Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>Our vision is to provide the invisible infrastructure that makes AI trustworthy by design. To let it write, explore and innovate while keeping humans in control. To build the foundation for a future where AI is <b className='text-black'>not only powerful but transparent and reliable.</b></Font>
          <Font type="p" className='col-span-12 lg:col-span-5 lg:col-start-6 text-zinc-500'>The third wave is here. We are building the tools to ride it safely.</Font>
        </SmallGrid>
      </PageGrid>
  </div>
);

export default VisionPage;
