export interface EventData {
    eventName?: string;
    startDate?: { seconds: number };
    endDate?: { seconds: number };
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string;
    registeredUsers?: string[];
    createdAt?: { seconds: number };
  }
  
  export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
    email?: string;
    phoneNumber?: string;
    age?: string;
    sex?: string;
    department?: string;
    registeredEvents?: {
      [eventId: string]: boolean;
    };
  }

  export interface CancelStatus {
    loading: boolean;
    error: string | null;
  }
  
  export interface Participant extends User {
    registrationDate: string;
    checkedIn: boolean;
  }
  
  export interface Event {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    participants: Participant[];
    date: string;
  }