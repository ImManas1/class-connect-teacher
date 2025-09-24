import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock,
  MapPin,
  BookOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock data
const mockClassData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Mathematics 101",
    subject: "Mathematics",
    students: 28,
    period: "1st Period",
    time: "8:00 AM - 9:00 AM",
    room: "Room 204",
    color: "bg-blue-500",
    description: "Introduction to basic mathematical concepts and problem-solving techniques.",
    nextAssignment: "Homework Chapter 5",
    dueDate: "Tomorrow",
    recentStudents: [
      { id: 1, name: "Emma Johnson", status: "present", initials: "EJ" },
      { id: 2, name: "Michael Chen", status: "present", initials: "MC" },
      { id: 3, name: "Sarah Williams", status: "absent", initials: "SW" },
      { id: 4, name: "David Brown", status: "present", initials: "DB" },
      { id: 5, name: "Lisa Garcia", status: "present", initials: "LG" },
    ]
  },
  "2": {
    id: 2,
    name: "Advanced Algebra",
    subject: "Mathematics",
    students: 22,
    period: "3rd Period",
    time: "10:30 AM - 11:30 AM",
    room: "Room 204",
    color: "bg-green-500",
    description: "Advanced algebraic concepts and equation solving.",
    nextAssignment: "Quiz on Polynomials",
    dueDate: "Friday",
    recentStudents: [
      { id: 1, name: "Alex Rivera", status: "present", initials: "AR" },
      { id: 2, name: "Jordan Kim", status: "present", initials: "JK" },
      { id: 3, name: "Taylor Swift", status: "present", initials: "TS" },
    ]
  }
};

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const classData = classId ? mockClassData[classId] : null;

  if (!classData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-4 py-4 flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${classData.color}`}></div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{classData.name}</h1>
              <p className="text-sm text-muted-foreground">{classData.subject}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Class Info Card */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-foreground">Class Information</span>
              <Badge variant="secondary">{classData.period}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{classData.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{classData.students} Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{classData.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{classData.room}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Monday - Friday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 bg-primary hover:bg-primary-hover text-primary-foreground">
            <div className="text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">Take Attendance</span>
            </div>
          </Button>
          <Button variant="outline" className="h-16 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm">View Assignments</span>
            </div>
          </Button>
        </div>

        {/* Upcoming Assignment */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Next Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{classData.nextAssignment}</h3>
                <p className="text-sm text-muted-foreground">Due: {classData.dueDate}</p>
              </div>
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classData.recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                        {student.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{student.name}</span>
                  </div>
                  <Badge 
                    variant={student.status === "present" ? "default" : "destructive"}
                    className={student.status === "present" ? "bg-success text-success-foreground" : ""}
                  >
                    {student.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassDetail;