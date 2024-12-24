import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  useCoursesStore,
  useAuthStore
} from '../store/mob/RootStore';

// Define StudentDetails interface
export interface StudentDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  attendance: {
    [courseId: string]: number; // percentage
  };
  performance: {
    [courseId: string]: number; // percentage
  };
}

// Create a Students Store
export class StudentsStore {
  students: StudentDetails[] = [];
  loading: boolean = false;
  error: string | null = null;

  fetchStudents = async () => {
    this.loading = true;
    this.error = null;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock student data
      this.students = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          enrolledCourses: ['1', '2'],
          attendance: {
            '1': 85,
            '2': 90,
          },
          performance: {
            '1': 88,
            '2': 92,
          },
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          enrolledCourses: ['1'],
          attendance: {
            '1': 92,
          },
          performance: {
            '1': 95,
          },
        }
      ];
    } catch (error) {
      this.error = 'Failed to fetch students';
    } finally {
      this.loading = false;
    }
  };

  // Additional methods can be added here for student management
  addStudent = (student: StudentDetails) => {
    this.students.push(student);
  };

  updateStudent = (studentId: string, updates: Partial<StudentDetails>) => {
    const index = this.students.findIndex(s => s.id === studentId);
    if (index !== -1) {
      this.students[index] = {
        ...this.students[index],
        ...updates
      };
    }
  };

  calculateTotalStudents = () => this.students.length;

  calculateAverageAttendance = () => {
    if (this.students.length === 0) return 0;

    const totalAttendance = this.students.reduce((sum, student) => {
      const studentAttendance = Object.values(student.attendance).reduce((a, b) => a + b, 0) /
          Object.values(student.attendance).length;
      return sum + studentAttendance;
    }, 0);

    return Math.round(totalAttendance / this.students.length);
  };

  calculateAveragePerformance = () => {
    if (this.students.length === 0) return 0;

    const totalPerformance = this.students.reduce((sum, student) => {
      const studentPerformance = Object.values(student.performance).reduce((a, b) => a + b, 0) /
          Object.values(student.performance).length;
      return sum + studentPerformance;
    }, 0);

    return Math.round(totalPerformance / this.students.length);
  };
}

export const studentsStore = new StudentsStore();

const Students = observer(() => {
  const coursesStore = useCoursesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    studentsStore.fetchStudents();
  }, []);

  const handleOpenDetails = (student: StudentDetails) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedStudent(null);
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const filteredStudents = studentsStore.students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">Students</Typography>
              <TextField
                  placeholder="Search students..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 300 }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                    ),
                  }}
              />
            </Box>
          </Grid>

          {/* Student Overview Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Students</Typography>
                    </Box>
                    <Typography variant="h3">
                      {studentsStore.calculateTotalStudents()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssignmentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Average Attendance</Typography>
                    </Box>
                    <Typography variant="h3">
                      {studentsStore.calculateAverageAttendance()}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimelineIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Average Performance</Typography>
                    </Box>
                    <Typography variant="h3">
                      {studentsStore.calculateAveragePerformance()}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Students Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Enrolled Courses</TableCell>
                    <TableCell align="right">Attendance</TableCell>
                    <TableCell align="right">Performance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const avgAttendance = Object.values(student.attendance).reduce((a, b) => a + b, 0) /
                        Object.values(student.attendance).length;
                    const avgPerformance = Object.values(student.performance).reduce((a, b) => a + b, 0) /
                        Object.values(student.performance).length;

                    return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2 }}>{student.name[0]}</Avatar>
                              <Typography>{student.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {student.enrolledCourses.map((courseId) => (
                                  <Chip
                                      key={courseId}
                                      label={coursesStore.courses.find((c) => c.id === courseId)?.title}
                                      size="small"
                                  />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{avgAttendance.toFixed(0)}%</TableCell>
                          <TableCell align="right">
                            <Chip
                                label={`${avgPerformance.toFixed(0)}%`}
                                color={getPerformanceColor(avgPerformance)}
                                size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => handleOpenDetails(student)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Student Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle>Student Details</DialogTitle>
          <DialogContent>
            {selectedStudent && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                        {selectedStudent.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{selectedStudent.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                            <Typography variant="body2">{selectedStudent.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                            <Typography variant="body2">{selectedStudent.phone}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Course Performance
                    </Typography>
                    <List>
                      {selectedStudent.enrolledCourses.map((courseId) => {
                        const course = coursesStore.courses.find((c) => c.id === courseId);
                        return (
                            <ListItem key={courseId}>
                              <ListItemAvatar>
                                <Avatar>
                                  <SchoolIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                  primary={course?.title}
                                  secondary={
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                      <Typography variant="body2">
                                        Attendance: {selectedStudent.attendance[courseId]}%
                                      </Typography>
                                      <Typography variant="body2">
                                        Performance: {selectedStudent.performance[courseId]}%
                                      </Typography>
                                    </Box>
                                  }
                              />
                            </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
});

export default Students;