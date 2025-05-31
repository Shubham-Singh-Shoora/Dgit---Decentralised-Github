
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch, Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GitBranch size={28} className="text-cta" />
            <span className="font-heading text-2xl font-bold purple-glow">Dgit</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/signup" className="text-white/80 hover:text-white transition-colors">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="glass p-8 space-y-6 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <h1 className="font-heading text-3xl font-bold text-white">Sign in to Dgit</h1>
              <p className="text-white/60">Welcome back to the decentralized future</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Username or email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-border text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link to="#" className="text-sm text-cta hover:text-cta-hover transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-border text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary">
                Sign in
              </Button>
            </form>

            <div className="text-center">
              <span className="text-white/60">New to Dgit? </span>
              <Link to="/signup" className="text-cta hover:text-cta-hover transition-colors">
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-white/40">
            <div className="flex justify-center gap-6">
              <Link to="#" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link to="#" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-white/60 transition-colors">Security</Link>
              <Link to="#" className="hover:text-white/60 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
