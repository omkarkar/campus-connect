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
import { observer } from 'mobx-react-lite';
import {
  useAuthStore,
  useCoursesStore,
  useGradesStore
} from '../../store/mob/RootStore';

const Grades = observer(() => {
  const authStore = useAuthStore();
  const coursesStore = useCoursesStore();
  const gradesStore = useGradesStore();

  const user = authStore.user;
  const isProfessor = user?.role === 'professor';

  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [editScore, setEditScore] = useState<number>(0);
  const [editFeedback, setEditFeedback] = useState<string>('');

  useEffect(() => {
    gradesStore.fetchGrades(
        selectedCourse === 'all' ? undefined : selectedCourse
    );
  }, [selectedCourse]);

  const handleOpenGradeDialog = (grade: any) => {
    gradesStore.setSelectedGrade(grade.id);
    if (gradesStore.selectedGrade) {
      setEditScore(gradesStore.selectedGrade.score);
      setEditFeedback(gradesStore.selectedGrade.feedback || '');
      setIsGradeDialogOpen(true);
    }
  };

  const handleCloseGradeDialog = () => {
    setIsGradeDialogOpen(false);
    gradesStore.setSelectedGrade(null);
  };

  const handleSaveGrade = async () => {
    if (gradesStore.selectedGrade) {
      await gradesStore.gradeSubmission(
          gradesStore.selectedGrade.id,
          editScore,
          editFeedback
      );
      handleCloseGradeDialog();
    }
  };

  const getGradeColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const filteredGrades = gradesStore.grades.filter(
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
                  {coursesStore.courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
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
                  {coursesStore.courses.map((course) => {
                    const average = gradesStore.calculateCourseAverage(course.id);
                    return (
                        <Grid item xs={12} md={4} key={course.id}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {course.title}
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
                    const course = coursesStore.courses.find((c) => c.id === grade.courseId);
                    const percentage = (grade.score / grade.totalPoints) * 100;
                    return (
                        <TableRow key={grade.id}>
                          <TableCell>Assignment Name</TableCell>
                          {isProfessor && <TableCell>Student Name</TableCell>}
                          <TableCell>{course?.title}</TableCell>
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
        <Dialog
            open={isGradeDialogOpen}
            onClose={handleCloseGradeDialog}
            maxWidth="sm"
            fullWidth
        >
          <DialogTitle>Edit Grade</DialogTitle>
          <DialogContent>
            <TextField
                margin="dense"
                label="Score"
                type="number"
                fullWidth
                value={editScore}
                onChange={(e) => setEditScore(Number(e.target.value))}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: gradesStore.selectedGrade?.totalPoints
                  },
                }}
                sx={{ mb: 2 }}
            />
            <TextField
                margin="dense"
                label="Feedback"
                multiline
                rows={4}
                fullWidth
                value={editFeedback}
                onChange={(e) => setEditFeedback(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseGradeDialog}>Cancel</Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveGrade}
                disabled={gradesStore.loading}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
});

export default Grades;