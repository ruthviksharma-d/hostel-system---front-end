import type { RequestCategory, RequestResponse, RequestStatus } from '../services/requestService';

export function formatStatus(status: RequestStatus | string): string {
  return String(status)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatCategory(category: RequestCategory | string): string {
  switch (category) {
    case 'ELECTRICAL':
      return 'Electrical Issue';
    case 'PLUMBING':
      return 'Plumbing Issue';
    case 'INTERNET':
      return 'Internet / Wi-Fi Issue';
    case 'FURNITURE':
      return 'Furniture Repair';
    case 'OTHER':
      return 'Other';
    default:
      return String(category);
  }
}

export function formatDate(value?: string | null): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function requestCode(id: number | string): string {
  return `REQ-${String(id).padStart(3, '0')}`;
}

export function countByStatus(requests: RequestResponse[]) {
  return requests.reduce(
    (counts, request) => {
      counts.total += 1;
      counts[request.status] += 1;
      return counts;
    },
    { total: 0, OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 } as Record<RequestStatus | 'total', number>
  );
}
