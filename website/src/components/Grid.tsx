const PageGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col max-w-[1260px] mx-auto px-6 bg-white">
      {children}
    </div>
  )
}

export default PageGrid