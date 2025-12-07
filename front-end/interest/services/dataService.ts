import { Event, UserProfile, Notification } from '../types';

/**
 * Fetches the list of events from the public JSON file.
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('/data/events.json');
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

/**
 * Fetches the user profile from the public JSON file.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await fetch('/data/user.json');
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading user profile:', error);
    // Return a fallback user to prevent app crash
    return {
      name: 'Guest',
      username: '@guest',
      email: '',
      avatarUrl: 'GU',
      bio: ''
    };
  }
};

/**
 * Fetches notifications from the public JSON file.
 */
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch('/data/notifications.json');
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};
