import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Event as EventIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Class as ClassIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, isSameDay } from 'date-fns';
import { observer } from 'mobx-react-lite';
import {
  useAuthStore,
  useCoursesStore
} from '../store/mob/RootStore';

// Create a new store for Events if not already existing
export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  courseId?: string;
  type: 'class' | 'exam' | 'assignment' | 'other';
}

export class EventsStore {
  events: Event[] = [];
  loading: boolean = false;
  error: string | null = null;

  addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: String(Date.now())
    };
    this.events.push(newEvent);
  };

  deleteEvent = (eventId: string) => {
    this.events = this.events.filter(event => event.id !== eventId);
  };

  fetchEvents = async () => {
    this.loading = true;
    this.error = null;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock events
      this.events = [
        {
          id: '1',
          title: 'Database Systems Lecture',
          date: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          courseId: '1',
          type: 'class',
        }
      ];
    } catch (error) {
      this.error = 'Failed to fetch events';
    } finally {
      this.loading = false;
    }
  };
}

export const eventsStore = new EventsStore();

const Calendar = observer(() => {
  const coursesStore = useCoursesStore();
  const authStore = useAuthStore();
  const user = authStore.user;
  const isProfessor = user?.role === 'professor';

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    type: 'other',
  });

  useEffect(() => {
    eventsStore.fetchEvents();
  }, []);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      type: 'other',
    });
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      eventsStore.addEvent({
        title: newEvent.title,
        date: newEvent.date,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        courseId: newEvent.courseId,
        type: newEvent.type as 'class' | 'exam' | 'assignment' | 'other',
      });
      handleCloseDialog();
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    eventsStore.deleteEvent(eventId);
  };

  const filteredEvents = eventsStore.events.filter(
      event =>
          (selectedCourseFilter === 'all' || event.courseId === selectedCourseFilter) &&
          isSameDay(event.date, selectedDate)
  );

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'class':
        return 'primary';
      case 'exam':
        return 'error';
      case 'assignment':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">Calendar</Typography>
                  {isProfessor && (
                      <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleOpenDialog}
                      >
                        Add Event
                      </Button>
                  )}
                </Box>
                <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Events for {format(selectedDate, 'MMMM d, yyyy')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Filter by Course</InputLabel>
                  <Select
                      value={selectedCourseFilter}
                      label="Filter by Course"
                      onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Events</MenuItem>
                    {coursesStore.courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.title}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <List>
                  {filteredEvents.map((event) => (
                      <ListItem
                          key={event.id}
                          secondaryAction={
                              isProfessor && (
                                  <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                              )
                          }
                      >
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={event.title}
                            secondary={
                              <>
                                {format(event.startTime, 'h:mm a')} -{' '}
                                {format(event.endTime, 'h:mm a')}
                                <br />
                                <Chip
                                    size="small"
                                    label={event.type}
                                    color={getEventTypeColor(event.type)}
                                    sx={{ mt: 1 }}
                                />
                              </>
                            }
                        />
                      </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Create Event Dialog */}
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
              <TextField
                  autoFocus
                  margin="dense"
                  label="Event Title"
                  fullWidth
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Event Type</InputLabel>
                <Select
                    value={newEvent.type}
                    label="Event Type"
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })
                    }
                >
                  <MenuItem value="class">Class</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Course</InputLabel>
                <Select
                    value={newEvent.courseId || ''}
                    label="Course"
                    onChange={(e) => setNewEvent({ ...newEvent, courseId: e.target.value })}
                >
                  {coursesStore.courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TimePicker
                  label="Start Time"
                  value={newEvent.startTime}
                  onChange={(newValue) =>
                      setNewEvent({ ...newEvent, startTime: newValue || new Date() })
                  }
                  sx={{ mb: 2 }}
              />

              <TimePicker
                  label="End Time"
                  value={newEvent.endTime}
                  onChange={(newValue) =>
                      setNewEvent({ ...newEvent, endTime: newValue || new Date() })
                  }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                  onClick={handleCreateEvent}
                  variant="contained"
                  color="primary"
                  disabled={!newEvent.title}
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
  );
});

export default Calendar;