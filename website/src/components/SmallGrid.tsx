const SmallGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`py-12 md:py-24 grid grid-cols-12 gap-2 ${className}`}>
        {children}
    </div>
  )
}

export default SmallGrid