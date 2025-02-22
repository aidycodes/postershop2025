'use client'
import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import useSignInEmail from './useSignInEmail';
import useSignUpEmail from './useSignUpEmail';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
    name: z.string(),
})
type SignInForm = z.infer<typeof schema>

const SignInUp = () => {

    const [activeTab, setActiveTab] = useState('signin');  
    const [loading, setLoading] = useState(false)
    
    const {signIn, isSignInPending, isSignInError, signInError, SignInLoading} = useSignInEmail()
    const {signUp, isSignUpPending, isSignUpError, signUpError, SignUpLoading} = useSignUpEmail()
    
    const {register: registerSignIn, handleSubmit: handleSignIn, formState: {errors: errorsSignIn}} = useForm<SignInForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
       
    })
    const {register: registerSignUp, handleSubmit: handleSignUp, formState: {errors: errorsSignUp}} = useForm<SignInForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
        
    })
        
    const onSignIn: SubmitHandler<SignInForm> = (data) => {
        signIn(data)
    }
    const onSignUp: SubmitHandler<SignInForm> = (data) => {
        signUp(data)
    }
    const signInSocial = async() => {
        setLoading(true)
        const result = await authClient.signIn.social({
        provider:'google',
        callbackURL: '/dashboard/orders'
    })
    if(result.error) { 
        console.log(result.error)
    setLoading(false)
    }
  }

  console.log(SignUpLoading, SignInLoading, isSignInPending, isSignUpPending, isSignInError, isSignUpError, errorsSignIn, errorsSignUp)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 ">
      <div className="w-full max-w-md">
        {/* Custom Tabs */}
        <div className="flex rounded-xl overflow-hidden mb-4 bg-white shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 px-4 text-sm font-medium  transition-all duration-200 ${
              activeTab === 'signin'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-slate-900 cursor-pointer '
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === 'signup'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-gray-600 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="min-h-[520px]  "> {/* Fixed minimum height container */}
          {/* Sign In Form */}
          <div className=''>
          <div 
            className={` flex flex-col justify-around  bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-opacity duration-200 ${
              activeTab === 'signin' ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            <div className="text-center mb-8  ">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
            </div>

            <form  className="space-y-6" onSubmit={handleSignIn(onSignIn)}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...registerSignIn('email')}
                    placeholder='Enter your email'
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                  <div className='h-1 text-red-500'>{errorsSignIn.email?.message} </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...registerSignIn('password')}
                    type="password"
                    placeholder='Enter your password'
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                  <div className='h-1 text-red-500'>{errorsSignIn.password?.message} </div>
                </div>
              </div>
                    <div className='h-1 text-red-500'>{isSignInError && signInError?.message} </div>
              <div className="flex flex-col mb-auto pt-4">
                <button 
                  type="submit" disabled={isSignInPending || isSignUpPending ||  SignInLoading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow cursor-pointer
                     ${isSignInPending || isSignUpPending ||  SignInLoading ? 'opacity-50 cursor-default' : ''}`}
                >
                  {SignInLoading ? 'Signing in...' : 'Sign In'}
                </button>

  
         
               
              </div>
            </form>
            <button 
            onClick={() => signInSocial()}
            disabled={loading}
            className={`${loading ? 'opacity-50 cursor-default' : ''} cursor-pointer w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors duration-300 mt-2`}
          >
            <img 
              src="/google.svg" 
              alt="Google logo" 
              className="mr-2 h-5 w-5"
            />
            <span className="text-gray-700 font-medium">{loading ? <>Signing in...</> : 'Sign in with Google'}</span>
          </button>
            </div>
          </div>

          {/* Sign Up Form */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-opacity duration-200 ${
              activeTab === 'signup' ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
              <p className="text-gray-600 mt-2">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSignUp(onSignUp)}  className="space-y-6">
          

              <div className="space-y-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...registerSignUp('email')}
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                  <div className='h-1 text-red-500'>{errorsSignUp.email?.message} </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...registerSignUp('password')}
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                  <div className='h-1 text-red-500'>{errorsSignUp.password?.message} </div>
                </div>
              </div>
              <div className='h-1 text-red-500'>{isSignUpError && signUpError?.message} </div>
              <div className="pt-4">
                <button 
                  type="submit" disabled={isSignUpPending || isSignInPending ||  SignUpLoading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer hover:shadow
                     ${isSignUpPending || isSignInPending || SignUpLoading ? 'opacity-50 cursor-default' : ''}`}
                >
                  {SignUpLoading ? 'Creating...' : 'Create Account'}
                </button>

                <button 
            onClick={() => signInSocial()}
            disabled={loading}
            className={`${loading ? 'opacity-50 cursor-default' : ''} cursor-pointer w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors duration-300 mt-2`}
          >
            <img 
              src="/google.svg" 
              alt="Google logo" 
              className="mr-2 h-5 w-5"
            />
            <span className="text-gray-700 font-medium">{loading ? <>Signing in...</> : 'Sign in with Google'}</span>
          </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInUp;