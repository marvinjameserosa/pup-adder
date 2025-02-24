import { Event } from "@/types/eventTypes";

export function downloadParticipantsCSV(event: Event) {
  if (!event.participants || event.participants.length === 0) {
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Type",
    "Department/College",
    "Registration Date",
    "Check-in Status"
  ];

  const escapeCsvField = (field: string) => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const csvRows = [
    headers.join(','),
    ...event.participants.map(p => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
      const email = p.email || '';
      const type = p.userType || 'Not specified';
      const department = p.department || 'Not specified';
      const regDate = p.registrationDate;
      const status = p.checkedIn ? 'Checked In' : 'Not Checked In';

      return [
        escapeCsvField(name),
        escapeCsvField(email),
        escapeCsvField(type),
        escapeCsvField(department),
        escapeCsvField(regDate),
        escapeCsvField(status)
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_participants.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}