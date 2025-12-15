import Font from "./Font"

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-zinc-100 text-zinc-600 px-3 py-1 rounded-md text-sm w-fit ${className}`}>
      <Font type="mono">{children}</Font>
    </div>
  )
}

export default Label