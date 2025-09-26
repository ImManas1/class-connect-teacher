import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar,
  LogOut,
  Bell,
  BarChart3
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for classes
const mockClasses = [
  {
    id: 1,
    name: "Mathematics 101",
    subject: "Mathematics",
    students: 28,
    period: "1st Period",
    time: "8:00 AM - 9:00 AM",
    room: "Room 204",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Advanced Algebra",
    subject: "Mathematics", 
    students: 22,
    period: "3rd Period",
    time: "10:30 AM - 11:30 AM",
    room: "Room 204",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Geometry Basics",
    subject: "Mathematics",
    students: 25,
    period: "5th Period", 
    time: "1:00 PM - 2:00 PM",
    room: "Room 204",
    color: "bg-purple-500"
  },
  {
    id: 4,
    name: "Statistics",
    subject: "Mathematics",
    students: 20,
    period: "7th Period",
    time: "3:00 PM - 4:00 PM", 
    room: "Room 204",
    color: "bg-orange-500"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
    navigate(`/class/${classId}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background touch-manipulation">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 safe-area-top">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">My Classes</h1>
                <p className="text-white/80 text-sm">Good morning, Asha!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-11 w-11 text-white/80 hover:text-white hover:bg-white/10 touch-manipulation"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-white"></span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-11 w-11 text-white/80 hover:text-white hover:bg-white/10 touch-manipulation"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Content */}
      <div className="px-4 py-6 bg-gradient-to-b from-primary/5 to-background">
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <Card className="mobile-card bg-gradient-to-br from-card to-card/80 border-border/50">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <BookOpen className="w-10 h-10 text-primary mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Classes</p>
                      <p className="text-3xl font-bold text-foreground">{mockClasses.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mobile-card bg-gradient-to-br from-card to-card/80 border-border/50">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <Users className="w-10 h-10 text-primary mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Students</p>
                      <p className="text-3xl font-bold text-foreground">
                        {mockClasses.reduce((sum, cls) => sum + cls.students, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-2 px-2">Your Classes</h2>
              {mockClasses.map((classItem, index) => (
                <Card 
                  key={classItem.id}
                  className="mobile-card bg-gradient-to-r from-card to-card/95 border-border/50 active:scale-98 transition-all duration-200 touch-manipulation"
                  onClick={() => handleClassSelect(classItem.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start space-x-4">
                      <div className={`w-6 h-6 rounded-full ${classItem.color} flex-shrink-0 mt-1`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1 leading-tight">
                              {classItem.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">{classItem.subject}</p>
                          </div>
                          <Badge variant="secondary" className="ml-2 text-xs px-2 py-1 rounded-full">
                            {classItem.period}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-medium">{classItem.students} students</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{classItem.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground font-medium">{classItem.room}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mobile-button h-9 px-4 text-primary border-primary/50 hover:bg-primary hover:text-primary-foreground active:scale-95 transition-transform"
                          >
                            View Class
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <Card className="mobile-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Coming Soon</h3>
                </div>
                <p className="text-sm text-muted-foreground">Detailed class performance and attendance analytics will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <Card className="mobile-card">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">No new alerts.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Safe Area Bottom */}
      <div className="pb-safe-bottom"></div>
    </div>
  );
};

export default Dashboard;