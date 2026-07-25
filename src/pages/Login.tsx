import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle2, LogIn, Mail, User as UserIcon, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const login = useUserStore((s) => s.login);
  const profile = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [name, setName] = useState(profile?.name ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
    if (mode === 'signup') {
      if (name.trim().length < 2) errs.name = 'Name required';
      if (password.length < 6) errs.password = 'Min 6 characters';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    login(email, name);
    navigate('/account');
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-120px)] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <span className="font-display font-bold text-3xl leading-none tracking-tight">
            <span className="text-gray-900">amazon</span>
            <span className="text-amazon-orange">.</span>
            <span className="text-amazon-yellow text-base bg-amazon-navy px-1.5 py-0.5 rounded">clone</span>
          </span>
        </Link>

        <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8">
          {!isGuest ? (
            <>
              <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-sm text-gray-600 mb-6">Signed in as {profile?.name}</p>
              <div className="space-y-3">
                <Link to="/account" className="btn-amazon w-full justify-center !py-2.5">
                  Go to Your Account <ChevronRight size={14} />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setPassword('');
                  }}
                  className="btn-amazon-outline w-full justify-center !py-2.5"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amazon-orange to-amazon-yellow inline-flex items-center justify-center text-white">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold leading-tight">
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                  </h1>
                  <p className="text-xs text-gray-500">Checkout faster with an account</p>
                </div>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <Field label="Your name" error={errors.name} icon={<UserIcon size={14} />}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="Jane Doe"
                    />
                  </Field>
                )}
                <Field label="Email" error={errors.email} icon={<Mail size={14} />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                  />
                </Field>
                {mode === 'signup' && (
                  <Field label="Password" error={errors.password} icon={<Mail size={14} />}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      placeholder="At least 6 characters"
                    />
                    <p className="mt-1 text-xs text-gray-500">Passwords are stored locally, and never leave your browser.</p>
                  </Field>
                )}
                <button type="submit" className="w-full btn-amazon-yellow justify-center !py-2.5 font-semibold">
                  <LogIn size={16} className="mr-1.5" />
                  {mode === 'signin' ? 'Sign in' : 'Create your Amazon.clone account'}
                </button>
              </form>

              <div className="mt-6 text-xs text-gray-500">
                By continuing, you agree to Amazon.clone’s Conditions of Use and Privacy Notice.
              </div>

              <hr className="my-6" />

              <div className="text-sm">
                {mode === 'signin' ? (
                  <>
                    <div className="text-gray-600">New to Amazon.clone?</div>
                    <button onClick={() => setMode('signup')} className="btn-amazon-outline w-full mt-2 justify-center !py-2">
                      Create your Amazon.clone account
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-gray-600">Already have an account?</div>
                    <button onClick={() => setMode('signin')} className="btn-amazon-outline w-full mt-2 justify-center !py-2">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .input {
          width: 100%;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.375rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          background: white;
          transition: all 0.15s ease;
          outline: none;
        }
        .input:focus {
          border-color: #FF9900;
          box-shadow: 0 0 0 3px rgba(255,153,0,0.18);
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon, error, children }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 inline-flex items-center gap-1.5 text-gray-700 font-medium">
        {icon}
        {label}
      </div>
      {children}
      {error && <div className="mt-1 text-xs text-amazon-deal">{error}</div>}
    </label>
  );
}
