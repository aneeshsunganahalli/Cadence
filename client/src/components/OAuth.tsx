'use client';

import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";
//import { useDispatch } from 'react-redux';
//import { signInSuccess } from '@/redux/user/userSlice';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string | null;
  email: string | null;
  photo: string | null;
}

const OAuth: React.FC = () => {
  // const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleClick = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      });
      
      const data = await res.json();
      // dispatch(signInSuccess(data));
      router.push('/');
    } catch(error) {
      console.log("Could not sign in with Google", error);
    }
  };
  
  return (
    <button 
      onClick={handleGoogleClick} 
      type='button' 
      className='bg-red-700 p-3 rounded-lg text-white uppercase hover:opacity-90'
    >
      Continue with Google
    </button>
  );
};

export default OAuth;