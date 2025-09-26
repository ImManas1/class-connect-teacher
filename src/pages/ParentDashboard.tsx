import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Calendar, ChartBar, LogOut, School2, User, TrendingUp, Clock, BookOpen } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const mockAttendanceBySubject = [
  { subject: "Mathematics", percentage: 92 },
  { subject: "Science", percentage: 88 },
  { subject: "English", percentage: 95 },
  { subject: "History", percentage: 90 },
  { subject: "Physical Education", percentage: 97 },
  { subject: "Computer Science", percentage: 94 },
];

const mockRecentAttendance = [
  { date: "2025-01-15", status: "Present", subject: "Mathematics" },
  { date: "2025-01-14", status: "Present", subject: "Science" },
  { date: "2025-01-13", status: "Absent", subject: "English" },
  { date: "2025-01-12", status: "Present", subject: "History" },
  { date: "2025-01-11", status: "Present", subject: "Physical Education" },
  { date: "2025-01-10", status: "Late", subject: "Computer Science" },
  { date: "2025-01-09", status: "Present", subject: "Mathematics" },
  { date: "2025-01-08", status: "Absent", subject: "Science" },
];

const mockSchedule = [
  { time: "08:00 - 09:00", subject: "Mathematics", room: "A-203", teacher: "Mrs. Sharma" },
  { time: "09:10 - 10:10", subject: "Science", room: "Lab-1", teacher: "Mr. Patel" },
  { time: "10:20 - 11:20", subject: "English", room: "B-104", teacher: "Ms. Gupta" },
  { time: "11:30 - 12:30", subject: "History", room: "C-201", teacher: "Dr. Singh" },
  { time: "12:30 - 13:30", subject: "Lunch Break", room: "Cafeteria", teacher: "" },
  { time: "13:30 - 14:30", subject: "Physical Education", room: "Ground", teacher: "Mr. Kumar" },
  { time: "14:40 - 15:40", subject: "Computer Science", room: "Lab-2", teacher: "Mrs. Reddy" },
];

const mockPerformance = [
  { subject: "Mathematics", grade: "A+", marks: 95 },
  { subject: "Science", grade: "A", marks: 88 },
  { subject: "English", grade: "A+", marks: 92 },
  { subject: "History", grade: "B+", marks: 85 },
  { subject: "Physical Education", grade: "A", marks: 90 },
  { subject: "Computer Science", grade: "A+", marks: 94 },
];

const ParentDashboard = () => {
  const navigate = useNavigate();

  const overallAttendance = useMemo(() => {
    const total = mockAttendanceBySubject.reduce((s, x) => s + x.percentage, 0);
    return Math.round(total / mockAttendanceBySubject.length);
  }, []);

  const chartConfig = {
    present: {
      label: "Attendance %",
      color: "hsl(var(--primary))",
    },
  } as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 safe-area-top flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <School2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Parent Dashboard</h1>
              <p className="text-white/80 text-sm">Welcome back!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-white/80 hover:text-white hover:bg-white/10 touch-manipulation"
            onClick={() => navigate("/parent")}
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 bg-gradient-to-b from-primary/5 to-background">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-1">
            <TabsTrigger value="overview" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="attendance" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Attendance</TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="mobile-card">
                <CardContent className="p-4 text-center space-y-2">
                  <User className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Attendance</p>
                    <p className="text-3xl font-bold">{overallAttendance}%</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="mobile-card">
                <CardContent className="p-4 text-center space-y-2">
                  <ChartBar className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subjects Tracked</p>
                    <p className="text-3xl font-bold">{mockAttendanceBySubject.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="mobile-card">
                <CardContent className="p-4 text-center space-y-2">
                  <Clock className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Days Present</p>
                    <p className="text-3xl font-bold">18/20</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Attendance</CardTitle>
                <CardDescription>Date-wise past 8 entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentAttendance.map((item) => (
                  <div key={item.date} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <p className="text-xs text-muted-foreground">{item.subject}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === "Present" ? "secondary" : item.status === "Late" ? "default" : "destructive"}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6 mt-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg">Subject-wise Attendance</CardTitle>
                <CardDescription>Percentage attended per subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <BarChart data={mockAttendanceBySubject}>
                    <XAxis dataKey="subject" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" fill="var(--color-present)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Summary</CardTitle>
                <CardDescription>Detailed breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAttendanceBySubject.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium">{subject.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${subject.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{subject.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <CardDescription>Your child's classes for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockSchedule.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{s.subject}</p>
                      <p className="text-sm text-muted-foreground">{s.time}</p>
                      {s.teacher && <p className="text-xs text-muted-foreground">Teacher: {s.teacher}</p>}
                    </div>
                    <span className="text-sm text-muted-foreground">{s.room}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </div>

      <div className="pb-safe-bottom" />
    </div>
  );
};

export default ParentDashboard;


