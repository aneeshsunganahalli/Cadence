'use client';

import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../../firebase";
import { useDispatch } from 'react-redux';
import { signInSuccess } from '@/redux/user/userSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserData {
  name: string | null;
  email: string | null;
  photo: string | null;
}

const OAuth: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGoogleClick = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      if (!result.user) {
        throw new Error('No user data received from Google');
      }

      const res = await fetch(backendUrl + '/api/user/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        } satisfies UserData),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate with server');
      }
      
      const data = await res.json();
      console.log(data);
      localStorage.setItem('token', data.token)
      dispatch(signInSuccess(data.rest));
      router.push('/');
    } catch (error) {
      console.error("Could not sign in with Google:", error);
    }
  };
  
  return (
    <button 
      onClick={handleGoogleClick} 
      type='button' 
      className='flex items-center justify-center gap-2 bg-black w-full p-3 rounded-3xl text-white hover:opacity-90'
    >
      <Image
        src="/g.png"
        width={38}
        height={38}
        alt='Google-logo'
        className=''
      />
      <p>Continue with Google</p>
    </button>
  );
};

export default OAuth;