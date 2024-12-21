import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
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
import { useAppSelector, useAppDispatch } from '../../store/hooks';

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  totalPoints: number;
  attachments?: string[];
  submissions?: {
    studentId: string;
    submittedAt: string;
    files: string[];
    grade?: number;
    feedback?: string;
  }[];
}

const Assignments: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courses);
  const isProfessor = user?.role === 'professor';

  // Mock assignments - replace with Redux state
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Database Design Project',
      description: 'Create an ER diagram and implement the database schema',
      courseId: '1',
      dueDate: '2024-02-20T23:59:59',
      totalPoints: 100,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    totalPoints: 100,
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAssignment({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      totalPoints: 100,
    });
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.courseId && newAssignment.dueDate) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        title: newAssignment.title,
        description: newAssignment.description || '',
        courseId: newAssignment.courseId,
        dueDate: newAssignment.dueDate,
        totalPoints: newAssignment.totalPoints || 100,
        submissions: [],
      };
      setAssignments([...assignments, assignment]);
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
  };

  const handleSubmitAssignment = () => {
    // Handle file upload and submission
    handleCloseSubmitDialog();
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const submission = assignment.submissions?.find(
      (sub) => sub.studentId === user?.id
    );

    if (submission) {
      return {
        label: 'Submitted',
        color: 'success' as const,
        icon: <CheckCircleIcon />,
      };
    }

    if (now > dueDate) {
      return {
        label: 'Overdue',
        color: 'error' as const,
        icon: <ScheduleIcon />,
      };
    }

    return {
      label: 'Pending',
      color: 'warning' as const,
      icon: <ScheduleIcon />,
    };
  };

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
                    <Chip
                      icon={status.icon}
                      label={status.label}
                      color={status.color}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course?.name}
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
                      disabled={status.label === 'Submitted'}
                    >
                      Submit
                    </Button>
                  )}
                  {isProfessor && (
                    <>
                      <Button startIcon={<EditIcon />}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} color="error">
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
                  {course.name}
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
            value={newAssignment.dueDate}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, dueDate: e.target.value })
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
            <Typography variant="subtitle1" gutterBottom>
              {selectedAssignment?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due: {selectedAssignment?.dueDate}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AttachFileIcon />}
            component="label"
            sx={{ mb: 2 }}
          >
            Upload Files
            <input type="file" hidden multiple />
          </Button>
          <TextField
            label="Comments"
            multiline
            rows={4}
            fullWidth
            placeholder="Add any comments for your submission..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments;
