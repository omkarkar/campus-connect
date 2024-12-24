import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {useCoursesStore} from "../store/mob/RootStore";

interface CourseAnalytics {
  courseId: string;
  averageGrade: number;
  attendanceRate: number;
  assignmentCompletion: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  topPerformers: string[];
  needsImprovement: string[];
}

const Analytics = () => {
  const coursesStore = useCoursesStore();
  const { courses } = coursesStore;
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Mock analytics data - replace with Redux state
  const [analytics] = useState<CourseAnalytics[]>([
    {
      courseId: '1',
      averageGrade: 85,
      attendanceRate: 92,
      assignmentCompletion: 88,
      gradeDistribution: {
        A: 30,
        B: 40,
        C: 20,
        D: 8,
        F: 2,
      },
      topPerformers: ['1', '2', '3'],
      needsImprovement: ['4', '5'],
    },
  ]);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const overallStats = {
    averageGrade: analytics.reduce((acc, curr) => acc + curr.averageGrade, 0) / analytics.length,
    attendanceRate: analytics.reduce((acc, curr) => acc + curr.attendanceRate, 0) / analytics.length,
    assignmentCompletion:
      analytics.reduce((acc, curr) => acc + curr.assignmentCompletion, 0) / analytics.length,
  };

  const currentAnalytics =
    selectedCourse === 'all'
      ? null
      : analytics.find((a) => a.courseId === selectedCourse);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Analytics</Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Select Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <MenuItem value="all">All Courses</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Overview Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Average Grade</Typography>
                  </Box>
                  <Typography variant="h3">
                    {currentAnalytics?.averageGrade || overallStats.averageGrade}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={currentAnalytics?.averageGrade || overallStats.averageGrade}
                    color={getGradeColor(
                      currentAnalytics?.averageGrade || overallStats.averageGrade
                    )}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Attendance Rate</Typography>
                  </Box>
                  <Typography variant="h3">
                    {currentAnalytics?.attendanceRate || overallStats.attendanceRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={currentAnalytics?.attendanceRate || overallStats.attendanceRate}
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssignmentIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Assignment Completion</Typography>
                  </Box>
                  <Typography variant="h3">
                    {currentAnalytics?.assignmentCompletion ||
                      overallStats.assignmentCompletion}
                    %
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      currentAnalytics?.assignmentCompletion ||
                      overallStats.assignmentCompletion
                    }
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {currentAnalytics && (
          <>
            {/* Grade Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Grade</TableCell>
                        <TableCell>Percentage</TableCell>
                        <TableCell>Distribution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(currentAnalytics.gradeDistribution).map(
                        ([grade, percentage]) => (
                          <TableRow key={grade}>
                            <TableCell>{grade}</TableCell>
                            <TableCell>{percentage}%</TableCell>
                            <TableCell>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{ height: 10, borderRadius: 5 }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Student Performance */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Student Performance
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Top Performers
                  </Typography>
                  <Grid container spacing={1}>
                    {currentAnalytics.topPerformers.map((studentId) => (
                      <Grid item key={studentId}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon sx={{ mr: 1 }} color="primary" />
                          <Typography>Student {studentId}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Needs Improvement
                  </Typography>
                  <Grid container spacing={1}>
                    {currentAnalytics.needsImprovement.map((studentId) => (
                      <Grid item key={studentId}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon sx={{ mr: 1 }} color="error" />
                          <Typography>Student {studentId}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Analytics;
