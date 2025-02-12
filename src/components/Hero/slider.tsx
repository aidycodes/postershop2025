'use client'

import React, { useEffect } from "react"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'


import Image from "next/image"
import { Omega } from "lucide-react"
const Slider = ({images}: {images: string[]}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    // useEffect(() => {
    //   if (emblaApi) {
    // // Access API
    //   }
    // }, [emblaApi])

    
      return (
        <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div key={index} className="embla__slide relative w-full h-64 md:h-80 lg:h-96">
                <img
          src={image || '/fallback-image.jpg'}
          alt="Banner"
          
         
          className="w-full h-full object-cover"
          sizes="100vw"
        
        />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/20 mix-blend-multiply" />
            </div>
          ))}
        </div>
      </div>
      )
    }

export default Slider