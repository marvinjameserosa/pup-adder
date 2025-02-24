import { Event, EventData, Participant, User } from "@/types/eventTypes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export async function fetchParticipants(eventId: string, eventData: EventData): Promise<Participant[]> {
  const participants: Participant[] = [];

  if (eventData.registeredUsers && eventData.registeredUsers.length > 0) {
    for (const userId of eventData.registeredUsers) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          const isCheckedIn = !!(userData.registeredEvents && 
                               userData.registeredEvents[eventId]);

          participants.push({
            id: userId,
            firstName: userData.firstName || "Unknown",
            lastName: userData.lastName || "",
            email: userData.email || "Not provided",
            userType: userData.userType || "Not specified",
            department: userData.department || "Not specified",
            registrationDate: new Date(
              (eventData.createdAt?.seconds ?? Math.floor(Date.now() / 1000)) * 1000
            ).toLocaleDateString(),
            registeredEvents: userData.registeredEvents,
            checkedIn: isCheckedIn
          });
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      }
    }
  }

  return participants;
}

export function formatEventData(
  eventId: string,
  eventData: EventData,
  participants: Participant[]
): Event {
  const formatTimestampToDate = (timestamp: { seconds: number } | undefined) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') return null;
    const date = new Date(timestamp.seconds * 1000);
    return isNaN(date.getTime()) ? null : date;
  };

  const startDate = formatTimestampToDate(eventData.startDate);
  const endDate = formatTimestampToDate(eventData.endDate);
  
  let formattedDate = "Date not specified";
  if (startDate) {
    formattedDate = startDate.toLocaleDateString();
    if (eventData.startTime) {
      formattedDate += ` at ${eventData.startTime}`;
    }
  } else if (typeof eventData.startDate === 'string') {
    formattedDate = eventData.startDate;
    if (eventData.startTime) {
      formattedDate += ` at ${eventData.startTime}`;
    }
  }

  return {
    id: eventId,
    name: eventData.eventName || "Untitled Event",
    startDate: startDate ? startDate.toLocaleDateString() : "No start date specified",
    endDate: endDate ? endDate.toLocaleDateString() : "No end date specified",
    startTime: eventData.startTime || "No start time specified",
    endTime: eventData.endTime || "No end time specified",
    location: eventData.location || "No location specified",
    description: eventData.description || "No description available",
    participants,
    date: formattedDate
  };
}

export function categorizeEvents(events: Event[]) {
  const now = new Date();
  const current: Event[] = [];
  const upcoming: Event[] = [];

  events.forEach((event) => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    try {
      if (event.startDate && event.startDate !== "No start date specified") {
        const parts = event.startDate.split('/');
        if (parts.length === 3) {
          startDate = new Date(
            parseInt(parts[2]), 
            parseInt(parts[0]) - 1, 
            parseInt(parts[1])
          );
          if (isNaN(startDate.getTime())) {
            startDate = null;
          }
        }
      }
      
      if (event.endDate && event.endDate !== "No end date specified") {
        const parts = event.endDate.split('/');
        if (parts.length === 3) {
          endDate = new Date(
            parseInt(parts[2]), 
            parseInt(parts[0]) - 1, 
            parseInt(parts[1])
          );
          if (isNaN(endDate.getTime())) {
            endDate = null;
          }
        }
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
    
    if (startDate && endDate) {
      if (startDate <= now && endDate >= now) {
        current.push(event);
      } else if (startDate > now) {
        upcoming.push(event);
      }
    } else if (startDate) {
      if (startDate > now) {
        upcoming.push(event);
      } else {
        current.push(event);
      }
    } else if (endDate) {
      if (endDate >= now) {
        current.push(event);
      }
    } else {
      upcoming.push(event);
    }
  });

  return { current, upcoming };
}