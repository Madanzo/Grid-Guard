import { useState } from "react";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal = ({ isOpen, onClose }: PasswordModalProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, any password works
    toast({
      title: "Access Granted!",
      description: "Welcome to the exclusive collection.",
    });
    onClose();
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors duration-200"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/30">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-heading font-bold text-foreground mb-2">
            Enter password
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            This store is password protected. Enter the password to access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />

            <Button type="submit" variant="glow" size="lg" className="w-full">
              Enter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
