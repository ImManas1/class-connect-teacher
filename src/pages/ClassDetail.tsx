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
  AlertCircle,
  UserCheck,
  GraduationCap,
  FileText,
  MessageSquare
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
      { id: 1, name: "Priya Sharma", status: "present", initials: "PS" },
      { id: 2, name: "Arjun Patel", status: "present", initials: "AP" },
      { id: 3, name: "Kavya Reddy", status: "absent", initials: "KR" },
      { id: 4, name: "Rohan Singh", status: "present", initials: "RS" },
      { id: 5, name: "Ananya Gupta", status: "present", initials: "AG" },
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
      { id: 1, name: "Vikram Kumar", status: "present", initials: "VK" },
      { id: 2, name: "Sneha Joshi", status: "present", initials: "SJ" },
      { id: 3, name: "Rahul Verma", status: "present", initials: "RV" },
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
    <div className="min-h-screen bg-background touch-manipulation">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 safe-area-top">
          <div className="flex items-center space-x-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="h-11 w-11 text-white/80 hover:text-white hover:bg-white/10 touch-manipulation"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{classData.name}</h1>
              <p className="text-white/80 text-sm">{classData.subject}</p>
            </div>
          </div>
          
          {/* Mobile Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">{classData.students}</p>
              <p className="text-white/80 text-xs">Students</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{classData.period}</p>
              <p className="text-white/80 text-xs">Period</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{classData.room}</p>
              <p className="text-white/80 text-xs">Room</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Quick Actions */}
      <div className="px-4 py-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            className="mobile-card h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground border-0 active:scale-95 transition-all touch-manipulation"
            onClick={() => navigate(`/attendance/${classId}`)}
          >
            <UserCheck className="w-7 h-7" />
            <span className="text-sm font-semibold">Attendance</span>
          </Button>
          
          <Button 
            className="mobile-card h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-warning-foreground border-0 active:scale-95 transition-all touch-manipulation"
            onClick={() => navigate(`/grades/${classId}`)}
          >
            <GraduationCap className="w-7 h-7" />
            <span className="text-sm font-semibold">Grades</span>
          </Button>
          
          <Button 
            className="mobile-card h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground border-0 active:scale-95 transition-all touch-manipulation"
            onClick={() => navigate(`/assignments/${classId}`)}
          >
            <FileText className="w-7 h-7" />
            <span className="text-sm font-semibold">Assignments</span>
          </Button>
          
          <Button 
            className="mobile-card h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground border-0 active:scale-95 transition-all touch-manipulation"
            onClick={() => navigate(`/announcements/${classId}`)}
          >
            <MessageSquare className="w-7 h-7" />
            <span className="text-sm font-semibold">Messages</span>
          </Button>
        </div>

        {/* Mobile Class Info Card */}
        <Card className="mobile-card mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span>Class Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">{classData.description}</p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Students</span>
                </div>
                <span className="font-semibold text-foreground">{classData.students}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Time</span>
                </div>
                <span className="font-semibold text-foreground">{classData.time}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Location</span>
                </div>
                <span className="font-semibold text-foreground">{classData.room}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Schedule</span>
                </div>
                <span className="font-semibold text-foreground">Monday - Friday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Upcoming Assignment */}
        <Card className="mobile-card mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <span>Next Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-lg">{classData.nextAssignment}</h3>
                <p className="text-muted-foreground mt-1">Due: {classData.dueDate}</p>
              </div>
              <Badge variant="outline" className="text-warning border-warning/30">
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Recent Students */}
        <Card className="mobile-card bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span>Recent Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classData.recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-sm bg-secondary text-secondary-foreground font-medium">
                        {student.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{student.name}</span>
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

      {/* Mobile Safe Area Bottom */}
      <div className="pb-safe-bottom"></div>
    </div>
  );
};

export default ClassDetail;