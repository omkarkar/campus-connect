import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Class as ClassIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  useCoursesStore,
  useAuthStore
} from '../../store/mob/RootStore';
import { Note } from '../../store/mob/CoursesStore';

const Notes = observer(() => {
  const coursesStore = useCoursesStore();
  const authStore = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    courseId: '',
    link: ''
  });

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNewNote({
        title: note.title,
        content: note.content,
        courseId: note.courseId,
        link: note.link || ''
      });
    } else {
      setEditingNote(null);
      setNewNote({
        title: '',
        content: '',
        courseId: '',
        link: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewNote({
      title: '',
      content: '',
      courseId: '',
      link: ''
    });
    setEditingNote(null);
  };

  const handleSaveNote = () => {
    if (newNote.title && newNote.content && newNote.courseId) {
      if (editingNote) {
        coursesStore.updateNote({
          ...editingNote,
          title: newNote.title,
          content: newNote.content,
          courseId: newNote.courseId,
          link: newNote.link || undefined
        });
      } else {
        coursesStore.addNote({
          title: newNote.title,
          content: newNote.content,
          courseId: newNote.courseId,
          link: newNote.link || undefined
        });
      }
      handleCloseDialog();
    }
  };

  const handleDeleteNote = (noteId: string) => {
    coursesStore.deleteNote(noteId);
  };

  const filteredNotes = coursesStore.notes.filter(
      (note) =>
          (selectedCourse === 'all' || note.courseId === selectedCourse) &&
          (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">Course Notes</Typography>
              <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
              >
                Add Note
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                      fullWidth
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                        ),
                      }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
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
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {filteredNotes.map((note) => (
              <Grid item xs={12} md={6} key={note.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{note.title}</Typography>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(note)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteNote(note.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ClassIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      {coursesStore.courses.find((course) => course.id === note.courseId)?.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {note.content}
                  </Typography>
                  {note.link && (
                      <Typography variant="caption" color="primary">
                        <a href={note.link} target="_blank" rel="noopener noreferrer">
                          {note.link}
                        </a>
                      </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
          ))}
        </Grid>

        {/* Create/Edit Note Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Note Title"
                fullWidth
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                  value={newNote.courseId}
                  label="Course"
                  onChange={(e) => setNewNote({ ...newNote, courseId: e.target.value })}
              >
                {coursesStore.courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
                label="Content"
                multiline
                rows={6}
                fullWidth
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Optional Link"
                fullWidth
                value={newNote.link}
                onChange={(e) => setNewNote({ ...newNote, link: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
                onClick={handleSaveNote}
                variant="contained"
                color="primary"
                disabled={!newNote.title || !newNote.content || !newNote.courseId}
            >
              {editingNote ? 'Save Changes' : 'Create Note'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
});

export default Notes;