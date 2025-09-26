import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
// Background image removed per request

const Login = () => {
  const navigate = useNavigate();

  const handleTeacherLogin = () => {
    toast({
      title: "Welcome!",
      description: "Teacher dashboard loaded",
    });
    navigate("/dashboard");
  };

  const handleParentLogin = () => {
    toast({
      title: "Welcome!",
      description: "Parent dashboard loaded",
    });
    navigate("/parent/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 touch-manipulation">
      {/* Simple Header (image removed) */}
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Attendify</h1>
          <p className="text-muted-foreground text-base">Manage your classes with ease</p>
        </div>
      </div>

      {/* Mobile App Login Options */}
      <div className="px-4 py-8">
        <Card className="mobile-card bg-card/98 backdrop-blur-sm border border-border/50">
          <CardHeader className="text-center pb-6 pt-6">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome to Attendify</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Choose your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <Button 
              onClick={handleTeacherLogin}
              className="w-full h-16 bg-primary text-primary-foreground font-semibold text-lg active:scale-95 transition-transform touch-manipulation"
            >
              <GraduationCap className="w-6 h-6 mr-3" />
              Teacher Dashboard
            </Button>
            
            <Button 
              onClick={handleParentLogin}
              variant="outline"
              className="w-full h-16 font-semibold text-lg active:scale-95 transition-transform touch-manipulation"
            >
              Parent Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Login;