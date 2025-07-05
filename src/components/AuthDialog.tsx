
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonEffect } from "@/components/ui/button-effect";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectPath?: string;
}

// Default admin credentials
const ADMIN_EMAIL = "admin@techzeon.com";
const ADMIN_PASSWORD = "admin123";

export function AuthDialog({ open, onOpenChange, redirectPath }: AuthDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === "signin") {
        // For demo purposes, use API but fall back to local admin check if server is not running
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (response.ok) {
            const data = await response.json();
            
            toast({
              title: "Sign in successful!",
              description: data.user.role === 'admin' 
                ? "Welcome back, Administrator!" 
                : "Welcome back to TechZeon Events!",
            });
            
            // Log the user in
            login();
            
            // Close the dialog
            onOpenChange(false);
            
            // Redirect based on role
            if (data.user.role === 'admin') {
              navigate("/admin");
            } else if (redirectPath) {
              navigate(redirectPath);
            } else {
              navigate("/dashboard");
            }
            
            return;
          }
        } catch (error) {
          console.warn('API server not reachable, using fallback authentication');
        }
        
        // Fallback to local admin check if API fails
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        
        toast({
          title: "Sign in successful!",
          description: isAdmin 
            ? "Welcome back, Administrator!" 
            : "Welcome back to TechZeon Events!",
        });
        
        // Log the user in
        login();
        
        // Close the dialog
        onOpenChange(false);
        
        // Redirect based on role
        if (isAdmin) {
          navigate("/admin");
        } else if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/dashboard");
        }
      } else {
        // Sign up
        // Check if passwords match
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // For demo purposes, just show success message
        toast({
          title: "Registration successful!",
          description: "Your account has been created successfully.",
        });
        
        // Log the user in
        login();
        
        // Close the dialog
        onOpenChange(false);
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold text-center">
              {activeTab === "signin" ? "Welcome back" : "Create an account"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="email-signin" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password-signin">Password</Label>
                    <a 
                      href="#" 
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="password-signin" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      className="pl-10 pr-10" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <ButtonEffect 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </ButtonEffect>
              </form>
              
              {/* Admin credential hint box */}
              <div className="mt-4 p-3 bg-muted/50 rounded-md border border-muted">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Admin Credentials:</span><br />
                  Email: {ADMIN_EMAIL}<br />
                  Password: {ADMIN_PASSWORD}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      className="pl-10" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="password-signup" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      className="pl-10 pr-10" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="confirm-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Confirm your password" 
                      className="pl-10 pr-10" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <ButtonEffect 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </ButtonEffect>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
