"use client"
import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';

const CuteSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   const result =  await authClient.signIn.email({
        email,
        password,
        callbackURL: '/SignedInSuccess'
    })
    if(result.error) {
        console.log(result.error)
    }
    console.log('Signing in with:', { email, password });
  };

  const signInSocial = async() => {
    const result = await authClient.signIn.social({
        provider:'google',
        callbackURL: '/SignedInSuccess'
    })
    if(result.error) {
        console.log(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-pink-200">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">
          Welcome Back! ❤️
        </h2>
        
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-pink-600 mb-2">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-pink-200 rounded-lg bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          
          <div>
            <label className="block text-pink-600 mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border border-pink-200 rounded-lg bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          

        </form>
      </div>
    </div>
  );
};

export default CuteSignIn;