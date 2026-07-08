// ── API Envelopes ────────────────────────────────────────────────────────────

export interface StandardApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
  requestId: string;
}

// ── Enums ────────────────────────────────────────────────────────────────────

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';
export type BookingType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

// ── Rooms ────────────────────────────────────────────────────────────────────

export interface RoomDto {
  id: string;
  name: string;
  description: string | null;
}

// ── Availability ─────────────────────────────────────────────────────────────

export interface BookedRangeDto {
  bookingReference: string;
  startDate: string; // ISO date-time string
  endDate: string; // ISO date-time string
  status: BookingStatus;
}

export interface RoomAvailabilityDto {
  roomId: string;
  roomName: string;
  bookedRanges: BookedRangeDto[];
}

export interface RoomAvailabilityCheckDto {
  roomId: string;
  roomName: string;
  requestedStartDate: string; // ISO date string (YYYY-MM-DD)
  requestedEndDate: string; // ISO date string (YYYY-MM-DD)
  available: boolean;
  nextAvailableDate?: string; // ISO date-time string (only when available=false)
  message: string;
  conflictingBookings: BookedRangeDto[];
}

// ── Legacy Events ────────────────────────────────────────────────────────────

export interface EventResponseDto {
  id: string;
  name: string;
  description: string | null;
  eventDate: string; // ISO date-time string
  totalSeats: number;
  remainingSeats: number;
  price: number;
}

// ── Bookings ─────────────────────────────────────────────────────────────────

export interface CreateBookingDto {
  requestId?: string; // UUID v4
  roomId: string; // UUID v4
  customerName: string;
  customerEmail: string;
  bookingType: BookingType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface BookingResponseDto {
  bookingReference: string;
  status: BookingStatus;
  message?: string; // Present for duplicate request
}

export interface BookingQueryDto {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  roomId?: string;
  customerEmail?: string;
  bookingReference?: string;
  sortBy?: 'createdAt' | 'startDate' | 'customerName' | 'status';
  order?: 'ASC' | 'DESC';
}

export interface BookingRoomDto {
  id: string;
  name: string;
}

export interface BookingItemDto {
  bookingReference: string;
  room: BookingRoomDto;
  customerName: string;
  customerEmail: string;
  bookingType: BookingType;
  startDate: string; // ISO date-time string
  endDate: string; // ISO date-time string
  status: BookingStatus;
  createdAt: string; // ISO date-time string
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedBookingsDto {
  data: BookingItemDto[];
  meta: PaginationMetaDto;
}

// ── Admin Bookings ───────────────────────────────────────────────────────────

export interface AdminBookingListItemDto {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  room: BookingRoomDto;
  startDate: string; // ISO date-time string
  endDate: string; // ISO date-time string
  bookingType: BookingType;
  status: BookingStatus;
  createdAt: string; // ISO date-time string
}

export interface PaginatedAdminBookingsDto {
  data: AdminBookingListItemDto[];
  meta: PaginationMetaDto;
}

export interface AdminBookingDetailDto {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  room: BookingRoomDto;
  startDate: string; // ISO date-time string
  endDate: string; // ISO date-time string
  bookingType: BookingType;
  status: BookingStatus;
  failureReason: string | null;
  createdAt: string; // ISO date-time string
  updatedAt: string; // ISO date-time string
}

export interface BookingApprovalDto {
  reason?: string;
  notes?: string;
}

export interface AdminActionResultDto {
  bookingReference: string;
  status: BookingStatus;
  failureReason: string | null;
  updatedAt: string; // ISO date-time string
}

// ── Health ───────────────────────────────────────────────────────────────────

export interface ServiceStatusDto {
  status: 'UP' | 'DOWN';
  latency?: string;
}

export interface QueueStatusDto {
  status: 'UP' | 'DOWN';
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export interface MemoryMetricsDto {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
}

export interface CpuMetricsDto {
  user: string;
  system: string;
}

export interface SystemMetricsDto {
  memory: MemoryMetricsDto;
  cpu: CpuMetricsDto;
}

export interface ServiceRegistryDto {
  database: ServiceStatusDto;
  redis: ServiceStatusDto;
  queue: QueueStatusDto;
}

export interface HealthResponseDto {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  nodeVersion: string;
  nestjsVersion: string;
  timezone: string;
  metrics: SystemMetricsDto;
  services: ServiceRegistryDto;
}
