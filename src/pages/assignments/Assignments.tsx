import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAssignmentStore, useAuthStore, useCoursesStore } from "../../store/mob/RootStore";
import { observer } from "mobx-react-lite";
import { Assignment } from "../../store/mob/AssignmentStore";

const Assignments = observer(() => {
  const authStore = useAuthStore();
  const coursesStore = useCoursesStore();
  const assignmentStore = useAssignmentStore();

  const { user } = authStore;
  const { courses } = coursesStore;
  const { assignments, loading, error } = assignmentStore;
  const isProfessor = user?.role === 'professor';

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [comment, setComment] = useState('');
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    courseId: '',
    dueDate: new Date(),
    totalPoints: 100,
  });

  useEffect(() => {
    assignmentStore.fetchAssignments();
    return () => {
      if (selectedFiles) {
        Array.from(selectedFiles).forEach(file => {
          URL.revokeObjectURL(URL.createObjectURL(file));
        });
      }
    };
  }, [assignmentStore]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAssignment({
      title: '',
      description: '',
      courseId: '',
      dueDate: new Date(),
      totalPoints: 100,
    });
  };

  const handleCreateAssignment = async () => {
    if (newAssignment.title && newAssignment.courseId && newAssignment.dueDate) {
      // Convert string to Date if it's not already a Date object
      const dueDate = newAssignment.dueDate instanceof Date 
        ? newAssignment.dueDate 
        : new Date(newAssignment.dueDate);

      await assignmentStore.addAssignment({
        title: newAssignment.title,
        description: newAssignment.description || '',
        courseId: newAssignment.courseId,
        dueDate: dueDate,
        totalPoints: newAssignment.totalPoints || 100,
      });
      handleCloseDialog();
    }
  };

  const handleOpenSubmitDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitDialogOpen(true);
  };

  const handleCloseSubmitDialog = () => {
    setIsSubmitDialogOpen(false);
    setSelectedAssignment(null);
    setSelectedFiles(null);
    setComment('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleSubmitAssignment = async () => {
    if (selectedAssignment && user && selectedFiles) {
      const fileUrls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      await assignmentStore.submitAssignment(
          selectedAssignment.id,
          user.id,
          fileUrls,
          comment
      );
      handleCloseSubmitDialog();
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    await assignmentStore.deleteAssignment(assignmentId);
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!user) return null;
    const status = assignmentStore.getAssignmentStatus(assignment.id, user.id);

    switch (status?.status) {
      case 'submitted':
        return {
          label: 'Submitted',
          color: 'success' as const,
          icon: <CheckCircleIcon />,
        };
      case 'overdue':
        return {
          label: 'Overdue',
          color: 'error' as const,
          icon: <ScheduleIcon />,
        };
      default:
        return {
          label: 'Pending',
          color: 'warning' as const,
          icon: <ScheduleIcon />,
        };
    }
  };

  if (loading) {
    return (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ mt: 2 }}>
          <Typography color="error">
            Error: {error}
          </Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">Assignments</Typography>
              {isProfessor && (
                  <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenDialog}
                  >
                    Create Assignment
                  </Button>
              )}
            </Box>
          </Grid>

          {assignments.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const course = courses.find((c) => c.id === assignment.courseId);

            return (
                <Grid item xs={12} md={6} key={assignment.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{assignment.title}</Typography>
                        {status && (
                            <Chip
                                icon={status.icon}
                                label={status.label}
                                color={status.color}
                                size="small"
                            />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {course?.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {assignment.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Points: {assignment.totalPoints}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      {!isProfessor && (
                          <Button
                              startIcon={<UploadIcon />}
                              onClick={() => handleOpenSubmitDialog(assignment)}
                              disabled={status?.label === 'Submitted'}
                          >
                            Submit
                          </Button>
                      )}
                      {isProfessor && (
                          <>
                            <Button startIcon={<EditIcon />}>Edit</Button>
                            <Button
                                startIcon={<DeleteIcon />}
                                color="error"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              Delete
                            </Button>
                          </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
            );
          })}
        </Grid>

        {/* Create Assignment Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Assignment Title"
                fullWidth
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                  value={newAssignment.courseId}
                  label="Course"
                  onChange={(e) =>
                      setNewAssignment({ ...newAssignment, courseId: e.target.value })
                  }
              >
                {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={newAssignment.description}
                onChange={(e) =>
                    setNewAssignment({ ...newAssignment, description: e.target.value })
                }
                sx={{ mb: 2 }}
            />

            <TextField
                label="Due Date"
                type="datetime-local"
                fullWidth
                value={
                  newAssignment.dueDate instanceof Date 
                    ? newAssignment.dueDate.toISOString().slice(0, 16) 
                    : newAssignment.dueDate
                }
                onChange={(e) =>
                    setNewAssignment({ ...newAssignment, dueDate: new Date(e.target.value) })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Total Points"
                type="number"
                fullWidth
                value={newAssignment.totalPoints}
                onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      totalPoints: parseInt(e.target.value),
                    })
                }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCreateAssignment} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submit Assignment Dialog */}
        <Dialog
            open={isSubmitDialogOpen}
            onClose={handleCloseSubmitDialog}
            maxWidth="sm"
            fullWidth
        >
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {selectedAssignment?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {selectedAssignment?.dueDate ? new Date(selectedAssignment.dueDate).toLocaleString() : ''}
              </Typography>
            </Box>
            <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                component="label"
                sx={{ mb: 2 }}
            >
              Upload Files
              <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileSelect}
              />
            </Button>
            {selectedFiles && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Selected files: {Array.from(selectedFiles).map(f => f.name).join(', ')}
                  </Typography>
                </Box>
            )}
            <TextField
                label="Comments"
                multiline
                rows={4}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any comments for your submission..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
            <Button
                onClick={handleSubmitAssignment}
                variant="contained"
                color="primary"
                disabled={!selectedFiles}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
});

export default Assignments;
