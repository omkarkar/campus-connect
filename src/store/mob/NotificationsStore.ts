import { makeAutoObservable } from 'mobx';
import notificationsData from '../data/notifications.json';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

export class NotificationsStore {
  notifications: Notification[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadNotifications();
  }

  private loadNotifications() {
    // Explicitly type and convert notifications
    this.notifications = notificationsData.notifications.map(notification => {
      const convertedNotification: Notification = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'],
        timestamp: new Date(notification.timestamp),
        read: notification.read
      };
      return convertedNotification;
    });
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif${this.notifications.length + 1}`,
      timestamp: new Date()
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  clearAllNotifications() {
    this.notifications = [];
  }
}

export const notificationsStore = new NotificationsStore();
export default notificationsStore;
