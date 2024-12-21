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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Grade as GradeIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assignmentId: string;
  score: number;
  totalPoints: number;
  feedback?: string;
  gradedAt: string;
}

const Grades: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courses);
  const isProfessor = user?.role === 'professor';

  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  // Mock grades data - replace with Redux state
  const [grades] = useState<Grade[]>([
    {
      id: '1',
      studentId: '1',
      courseId: '1',
      assignmentId: '1',
      score: 85,
      totalPoints: 100,
      feedback: 'Good work! Consider adding more details to your explanations.',
      gradedAt: new Date().toISOString(),
    },
  ]);

  const handleOpenGradeDialog = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsGradeDialogOpen(true);
  };

  const handleCloseGradeDialog = () => {
    setIsGradeDialogOpen(false);
    setSelectedGrade(null);
  };

  const getGradeColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const calculateCourseAverage = (courseId: string) => {
    const courseGrades = grades.filter((grade) => grade.courseId === courseId);
    if (courseGrades.length === 0) return 0;

    const total = courseGrades.reduce(
      (sum, grade) => sum + (grade.score / grade.totalPoints) * 100,
      0
    );
    return total / courseGrades.length;
  };

  const filteredGrades = grades.filter(
    (grade) => selectedCourse === 'all' || grade.courseId === selectedCourse
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Grades</Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Filter by Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <MenuItem value="all">All Courses</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Course Overview Cards */}
        {!isProfessor && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {courses.map((course) => {
                const average = calculateCourseAverage(course.id);
                return (
                  <Grid item xs={12} md={4} key={course.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <GradeIcon sx={{ mr: 1 }} />
                        <Typography variant="h4">{average.toFixed(1)}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={average}
                        color={getGradeColor(average, 100) as any}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}

        {/* Grades Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assignment</TableCell>
                  {isProfessor && <TableCell>Student</TableCell>}
                  <TableCell>Course</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell>Feedback</TableCell>
                  {isProfessor && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrades.map((grade) => {
                  const course = courses.find((c) => c.id === grade.courseId);
                  const percentage = (grade.score / grade.totalPoints) * 100;
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>Assignment Name</TableCell>
                      {isProfessor && <TableCell>Student Name</TableCell>}
                      <TableCell>{course?.name}</TableCell>
                      <TableCell align="right">
                        {grade.score} / {grade.totalPoints}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${percentage.toFixed(1)}%`}
                          color={getGradeColor(grade.score, grade.totalPoints)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{grade.feedback}</TableCell>
                      {isProfessor && (
                        <TableCell align="right">
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenGradeDialog(grade)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit Grade Dialog */}
      <Dialog open={isGradeDialogOpen} onClose={handleCloseGradeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Grade</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Score"
            type="number"
            fullWidth
            value={selectedGrade?.score || ''}
            InputProps={{
              inputProps: { min: 0, max: selectedGrade?.totalPoints },
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Feedback"
            multiline
            rows={4}
            fullWidth
            value={selectedGrade?.feedback || ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradeDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Grades;
