import { makeAutoObservable } from 'mobx';
import dashboardData from '../data/dashboard.json';

export interface DashboardWidget {
  id: string;
  type: 'upcoming_assignments' | 'recent_notifications' | 'unread_messages' | 'course_summary' | 'performance_overview';
  data: any;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  type: string;
}

interface Activity {
  id: string;
  title: string;
  timestamp: Date;
}

// Type guard to check if the widget type is valid
function isValidWidgetType(type: string): type is DashboardWidget['type'] {
  return ['upcoming_assignments', 'recent_notifications', 'unread_messages',
    'course_summary', 'performance_overview'].includes(type);
}

// Interface for raw widget data from JSON
interface RawWidget {
  id: string;
  type: string;
  data: any;
}

export class DashboardStore {
  widgets: DashboardWidget[] = [];
  upcomingEvents: Event[] = [];
  recentActivities: Activity[] = [];
  loading: boolean = false;
  error: string | null = null;
  pendingAssignmentsCount: number = 0;
  upcomingExamsCount: number = 0;
  activeStudentsCount: number = 0;
  pendingTasksCount: number = 0;
  upcomingTestsCount: number = 0;
  averageGrade: string = '0.0';

  constructor() {
    makeAutoObservable(this);
    this.initializeDashboard();
  }

  private initializeDashboard() {
    try {
      // Safely type and convert widgets
      this.widgets = (dashboardData.widgets as RawWidget[]).map(widget => {
        if (!isValidWidgetType(widget.type)) {
          throw new Error(`Invalid widget type: ${widget.type}`);
        }
        return {
          id: widget.id,
          type: widget.type,
          data: widget.data
        };
      });

      // Convert dates in upcoming events
      this.upcomingEvents = (dashboardData.upcomingEvents || []).map(event => ({
        ...event,
        date: new Date(event.date)
      }));

      // Convert dates in recent activities
      this.recentActivities = (dashboardData.recentActivities || []).map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));

      // Extract performance overview data if available
      const performanceWidget = this.widgets.find(w => w.type === 'performance_overview')?.data;
      if (performanceWidget) {
        this.pendingAssignmentsCount = performanceWidget.totalAssignments || 0;
        this.upcomingExamsCount = performanceWidget.upcomingExams || 0;
        this.activeStudentsCount = performanceWidget.activeStudents || 0;
        this.pendingTasksCount = performanceWidget.pendingTasks || 0;
        this.upcomingTestsCount = performanceWidget.upcomingTests || 0;
        this.averageGrade = String(performanceWidget.averageScore || '0.0');
      }

      this.error = null;
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      this.error = 'Failed to initialize dashboard';
      this.resetToDefaults();
    }
  }

  private resetToDefaults() {
    this.widgets = [];
    this.upcomingEvents = [];
    this.recentActivities = [];
    this.pendingAssignmentsCount = 0;
    this.upcomingExamsCount = 0;
    this.activeStudentsCount = 0;
    this.pendingTasksCount = 0;
    this.upcomingTestsCount = 0;
    this.averageGrade = '0.0';
  }

  getWidgetById(id: string) {
    return this.widgets.find(widget => widget.id === id);
  }

  refreshDashboard() {
    this.initializeDashboard();
  }

  fetchDashboardData() {
    this.loading = false;
  }
}

export const dashboardStore = new DashboardStore();
export default dashboardStore;