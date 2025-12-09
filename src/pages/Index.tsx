import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, MessageCircle, Mail, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ContactModal from "@/components/ContactModal";
import PasswordModal from "@/components/PasswordModal";
import { STORAGE_KEYS } from "@/lib/constants";

type SignupStep = 'phone' | 'email' | 'complete';

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('phone');
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  // Check if user is already registered and redirect to store
  useEffect(() => {
    const savedPhone = localStorage.getItem(STORAGE_KEYS.USER_PHONE);
    const savedEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);

    if (savedPhone && savedEmail) {
      // User already registered - redirect to store
      navigate('/store', { replace: true });
    } else {
      // Not registered - show signup form
      setIsCheckingRegistration(false);
    }
  }, [navigate]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      // Store phone and move to email step
      localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
      setStep('email');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store email and complete signup
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      setStep('complete');

      toast({
        title: "Welcome to Grid & Guard!",
        description: "Redirecting you to our exclusive collection...",
      });

      // Redirect to store after short delay
      setTimeout(() => navigate('/store'), 1500);
    }
  };

  const handleBack = () => {
    if (step === 'email') {
      setStep('phone');
    }
  };

  // Show nothing while checking registration to prevent flash
  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden bg-zinc-950">
      {/* Full-screen Background Image with pulse animation */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat animate-pulse"
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/nimble-climber-454903-d3.firebasestorage.app/o/cases%2Fbackground.png?alt=media")`,
          animation: 'bgPulse 4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes bgPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Dark Overlay for readability */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Center gradient overlay for text readability */}
      <div className="fixed inset-0 bg-gradient-radial from-black/70 via-black/50 to-transparent"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          {/* Logo / Back Button */}
          <div className="flex items-center gap-3">
            {step === 'email' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </button>
            )}
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
              Grid<span className="text-primary">&</span>Guard
            </span>
          </div>

          {/* Enter Password Button */}
          <button
            onClick={() => setIsPasswordOpen(true)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 border border-zinc-700 hover:border-zinc-500 rounded-md px-4 py-2"
          >
            <Lock className="w-4 h-4" />
            <span>Enter password</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-lg mx-auto">
            {/* Grand Opening Text */}
            <h1
              className="text-5xl md:text-7xl font-serif italic text-white mb-6 animate-fade-in"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Grand Opening
            </h1>

            {/* Grand Opening Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-white tracking-widest uppercase">Now Open</span>
            </div>

            {/* Step 1: Phone */}
            {step === 'phone' && (
              <>
                <p className="text-lg text-zinc-400 mb-2 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  Join our exclusive list
                </p>
                <p className="text-xl md:text-2xl font-bold text-white mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  GET EARLY ACCESS TO NEW DROPS
                </p>

                {/* Lifetime Replacements Badge */}
                <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: "0.22s" }}>
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <span className="text-sm text-green-400 font-medium">✨ Sign up for LIFETIME REPLACEMENTS</span>
                  </div>
                </div>

                <form
                  onSubmit={handlePhoneSubmit}
                  className="flex flex-col gap-4 max-w-sm mx-auto mb-6 animate-fade-in"
                  style={{ animationDelay: "0.25s" }}
                >
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-3 min-w-[100px]">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-white text-sm">+1</span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base tracking-wide"
                  >
                    GET ACCESS
                  </Button>
                </form>

                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  By submitting this form, you consent to receive marketing text messages from Grid & Guard.
                  Consent is not a condition of any purchase. Message and data rates may apply.{" "}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> &{" "}
                  <a href="/terms" className="text-primary hover:underline">Terms</a>.
                </p>
              </>
            )}

            {/* Step 2: Email */}
            {step === 'email' && (
              <>
                <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">Phone: +1 {phone}</span>
                </div>

                <p className="text-lg text-zinc-400 mb-2 animate-fade-in">
                  One more step!
                </p>
                <p className="text-xl md:text-2xl font-bold text-white mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  ENTER YOUR EMAIL
                </p>

                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col gap-4 max-w-sm mx-auto mb-6 animate-fade-in"
                  style={{ animationDelay: "0.15s" }}
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                      required
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base tracking-wide"
                  >
                    COMPLETE SIGNUP
                  </Button>
                </form>

                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  We'll send your exclusive discount code to this email.
                  Unsubscribe at any time.
                </p>
              </>
            )}

            {/* Step 3: Complete */}
            {step === 'complete' && (
              <div className="animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-2">You're in!</p>
                <p className="text-zinc-400">Redirecting to the store...</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <button
            onClick={() => setIsContactOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Customer Support</span>
          </button>
        </footer>
      </div>

      {/* Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
    </div>
  );
};

export default Index;
