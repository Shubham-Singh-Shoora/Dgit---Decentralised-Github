import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Eye, EyeOff, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    agreeToTerms: false,
    emailUpdates: false
  });
  const navigate = useNavigate();

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
    'Brazil',
    'India',
    'China',
    'Mexico',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Switzerland',
    'Austria',
    'Belgium',
    'Poland',
    'South Korea',
    'Singapore',
    'New Zealand',
    'Ireland',
    'Portugal',
    'Czech Republic',
    'Hungary',
    'Greece'
  ];

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleClose = () => {
    navigate('/'); // Go directly to landing page
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
            <Link to="/login" className="text-white/80 hover:text-white transition-colors">
              Sign in
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
              <h1 className="font-heading text-3xl font-bold text-white">Join Dgit</h1>
              <p className="text-white/60">Create your account on the decentralized platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-secondary/50 border-border text-white"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-secondary/50 border-border text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="bg-secondary/50 border-border text-white pr-10"
                    placeholder="Create a password"
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
                
                {formData.password && (
                  <div className="text-xs space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      {passwordValidation.length ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={passwordValidation.length ? "text-green-400" : "text-red-400"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.uppercase ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={passwordValidation.uppercase ? "text-green-400" : "text-red-400"}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.lowercase ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={passwordValidation.lowercase ? "text-green-400" : "text-red-400"}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.number ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={passwordValidation.number ? "text-green-400" : "text-red-400"}>
                        One number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">
                  Your Country/Region *
                </Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="bg-secondary/50 border-border text-white">
                    <SelectValue placeholder="Select your country/region" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country} className="text-white hover:bg-secondary/80">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-white font-medium text-sm">Email Preferences</h3>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="emailUpdates"
                      checked={formData.emailUpdates}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, emailUpdates: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="emailUpdates" className="text-white/80 cursor-pointer text-sm">
                      Receive occasional product updates and announcements
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <div className="text-sm text-white/60">
                    <Label htmlFor="terms" className="text-white/60 cursor-pointer">
                      I agree to the{' '}
                      <Link to="#" className="text-cta hover:text-cta-hover">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="#" className="text-cta hover:text-cta-hover">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={!isPasswordValid || !formData.agreeToTerms || !formData.country}
              >
                Create account
              </Button>
            </form>

            <div className="text-center">
              <span className="text-white/60">Already have an account? </span>
              <Link to="/login" className="text-cta hover:text-cta-hover transition-colors">
                Sign in
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

export default Signup;
