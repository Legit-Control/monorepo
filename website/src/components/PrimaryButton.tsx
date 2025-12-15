import Link from "next/link"

const PrimaryButton = ({ children, soon = false, href = '/' }: { children: React.ReactNode, soon?: boolean, href?: string }) => {
  return (
    <Link href={href}>
      <button className="group flex items-center cursor-pointer">
        <div className="relative flex items-center justify-center text-xl h-10 w-10 bg-primary text-white mr-4">
          <div className="group-hover:w-full w-0 transition-all duration-300 absolute top-0 left-0 h-full bg-black" />
          <span className="text-white z-10">→</span>
        </div>
        <span className="font-medium mr-2">{children}</span>
        {soon && <span className="font-medium text-zinc-500 bg-zinc-200 px-2 pb-0.5 rounded-full text-sm">
          soon
        </span>}
      </button>
    </Link>
  )
}

export default PrimaryButton