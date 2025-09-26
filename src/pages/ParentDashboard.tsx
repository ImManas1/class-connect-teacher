import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Calendar, ChartBar, LogOut, School2, User } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const mockAttendanceBySubject = [
  { subject: "Math", percentage: 92 },
  { subject: "Science", percentage: 88 },
  { subject: "English", percentage: 95 },
  { subject: "History", percentage: 90 },
  { subject: "PE", percentage: 97 },
];

const mockRecentAttendance = [
  { date: "2025-09-15", status: "Present" },
  { date: "2025-09-14", status: "Present" },
  { date: "2025-09-13", status: "Absent" },
  { date: "2025-09-12", status: "Present" },
  { date: "2025-09-11", status: "Present" },
];

const mockSchedule = [
  { time: "08:00 - 09:00", subject: "Math", room: "A-203" },
  { time: "09:10 - 10:10", subject: "Science", room: "Lab-1" },
  { time: "10:20 - 11:20", subject: "English", room: "B-104" },
  { time: "11:30 - 12:30", subject: "History", room: "C-201" },
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

      <div className="px-4 py-6 bg-gradient-to-b from-primary/5 to-background space-y-6">
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
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
            <CardDescription>Date-wise past 5 entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentAttendance.map((item) => (
              <div key={item.date} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <Badge variant={item.status === "Present" ? "secondary" : "destructive"}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>Your child's classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSchedule.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.subject}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
                <span className="text-sm text-muted-foreground">{s.room}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="pb-safe-bottom" />
    </div>
  );
};

export default ParentDashboard;


