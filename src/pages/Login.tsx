import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff, UserCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import loginHero from "@/assets/login-hero.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"parent" | "teacher">("parent");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Check user role and redirect accordingly
          checkUserRoleAndRedirect(session.user.id);
        }
      }
    );

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserRoleAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profile?.role === 'teacher') {
        navigate("/dashboard");
      } else {
        navigate("/parent-dashboard");
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: "Sign Up Failed",
            description: "Please enter your full name",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              role: role
            }
          }
        });

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Successful",
            description: "Please check your email to confirm your account",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 touch-manipulation">
      {/* Mobile Hero Section */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={loginHero}
          alt="Educational environment with modern classroom" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-primary/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">EduConnect</h1>
            <p className="text-white/90 text-base">Connect teachers, students, and parents</p>
          </div>
        </div>
      </div>

      {/* Mobile-optimized Login Form */}
      <div className="px-4 -mt-12 relative z-10">
        <Card className="mobile-card bg-card/98 backdrop-blur-sm border border-border/50">
          <CardHeader className="text-center pb-6 pt-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              {isSignUp ? "Join our educational community" : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleAuth} className="space-y-6">
              {isSignUp && (
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-base font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mobile-input text-base"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mobile-input text-base"
                  placeholder="user@school.edu"
                  autoComplete="email"
                  required
                />
              </div>
              
              {isSignUp && (
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-base font-medium text-foreground">
                    I am a
                  </Label>
                  <Select value={role} onValueChange={(value: "parent" | "teacher") => setRole(value)}>
                    <SelectTrigger className="mobile-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Parent
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Teacher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mobile-input text-base pr-14"
                    placeholder="Enter your password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 touch-manipulation"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mobile-button bg-primary text-primary-foreground font-semibold text-base active:scale-95 transition-transform"
              >
                {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-base text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-medium touch-manipulation"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <button className="text-primary font-medium touch-manipulation">
                  Contact administrator
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 EduConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;