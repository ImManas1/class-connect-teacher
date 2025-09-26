import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  User, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  GraduationCap,
  Trophy,
  Target,
  Bell,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Award,
  Brain,
  Activity
} from "lucide-react";

// Mock data for demo
const mockChildren = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "5th",
    class: "Mrs. Smith's Class",
    teacher: "Sarah Smith",
    avatar: "EJ",
    overallGrade: 92,
    subjects: [
      { name: "Mathematics", grade: 95, trend: "up", lastAssignment: "Fractions Quiz", lastScore: 18, maxScore: 20 },
      { name: "English", grade: 88, trend: "stable", lastAssignment: "Book Report", lastScore: 85, maxScore: 100 },
      { name: "Science", grade: 94, trend: "up", lastAssignment: "Solar System", lastScore: 47, maxScore: 50 },
      { name: "Social Studies", grade: 90, trend: "down", lastAssignment: "Geography Test", lastScore: 36, maxScore: 40 },
    ],
    attendance: {
      present: 87,
      late: 3,
      absent: 2,
      total: 92,
      percentage: 95
    },
    weeklyAttendance: [
      { day: "Mon", status: "present" },
      { day: "Tue", status: "present" },
      { day: "Wed", status: "late" },
      { day: "Thu", status: "present" },
      { day: "Fri", status: "present" }
    ],
    gradeHistory: [
      { month: "Sep", grade: 88 },
      { month: "Oct", grade: 90 },
      { month: "Nov", grade: 92 },
      { month: "Dec", grade: 92 }
    ],
    recentGrades: [
      { subject: "Math", assignment: "Fractions Quiz", score: 18, max: 20, date: "Dec 15", percentage: 90 },
      { subject: "Science", assignment: "Solar System", score: 47, max: 50, date: "Dec 12", percentage: 94 },
      { subject: "English", assignment: "Book Report", score: 85, max: 100, date: "Dec 10", percentage: 85 },
    ],
    achievements: [
      { title: "Perfect Attendance Week", date: "Dec 2024", icon: "trophy" },
      { title: "Math Star", date: "Nov 2024", icon: "star" },
      { title: "Reading Champion", date: "Oct 2024", icon: "book" }
    ],
    upcomingEvents: [
      { title: "Parent-Teacher Conference", date: "Dec 20", type: "meeting" },
      { title: "Science Fair", date: "Jan 15", type: "event" },
      { title: "Math Test", date: "Dec 18", type: "test" }
    ],
    behavior: {
      positive: 45,
      neutral: 12,
      negative: 3
    }
  },
  {
    id: "2",
    name: "Alex Johnson",
    grade: "8th",
    class: "Mr. Brown's Class",
    teacher: "Michael Brown",
    avatar: "AJ",
    overallGrade: 85,
    subjects: [
      { name: "Algebra", grade: 82, trend: "up", lastAssignment: "Linear Equations", lastScore: 16, maxScore: 20 },
      { name: "History", grade: 88, trend: "stable", lastAssignment: "Civil War Essay", lastScore: 88, maxScore: 100 },
      { name: "Biology", grade: 86, trend: "up", lastAssignment: "Cell Structure", lastScore: 43, maxScore: 50 },
      { name: "Literature", grade: 84, trend: "down", lastAssignment: "Poetry Analysis", lastScore: 42, maxScore: 50 },
    ],
    attendance: {
      present: 82,
      late: 5,
      absent: 4,
      total: 91,
      percentage: 90
    },
    weeklyAttendance: [
      { day: "Mon", status: "present" },
      { day: "Tue", status: "absent" },
      { day: "Wed", status: "present" },
      { day: "Thu", status: "present" },
      { day: "Fri", status: "late" }
    ],
    gradeHistory: [
      { month: "Sep", grade: 80 },
      { month: "Oct", grade: 83 },
      { month: "Nov", grade: 85 },
      { month: "Dec", grade: 85 }
    ],
    recentGrades: [
      { subject: "Algebra", assignment: "Linear Equations", score: 16, max: 20, date: "Dec 14", percentage: 80 },
      { subject: "Biology", assignment: "Cell Structure", score: 43, max: 50, date: "Dec 11", percentage: 86 },
      { subject: "History", assignment: "Civil War Essay", score: 88, max: 100, date: "Dec 9", percentage: 88 },
    ],
    achievements: [
      { title: "Honor Roll", date: "Nov 2024", icon: "award" },
      { title: "Science Project Winner", date: "Oct 2024", icon: "trophy" }
    ],
    upcomingEvents: [
      { title: "Algebra Test", date: "Dec 19", type: "test" },
      { title: "Winter Concert", date: "Dec 22", type: "event" },
      { title: "Progress Review", date: "Jan 5", type: "meeting" }
    ],
    behavior: {
      positive: 38,
      neutral: 15,
      negative: 7
    }
  }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);

  const getBehaviorData = () => [
    { name: 'Positive', value: selectedChild.behavior.positive, color: COLORS[0] },
    { name: 'Neutral', value: selectedChild.behavior.neutral, color: COLORS[1] },
    { name: 'Negative', value: selectedChild.behavior.negative, color: COLORS[2] }
  ];

  const getSubjectData = () => selectedChild.subjects.map(subject => ({
    name: subject.name,
    grade: subject.grade,
    color: COLORS[selectedChild.subjects.indexOf(subject) % COLORS.length]
  }));

  const getAttendanceData = () => selectedChild.weeklyAttendance.map(day => ({
    ...day,
    value: day.status === 'present' ? 100 : day.status === 'late' ? 50 : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Parent Dashboard</h1>
                <p className="text-sm text-muted-foreground">Monitor your children's progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Children Selection */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {mockChildren.map((child) => (
            <Card 
              key={child.id} 
              className={`min-w-0 flex-shrink-0 cursor-pointer transition-all hover:scale-105 ${
                selectedChild.id === child.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedChild(child)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{child.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.grade} Grade</p>
                    <Badge variant="secondary" className="text-xs">
                      {child.overallGrade}% Average
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Overall Grade</p>
                  <p className="text-2xl font-bold">{selectedChild.overallGrade}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance</p>
                  <p className="text-2xl font-bold">{selectedChild.attendance.percentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Achievements</p>
                  <p className="text-2xl font-bold">{selectedChild.achievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Behavior Score</p>
                  <p className="text-2xl font-bold">{Math.round((selectedChild.behavior.positive / (selectedChild.behavior.positive + selectedChild.behavior.negative)) * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Grade Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Grade Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedChild.gradeHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="grade" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getSubjectData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="grade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recent Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedChild.recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{grade.assignment}</p>
                        <p className="text-sm text-muted-foreground">{grade.subject} • {grade.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={grade.percentage >= 90 ? "default" : grade.percentage >= 80 ? "secondary" : "destructive"}>
                          {grade.score}/{grade.max}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{grade.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            {/* Subject Details */}
            <div className="grid gap-4">
              {selectedChild.subjects.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{subject.name}</h3>
                      <Badge variant={subject.grade >= 90 ? "default" : subject.grade >= 80 ? "secondary" : "destructive"}>
                        {subject.grade}%
                      </Badge>
                    </div>
                    <Progress value={subject.grade} className="h-2 mb-3" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last: {subject.lastAssignment}</span>
                      <span>{subject.lastScore}/{subject.maxScore}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Behavior Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Behavior Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getBehaviorData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getBehaviorData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {getBehaviorData().map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                      <p className="text-xs font-medium">{item.name}</p>
                      <p className="text-lg font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            {/* Weekly Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Week's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getAttendanceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{selectedChild.attendance.present}</p>
                    <p className="text-sm text-muted-foreground">Present Days</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{selectedChild.attendance.late}</p>
                    <p className="text-sm text-muted-foreground">Late Days</p>
                  </div>
                </div>
                <Progress value={selectedChild.attendance.percentage} className="h-3" />
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  {selectedChild.attendance.percentage}% attendance rate
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedChild.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedChild.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.type === 'test' ? 'bg-red-100 dark:bg-red-950' :
                        event.type === 'meeting' ? 'bg-blue-100 dark:bg-blue-950' : 
                        'bg-green-100 dark:bg-green-950'
                      }`}>
                        {event.type === 'test' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                         event.type === 'meeting' ? <User className="w-5 h-5 text-blue-500" /> :
                         <Calendar className="w-5 h-5 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Teacher Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {selectedChild.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedChild.teacher}</p>
                    <p className="text-sm text-muted-foreground">{selectedChild.class}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;