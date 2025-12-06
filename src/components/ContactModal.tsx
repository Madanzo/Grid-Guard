import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    reason: "",
    message: "",
    orderNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    onClose();
    setFormData({
      fullName: "",
      email: "",
      reason: "",
      message: "",
      orderNumber: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors duration-200"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          <p className="text-center text-muted-foreground mb-2">
            Contact us using the form below and we'll respond as soon as possible.
          </p>
          <h2 className="text-center text-xl font-heading font-semibold tracking-widest text-foreground mb-6">
            CONTACT US
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full name <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contact reason <span className="text-destructive">*</span>
              </label>
              <Select
                required
                value={formData.reason}
                onValueChange={(value) =>
                  setFormData({ ...formData, reason: value })
                }
              >
                <SelectTrigger className="h-12 bg-card border-border">
                  <SelectValue placeholder="Select a Contact Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missing">Incomplete Order (Missing Items)</SelectItem>
                  <SelectItem value="wrong">Received the Wrong Item</SelectItem>
                  <SelectItem value="not-received">Order Not Received</SelectItem>
                  <SelectItem value="defective">Defective Product</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                placeholder="How can we help?"
                className="min-h-[100px] bg-card border-border resize-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Order number <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                placeholder="Order #1234"
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
              />
            </div>

            <Button type="submit" variant="glow" size="lg" className="w-full mt-6">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
