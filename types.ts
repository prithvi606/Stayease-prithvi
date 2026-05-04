export type UserRole = 'admin' | 'resident';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  roomId?: string;
  avatar?: string;
}

export type RoomStatus = 'Available' | 'Full' | 'Maintenance';

export interface Room {
  id: string;
  number: string;
  type: 'Single' | 'Double' | 'Triple';
  rent: number;
  capacity: number;
  occupancy: number;
  status: RoomStatus;
  floor: number;
  amenities: string[];
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  month: string;
  year: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  method?: string;
  date: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  status: 'Pending' | 'In-Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'Low' | 'Normal' | 'High';
  date: string;
}

export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
