import React, { useState } from 'react';
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
import { useAppSelector } from '../store/hooks';

interface StudentDetails {
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

const Students: React.FC = () => {
  const courses = useAppSelector((state) => state.courses.courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Mock student data - replace with Redux state
  const [students] = useState<StudentDetails[]>([
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
  ]);

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

  const filteredStudents = students.filter((student) =>
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
                  <Typography variant="h3">{students.length}</Typography>
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
                  <Typography variant="h3">85%</Typography>
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
                  <Typography variant="h3">78%</Typography>
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
                {filteredStudents.map((student) => (
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
                            label={courses.find((c) => c.id === courseId)?.name}
                            size="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {Object.values(student.attendance).reduce((a, b) => a + b, 0) /
                        Object.values(student.attendance).length}
                      %
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${
                          Object.values(student.performance).reduce((a, b) => a + b, 0) /
                          Object.values(student.performance).length
                        }%`}
                        color={getPerformanceColor(
                          Object.values(student.performance).reduce((a, b) => a + b, 0) /
                            Object.values(student.performance).length
                        )}
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
                ))}
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
                    const course = courses.find((c) => c.id === courseId);
                    return (
                      <ListItem key={courseId}>
                        <ListItemAvatar>
                          <Avatar>
                            <SchoolIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={course?.name}
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
};

export default Students;
