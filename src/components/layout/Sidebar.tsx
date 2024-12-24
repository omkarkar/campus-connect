import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Grade as GradeIcon,
  Note as NoteIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useAuthStore,
  useCoursesStore
} from '../../store/mob/RootStore';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarComponent ({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const coursesStore = useCoursesStore();

  const user = authStore.user;
  // const isProfessor = user?.role == 'professor';
  const isProfessor = false;

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Courses', icon: <ClassIcon />, path: '/courses' },
    { text: 'Calendar', icon: <EventIcon />, path: '/calendar' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
  ];

  const professorMenuItems = [
    { text: 'Notes', icon: <NoteIcon />, path: '/notes' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
    { text: 'Grades', icon: <GradeIcon />, path: '/grades' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics' },
  ];

  const studentMenuItems = [
    { text: 'My Grades', icon: <GradeIcon />, path: '/grades' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    // If mobile, close the drawer after navigation
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  console.log("is user  " +user)

  const renderDrawerContent = () => (
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {mainMenuItems.map((item) => (
              <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                    },
                  }}
              >
                <ListItemIcon sx={{ color: 'common.white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        <List>
          {(isProfessor ? professorMenuItems : studentMenuItems).map((item) => (
              <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                    },
                  }}
              >
                <ListItemIcon sx={{ color: 'common.white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="common.white" sx={{ opacity: 0.7 }}>
            My Courses
          </Typography>
        </Box>

        <List>
          {coursesStore.courses.map((course) => (
              <ListItem
                  button
                  key={course.id}
                  onClick={() => handleNavigate(`/courses/${course.id}`)}
                  selected={location.pathname === `/courses/${course.id}`}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                    },
                  }}
              >
                <ListItemIcon sx={{ color: 'common.white' }}>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText primary={course.title} />
              </ListItem>
          ))}
        </List>
      </Box>
  );

  // Support for both permanent and temporary drawers
  return mobileOpen !== undefined ? (
      <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'teams.sidebar',
              color: 'common.white',
            },
          }}
      >
        {renderDrawerContent()}
      </Drawer>
  ) : (
      <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'teams.sidebar',
              color: 'common.white',
            },
          }}
      >
        {renderDrawerContent()}
      </Drawer>
  );
};

const Sidebar = observer(SidebarComponent) as React.FC<SidebarProps>;

export default Sidebar;