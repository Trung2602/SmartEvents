import { Event, Notification, UserProfile, ManagedPage } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'u1',
  name: 'John Doe',
  username: '@johndoe',
  email: 'john.doe@example.com',
  avatarUrl: 'JD', // Using initials for the mock avatar
  bio: 'Event enthusiast and tech lover.'
};

export const MOCK_PAGES: ManagedPage[] = [
  { id: 'p1', name: 'TechDaily Community', avatarUrl: 'https://i.pravatar.cc/100?img=10' },
  { id: 'p2', name: 'NYC Nightlife', avatarUrl: 'https://i.pravatar.cc/100?img=12' }
];

export const MOCK_USERS: UserProfile[] = [
  { id: 'u2', name: 'Jane Smith', username: '@janesmith', email: 'jane@test.com', avatarUrl: 'https://i.pravatar.cc/100?img=5' },
  { id: 'u3', name: 'Alex Rivera', username: '@arivera', email: 'alex@test.com', avatarUrl: 'https://i.pravatar.cc/100?img=3' },
  { id: 'u4', name: 'Sarah Connor', username: '@sarahc', email: 'sarah@test.com', avatarUrl: 'https://i.pravatar.cc/100?img=9' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ticket Confirmed',
    message: 'You have successfully booked tickets for Tech Conference 2024.',
    time: '2 mins ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: 'Summer Music Festival starts tomorrow at 18:00.',
    time: '1 hour ago',
    isRead: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'New Event Nearby',
    message: 'A new Art Exhibition has been scheduled near your location.',
    time: '5 hours ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '4',
    title: 'Payment Update',
    message: 'Your payment method is about to expire.',
    time: '1 day ago',
    isRead: true,
    type: 'warning'
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    dateStr: 'July 23',
    startTime: '18:00',
    endTime: '22:00',
    location: 'Central Park, New York',
    country: 'USA',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'Vibe Nation',
    organizerAvatar: 'https://i.pravatar.cc/100?img=1',
    price: '$45',
    description: 'Experience the ultimate summer vibes with top artists from around the globe. Food trucks, art installations, and non-stop music.',
    attendeesCount: 342,
    isLiked: false
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    dateStr: 'August 5',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Convention Center, SF',
    country: 'USA',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'TechCrunch',
    organizerAvatar: 'https://i.pravatar.cc/100?img=2',
    price: '$299',
    description: 'The biggest tech event of the year. Keynotes from industry leaders, networking opportunities, and workshops.',
    attendeesCount: 1250,
    isSoldOut: true,
    isLiked: false
  },
  {
    id: '3',
    title: 'Art Exhibition Opening',
    dateStr: 'August 12',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Modern Art Museum, LA',
    country: 'USA',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'MOMA',
    organizerAvatar: 'https://i.pravatar.cc/100?img=3',
    price: 'Free',
    description: 'A showcase of contemporary art from emerging local artists. Complimentary wine and cheese.',
    attendeesCount: 218,
    isLiked: true
  },
  {
    id: '4',
    title: 'Gaming Tournament Finals',
    dateStr: 'August 12',
    startTime: '14:00',
    endTime: '20:00',
    location: 'Esports Arena, Las Vegas',
    country: 'USA',
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'ESL',
    organizerAvatar: 'https://i.pravatar.cc/100?img=4',
    price: '$50',
    description: 'Watch the top teams battle it out for the championship trophy.',
    attendeesCount: 5000,
    isLiked: false
  },
  {
    id: '5',
    title: 'Past Coding Bootcamp',
    dateStr: 'June 10',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Online',
    country: 'Global',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'CodeAcademy',
    organizerAvatar: 'https://i.pravatar.cc/100?img=5',
    price: 'Free',
    isEnded: true,
    attendeesCount: 120,
    isLiked: false
  }
];