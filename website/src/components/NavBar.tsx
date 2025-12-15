"use client"

import { Navbar as NextraNavBar } from 'nextra-theme-docs'
import { useEffect, useState } from 'react'
import { Discord, Github } from './Socials'
import Logo from './Logo'

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Force light mode
    if (window.localStorage.getItem("theme") !== "light") {
      console.log("Force light mode")
      window.localStorage.setItem("theme", "light")
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Check initial scroll position
    handleScroll()
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const navbar = document.querySelector('.nextra-navbar-blur');
    if (navbar) {
      if (isScrolled) {
        navbar.classList.add('nextra-navbar-scrolled');
      } else {
        navbar.classList.remove('nextra-navbar-scrolled');
      }
    }
  }, [isScrolled])

  return (
    <NextraNavBar
      logo={<Logo />}
      align='right'
      className={isScrolled ? 'nextra-navbar-blur border-b border-gray-200 dark:border-gray-800' : 'nextra-navbar-blur'}
    >
        <Discord size={26} className="text-zinc-500 hover:text-zinc-800" href="https://discord.gg/34K4t5K9Ra" />
        <Github size={26} className="text-zinc-500 hover:text-zinc-800" href="https://github.com/legit-control/monorepo" />
    </NextraNavBar>
  )
}

export default NavBar