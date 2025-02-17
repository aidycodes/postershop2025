"use client"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from 'react';
 
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
 
  const signUp = async () => {
    const { data, error } = await authClient.signUp.email({ 
        email, 
        password, 
        name, 
        image: undefined, 
     }, { 
        onRequest: (ctx) => { 
         //show loading
        }, 
        onSuccess: (ctx) => { 
          //redirect to the dashboard
        }, 
        onError: (ctx) => { 
          alert(ctx.error.message); 
        }, 
      }); 
  };

 
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        name
      <input className="border border-gray-300 rounded-md p-2 text-black" type="name" value={name} onChange={(e) => setName(e.target.value)} />
      pw
      <input className="border border-gray-300 rounded-md p-2 text-black" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      email
      <input className="border border-gray-300 rounded-md p-2 text-black" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}