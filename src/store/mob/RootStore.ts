import { createContext } from 'react';
import authStore from './AuthStore';
import coursesStore from './CoursesStore';
import notificationsStore from './NotificationsStore';
import chatStore from './ChatStore';
import assignmentStore from './AssignmentStore';
import gradesStore from './GradesStore';
import dashboardStore from './DashboardStore';

export const rootStore = {
  authStore,
  coursesStore,
  notificationsStore,
  chatStore,
  assignmentStore,
  gradesStore,
  dashboardStore
};

export const StoreContext = createContext(rootStore);

export const useAuthStore = () => rootStore.authStore;
export const useCoursesStore = () => rootStore.coursesStore;
export const useNotificationsStore = () => rootStore.notificationsStore;
export const useChatStore = () => rootStore.chatStore;
export const useAssignmentStore = () => rootStore.assignmentStore;
export const useGradesStore = () => rootStore.gradesStore;
export const useDashboardStore = () => rootStore.dashboardStore;

export default rootStore;
