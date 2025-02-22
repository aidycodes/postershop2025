'use client'

import Image from 'next/image'
import Link from 'next/link'

import React from "react"
import Slider from "./slider"

type heroImages = string[]

interface HeroProps {
    
    title: string,
    href: string,
    description: string,
    buttonText: string,
}

const heroImages: heroImages = [
    '/categorys/Fantasy.jpg',
    '/categorys/Kids.jpg',
    '/categorys/saway.jpg',
  
]

// Common button class to maintain consistency
const buttonClass = `relative px-8 py-3 rounded-md font-semibold cursor-pointer group
  bg-white/10 backdrop-blur-sm border border-white/30
  transition-all duration-300
  hover:bg-white/20 hover:border-white/50 hover:scale-105
  text-white text-lg
  shadow-[0_0_20px_rgba(255,255,255,0.1)]
  hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]`

// Common overlay class
const overlayClass = `absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 
  after:absolute after:inset-0 after:bg-black/40 mix-blend-multiply`

const Hero = ({ title, href, description, buttonText}: HeroProps) => {


    if (heroImages.length === 0) {
        return (
            <div className="relative  bg-gradient-to-r from-purple-800 to-pink-900 shadow-lg h-96">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
                  {title}
                </span>
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-center">
                <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
                  {description}
                </span>
              </p>
              <Link 
                href={href} 
                className={buttonClass}
              >
                <span className="relative z-10">{buttonText}</span>
              </Link>
            </div>

          </div>
        )
    }
    if(heroImages.length === 1) {
    return (
        <div className="relative w-full">
      {/* Container with fixed aspect ratio */}
      <div className="relative w-full h-64 md:h-80 lg:h-96">
        {/* Image with object-fit cover to fill space while maintaining aspect ratio */}
        <Image
          src={heroImages[0] || '/fallback-image.jpg'}
          alt="Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className={overlayClass} />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                    <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
                      {title}
                    </span></h2>
          <p className="text-xl md:text-2xl mb-8 text-center">
          <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
            {description}
          </span></p>
          <Link 
            href={href} 
            className={buttonClass}
          >
            <span className="relative z-10">{buttonText}</span>
          </Link>
        </div>

      </div>
    </div>
    )
    }
    if(heroImages.length > 1) {
        return (

            <div className="relative w-full">
            {/* Container with fixed aspect ratio */}
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              {/* Image with object-fit cover to fill space while maintaining aspect ratio */}
             <Slider images={heroImages} />
              <div className={overlayClass} />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                          <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
                {title}
            </span></h2>
                <p className="text-xl md:text-2xl mb-8 text-center">
                <span className="text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000,_0_0_8px_rgba(0,0,0,0.6)]">
                {description}
            </span></p>
                
                <Link href={href} className={buttonClass}>
                  <span className="relative z-10">{buttonText}</span>
                </Link>
              </div>
      
            </div>
          </div>
        
        )
    }


}


export default Hero