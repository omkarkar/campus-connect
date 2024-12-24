import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore, useCoursesStore } from '../../store/mob/RootStore';
import { coursesStore } from '../../store/mob/CoursesStore';

const Courses = observer(() => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const user = authStore.user;
  const isProfessor = user?.role === 'professor';

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: user?.name || '',
    schedule: [],
    students: []
  });

  useEffect(() => {
    coursesStore.fetchCourses();
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setValidationError(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setValidationError(null);
    setNewCourse({
      title: '',
      description: '',
      instructor: user?.name || '',
      schedule: [],
      students: []
    });
  };

  const handleCreateCourse = async () => {
    // Validate inputs
    if (!newCourse.title.trim()) {
      setValidationError('Course title is required');
      return;
    }

    if (!newCourse.description.trim()) {
      setValidationError('Course description is required');
      return;
    }

    try {
      await coursesStore.addCourse({
        title: newCourse.title.trim(),
        description: newCourse.description.trim(),
        instructor: newCourse.instructor,
        schedule: [],
        students: []
      });
      handleCloseDialog();
    } catch (error) {
      setValidationError('Failed to create course. Please try again.');
    }
  };

  const filteredCourses = coursesStore.courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h4">Courses</Typography>
          {isProfessor && (
              <Fab
                  color="primary"
                  aria-label="add course"
                  onClick={handleOpenDialog}
                  sx={{ ml: 2 }}
              >
                <AddIcon />
              </Fab>
          )}
        </Box>

        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
              ),
            }}
        />

        {coursesStore.loading ? (
            <Typography>Loading courses...</Typography>
        ) : coursesStore.error ? (
            <Typography color="error">{coursesStore.error}</Typography>
        ) : (
            <Grid container spacing={3}>
              {filteredCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => handleCourseClick(course.id)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PeopleIcon sx={{ mr: 1 }} color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {course.students.length} Students
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventIcon sx={{ mr: 1 }} color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {course.schedule.length} Sessions
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${course.id}`);
                            }}
                        >
                          View Details
                        </Button>
                        {isProfessor && (
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement edit course functionality
                                }}
                            >
                              <EditIcon />
                            </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}

        {/* Create Course Dialog */}
        <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
        >
          <DialogTitle>Create New Course</DialogTitle>
          <DialogContent>
            {validationError && (
                <Typography
                    color="error"
                    variant="body2"
                    sx={{ mb: 2 }}
                >
                  {validationError}
                </Typography>
            )}
            <TextField
                autoFocus
                margin="dense"
                label="Course Title"
                type="text"
                fullWidth
                value={newCourse.title}
                onChange={(e) => {
                  setNewCourse({ ...newCourse, title: e.target.value });
                  setValidationError(null);
                }}
                sx={{ mb: 2 }}
                error={!!validationError && !newCourse.title.trim()}
                helperText={!!validationError && !newCourse.title.trim() ? 'Course title is required' : ''}
            />
            <TextField
                margin="dense"
                label="Course Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={newCourse.description}
                onChange={(e) => {
                  setNewCourse({ ...newCourse, description: e.target.value });
                  setValidationError(null);
                }}
                error={!!validationError && !newCourse.description.trim()}
                helperText={!!validationError && !newCourse.description.trim() ? 'Course description is required' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
                onClick={handleCreateCourse}
                variant="contained"
                color="primary"
                disabled={coursesStore.loading}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
});

export default Courses;