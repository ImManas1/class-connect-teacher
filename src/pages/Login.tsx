import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import loginHero from "@/assets/login-hero.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for demo
    if (email && password) {
      toast({
        title: "Login Successful",
        description: "Welcome back, teacher!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed", 
        description: "Please enter your email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
            <img 
              src={loginHero} 
              alt="TeacherApp Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">TeacherApp</h1>
          <p className="text-muted-foreground text-lg">Manage your classes with ease</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-foreground bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-foreground bg-background/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-md transition-all duration-200"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Contact your administrator
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;