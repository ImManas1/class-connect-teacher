import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogOut,
  GraduationCap
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  grade: string;
  class_id: string;
}

interface Class {
  id: string;
  name: string;
  subject: string;
  teacher_id: string;
}

interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: string;
}

interface Grade {
  id: string;
  student_id: string;
  assignment: string;
  grade: number;
  max_grade: number;
  date_assigned: string;
}

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

const ParentDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      await fetchUserData(session.user.id);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/');
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData?.role !== 'parent') {
        navigate('/dashboard');
        return;
      }

      setProfile(profileData);

      // Fetch children
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', profileData.id);

      setStudents(studentsData || []);

      if (studentsData && studentsData.length > 0) {
        const studentIds = studentsData.map(s => s.id);
        const classIds = studentsData.map(s => s.class_id).filter(Boolean);

        // Fetch classes
        if (classIds.length > 0) {
          const { data: classesData } = await supabase
            .from('classes')
            .select('*')
            .in('id', classIds);

          setClasses(classesData || []);
        }

        // Fetch attendance (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*')
          .in('student_id', studentIds)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });

        setAttendance(attendanceData || []);

        // Fetch recent grades
        const { data: gradesData } = await supabase
          .from('grades')
          .select('*')
          .in('student_id', studentIds)
          .order('date_assigned', { ascending: false })
          .limit(10);

        setGrades(gradesData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getAttendanceStats = (studentId: string) => {
    const studentAttendance = attendance.filter(a => a.student_id === studentId);
    const total = studentAttendance.length;
    const present = studentAttendance.filter(a => a.status === 'present').length;
    const late = studentAttendance.filter(a => a.status === 'late').length;
    const absent = studentAttendance.filter(a => a.status === 'absent').length;
    
    return {
      total,
      present,
      late,
      absent,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0
    };
  };

  const getAverageGrade = (studentId: string) => {
    const studentGrades = grades.filter(g => g.student_id === studentId);
    if (studentGrades.length === 0) return null;
    
    const totalPoints = studentGrades.reduce((sum, g) => sum + (g.grade / g.max_grade) * 100, 0);
    return Math.round(totalPoints / studentGrades.length);
  };

  const getRecentGrades = (studentId: string, limit = 3) => {
    return grades
      .filter(g => g.student_id === studentId)
      .slice(0, limit);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {students.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Children Found</h3>
              <p className="text-muted-foreground">
                Contact your school administrator to link your children to your account.
              </p>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => {
            const attendanceStats = getAttendanceStats(student.id);
            const averageGrade = getAverageGrade(student.id);
            const recentGrades = getRecentGrades(student.id);
            const studentClass = classes.find(c => c.id === student.class_id);

            return (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>Grade {student.grade}</span>
                        {studentClass && (
                          <>
                            <span>•</span>
                            <span>{studentClass.name}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Attendance Overview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Attendance (Last 30 Days)
                      </h4>
                      <Badge variant={attendanceStats.percentage >= 90 ? "default" : "destructive"}>
                        {attendanceStats.percentage}%
                      </Badge>
                    </div>
                    <Progress value={attendanceStats.percentage} className="h-2 mb-3" />
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Present: {attendanceStats.present}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Late: {attendanceStats.late}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Absent: {attendanceStats.absent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Academic Performance
                      </h4>
                      {averageGrade && (
                        <Badge variant={averageGrade >= 80 ? "default" : averageGrade >= 70 ? "secondary" : "destructive"}>
                          {averageGrade}% Average
                        </Badge>
                      )}
                    </div>
                    
                    {recentGrades.length > 0 ? (
                      <div className="space-y-2">
                        {recentGrades.map((grade) => (
                          <div key={grade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{grade.assignment}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(grade.date_assigned).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              (grade.grade / grade.max_grade) * 100 >= 80 ? "default" : 
                              (grade.grade / grade.max_grade) * 100 >= 70 ? "secondary" : "destructive"
                            }>
                              {grade.grade}/{grade.max_grade}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 text-muted-foreground">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent grades available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;