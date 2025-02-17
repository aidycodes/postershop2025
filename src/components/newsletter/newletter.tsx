'use client'
import { useActionState } from 'react'
import { signUp } from './newsletter-actions'
import Image from 'next/image'

const Newsletter = ({bannerImage, bannerTitle, bannerSubtitle}: {bannerImage?: string, bannerTitle?: string, bannerSubtitle?: string}) => {
  const [state, formAction] = useActionState(signUp, null)
  

  return (
    <div className="bg-white py-16 ">
      <div className="max-w-7xl mx-auto bg-slate-50 rounded-lg  ">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-md">
         {/* Poster Image */}
          <div className="relative aspect-[4/3] w-full">

            <Image 
              src={bannerImage || "/mail.webp"} 
              alt="Poster collection" 
              className="w-full h-full object-cover rounded-lg"
              width={600}
              height={400}
            />
            <div className="absolute inset-0 bg-blue-600/80 rounded-l-lg"> </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">

              <h3 className="text-4xl font-bold mb-2">{bannerTitle || 'SIGN UP & SAVE'}</h3>
              <p className="text-6xl font-bold">{bannerSubtitle || '20%!'}</p>
            </div>
          </div>

          {/* Newsletter Form */}
          <form action={formAction} className="border-l border-gray-300 px-4 sm:px-6 lg:px-8">
            <div className="px-4 py-8">
              <h3 className="text-2xl font-semibold mb-4">Sign up and never miss a deal</h3>
              <p className="text-gray-600 mb-6">Join our newsletter for the latest discounts and PosterHub goodies</p>
              <div className="flex mb-4">
                <input 
                  type="email"
                  name="email"
                  placeholder="Enter your e-mail" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-r-md font-semibold hover:bg-blue-700 cursor-pointer">
                  Sign up
                </button>
              </div>
              <p className="text-xs text-gray-500">
                By clicking "Sign up", you agree to receiving emails and to processing of your personal data in accordance with our Privacy Policy.
              </p>
              {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
              {state?.success && <p className="text-green-500 mt-2">{state.success}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Newsletter

