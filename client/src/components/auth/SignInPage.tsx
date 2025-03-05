import { SignInForm } from '@/components/auth/SignInForm';
import { OAuth } from '@/components/auth/OAuth';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
      </div>
      <SignInForm />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2">Or continue with</span>
        </div>
      </div>
      <OAuth />
    </div>
  );
}