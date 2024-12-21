import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Grid,
  IconButton,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCurrentCourse } from '../../store/slices/coursesSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) => state.courses.currentCourse);
  const user = useAppSelector((state) => state.auth.user);
  const notes = useAppSelector((state) => state.courses.notes);
  const isProfessor = user?.role === 'professor';

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (courseId) {
      // In a real app, you would fetch the course details here
      const currentCourse = useAppSelector((state) => 
        state.courses.courses.find(c => c.id === courseId)
      );
      if (currentCourse) {
        dispatch(setCurrentCourse(currentCourse));
      }
    }
  }, [courseId, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!course) {
    return <Typography>Course not found</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">{course.name}</Typography>
          {isProfessor && (
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<PeopleIcon />}
            label={`${course.students.length} Students`}
            variant="outlined"
          />
          <Chip
            icon={<EventIcon />}
            label={`${course.schedule.length} Sessions`}
            variant="outlined"
          />
        </Box>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="course tabs">
          <Tab label="Overview" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Students" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Notes" icon={<NoteIcon />} iconPosition="start" />
          <Tab label="Assignments" icon={<AssignmentIcon />} iconPosition="start" />
          {isProfessor && <Tab label="Grades" icon={<GradeIcon />} iconPosition="start" />}
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Schedule
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Room</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.schedule.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {new Date(session.dayOfWeek).toLocaleDateString('en-US', { weekday: 'long' })}
                        </TableCell>
                        <TableCell>{`${session.startTime} - ${session.endTime}`}</TableCell>
                        <TableCell>{session.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {isProfessor && (
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Add Session
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Students Tab */}
      <TabPanel value={tabValue} index={1}>
        <List>
          {course.students.map((studentId) => (
            <ListItem key={studentId}>
              <ListItemAvatar>
                <Avatar>
                  <PeopleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Student Name" // Replace with actual student data
                secondary="student@example.com"
              />
            </ListItem>
          ))}
        </List>
        {isProfessor && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Add Student
          </Button>
        )}
      </TabPanel>

      {/* Notes Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {notes
            .filter((note) => note.courseId === course.id)
            .map((note) => (
              <Grid item xs={12} md={6} key={note.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1">{note.content}</Typography>
                </Paper>
              </Grid>
            ))}
        </Grid>
        {isProfessor && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Add Note
          </Button>
        )}
      </TabPanel>

      {/* Assignments Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography>Assignments content</Typography>
      </TabPanel>

      {/* Grades Tab (Professor Only) */}
      {isProfessor && (
        <TabPanel value={tabValue} index={4}>
          <Typography>Grades content</Typography>
        </TabPanel>
      )}
    </Box>
  );
};

export default CourseDetail;
