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
  Bell
} from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Classes</h1>
              <p className="text-sm text-muted-foreground">Good morning, Sarah!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold text-foreground">{mockClasses.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockClasses.reduce((sum, cls) => sum + cls.students, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Classes</h2>
          
          {mockClasses.map((classItem) => (
            <Card 
              key={classItem.id}
              className="bg-card border border-border hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleClassSelect(classItem.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-4 h-4 rounded-full ${classItem.color}`}></div>
                      <h3 className="text-lg font-semibold text-foreground">{classItem.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{classItem.subject}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{classItem.students} students</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.time}</span>
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {classItem.period}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{classItem.room}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;