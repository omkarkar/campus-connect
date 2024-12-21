import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Class as ClassIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courses);
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const isProfessor = user?.role === 'professor';

  // Mock data - replace with actual data from Redux store
  const upcomingEvents = [
    { id: 1, title: 'Database Systems Exam', date: '2024-02-15', type: 'exam' },
    { id: 2, title: 'Web Development Project Due', date: '2024-02-18', type: 'assignment' },
  ];

  const recentActivities = [
    { id: 1, title: 'Assignment graded: Web Development', time: '2 hours ago' },
    { id: 2, title: 'New note added: Database Indexing', time: '5 hours ago' },
  ];

  const statsCards = isProfessor
    ? [
        { title: 'Total Courses', value: courses.length, icon: <ClassIcon color="primary" /> },
        { title: 'Pending Assignments', value: 15, icon: <AssignmentIcon color="primary" /> },
        { title: 'Upcoming Exams', value: 3, icon: <EventIcon color="primary" /> },
        { title: 'Active Students', value: 150, icon: <GradeIcon color="primary" /> },
      ]
    : [
        { title: 'Enrolled Courses', value: courses.length, icon: <ClassIcon color="primary" /> },
        { title: 'Pending Tasks', value: 5, icon: <AssignmentIcon color="primary" /> },
        { title: 'Upcoming Tests', value: 2, icon: <EventIcon color="primary" /> },
        { title: 'Average Grade', value: '85%', icon: <GradeIcon color="primary" /> },
      ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {user?.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.time}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents.map((event) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemIcon>
                      {event.type === 'exam' ? (
                        <GradeIcon color="primary" />
                      ) : (
                        <AssignmentIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={new Date(event.date).toLocaleDateString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notifications
            </Typography>
            <List>
              {notifications.slice(0, 5).map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon color={notification.read ? 'disabled' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={new Date(notification.createdAt).toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
