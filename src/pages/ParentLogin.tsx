import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UserCircle2, Eye, EyeOff } from "lucide-react";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast({
        title: "Login Successful",
        description: "Welcome, parent!",
      });
      navigate("/parent/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter your email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 touch-manipulation">
      <div className="px-4 py-10">
        <Card className="mobile-card bg-card/98 backdrop-blur-sm border border-border/50">
          <CardHeader className="text-center pb-6 pt-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCircle2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Parent Portal</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to view your child's progress
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="parent@example.com"
                  autoComplete="email"
                  required
                />
              </div>

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
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 touch-manipulation"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full mobile-button bg-primary text-primary-foreground font-semibold text-base active:scale-95 transition-transform">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentLogin;

