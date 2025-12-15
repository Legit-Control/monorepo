type LogoProps = {
  onDarkSurface?: boolean
}

const Logo = ({ onDarkSurface = false }: LogoProps) => {
  return (
    <div className="flex items-center gap-3 mr-8">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${onDarkSurface ? 'bg-white' : 'bg-primary'}`} >
        <div className={`w-[10px] h-[10px] rounded-full bg-[#FAFAFA] ${onDarkSurface ? 'bg-primary' : ''}`} />
      </div>
      <b className={`text-xl font-semibold ${onDarkSurface ? 'text-white' : 'text-black'}`}>Legit</b>
    </div>
  )
}

export default Logo