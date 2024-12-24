import React, { useEffect } from 'react';
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
  LinearProgress,
} from '@mui/material';
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Class as ClassIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  useAuthStore,
  useCoursesStore,
  useNotificationsStore,
  useDashboardStore
} from '../store/mob/RootStore';

const Dashboard = observer(() => {
  const authStore = useAuthStore();
  const coursesStore = useCoursesStore();
  const notificationsStore = useNotificationsStore();
  const dashboardStore = useDashboardStore();

  const { user } = authStore;
  const { courses } = coursesStore;
  const { notifications } = notificationsStore;
  const {
    upcomingEvents,
    recentActivities,
    loading,
    error
  } = dashboardStore;

  const isProfessor = user?.role === 'professor';

  useEffect(() => {
    dashboardStore.fetchDashboardData();
  }, [dashboardStore]);

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

  const statsCards = isProfessor
      ? [
        { title: 'Total Courses', value: courses.length, icon: <ClassIcon color="primary" /> },
        { title: 'Pending Assignments', value: dashboardStore.pendingAssignmentsCount, icon: <AssignmentIcon color="primary" /> },
        { title: 'Upcoming Exams', value: dashboardStore.upcomingExamsCount, icon: <EventIcon color="primary" /> },
        { title: 'Active Students', value: dashboardStore.activeStudentsCount, icon: <GradeIcon color="primary" /> },
      ]
      : [
        { title: 'Enrolled Courses', value: courses.length, icon: <ClassIcon color="primary" /> },
        { title: 'Pending Tasks', value: dashboardStore.pendingTasksCount, icon: <AssignmentIcon color="primary" /> },
        { title: 'Upcoming Tests', value: dashboardStore.upcomingTestsCount, icon: <EventIcon color="primary" /> },
        { title: 'Average Grade', value: dashboardStore.averageGrade, icon: <GradeIcon color="primary" /> },
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
                            // secondary={activity.timestamp}
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
                            secondary={new Date(notification.timestamp).toLocaleString()}
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
});

export default Dashboard;