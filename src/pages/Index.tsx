import { useState } from "react";
import { Mail, Lock, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ContactModal from "@/components/ContactModal";
import PasswordModal from "@/components/PasswordModal";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when we launch.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
      
      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center glow-border">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              CASE<span className="text-primary">VAULT</span>
            </span>
          </div>
          
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Customer Support</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-2xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">COMING SOON</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
              Premium Cases for
              <br />
              <span className="text-primary text-glow">Every Device</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Elevate your smartphone experience with our exclusive collection of designer phone cases. Protection meets style.
            </p>

            {/* Email Signup Form */}
            <form 
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14"
                  required
                />
              </div>
              <Button type="submit" variant="glow" size="xl">
                GET ACCESS
              </Button>
            </form>

            {/* Terms Text */}
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              By submitting this form, you consent to receive marketing messages from CaseVault.
              Unsubscribe at any time.{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a> &{" "}
              <a href="#" className="text-primary hover:underline">Terms</a>.
            </p>

            {/* Password Entry Link */}
            <button
              onClick={() => setIsPasswordOpen(true)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Lock className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span>Enter password for exclusive access</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <p className="text-sm text-muted-foreground">
            casevault.com
          </p>
        </footer>
      </div>

      {/* Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
    </div>
  );
};

export default Index;
