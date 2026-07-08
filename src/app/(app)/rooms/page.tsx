'use client';

import { useRooms, useLegacyEvents } from '@/hooks/useRooms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, RefreshCw, AlertCircle, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';

export default function RoomsPage() {
  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
    error: errorRooms,
    refetch: refetchRooms,
  } = useRooms();

  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: errorEvents,
    refetch: refetchEvents,
  } = useLegacyEvents();

  const handleRetry = () => {
    refetchRooms();
    refetchEvents();
  };

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Conference Rooms & Legacy Events</h1>
          <p className="mt-2 text-sm text-slate-500">
            Select a room to check availability, schedule meetings, or view legacy scheduled events.
          </p>
        </div>
        {(isErrorRooms || isErrorEvents) && (
          <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </Button>
        )}
      </div>

      {/* Grid Layout for Rooms and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rooms Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <LayoutGrid className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Available Conference Rooms</h2>
          </div>

          {isLoadingRooms ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : isErrorRooms ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
              <h3 className="mt-2 text-md font-semibold text-rose-900">Failed to load rooms</h3>
              <p className="mt-1 text-sm text-rose-500">{(errorRooms as Error)?.message || 'Unexpected server error'}</p>
              <Button onClick={() => refetchRooms()} variant="outline" size="sm" className="mt-4">
                Retry Rooms
              </Button>
            </div>
          ) : !rooms || rooms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed rounded-xl">
              No rooms registered in the backend database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-indigo-600">{room.name}</CardTitle>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">ID: {room.name}</Badge>
                    </div>
                    <CardDescription className="mt-2 text-sm text-slate-600 line-clamp-2">
                      {room.description || 'No description provided for this room.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6 px-6">
                    <Link href={`/rooms/${room.id}`} className="w-full">
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2">
                        View Availability & Book <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Legacy Events Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <List className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Legacy Event List</h2>
          </div>

          {isLoadingEvents ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : isErrorEvents ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
              <h3 className="mt-2 text-sm font-semibold text-rose-900">Failed to load events</h3>
              <p className="mt-1 text-xs text-rose-500">{(errorEvents as Error)?.message || 'Unexpected server error'}</p>
              <Button onClick={() => refetchEvents()} variant="outline" size="sm" className="mt-3">
                Retry Events
              </Button>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border border-dashed rounded-xl text-sm">
              No legacy events scheduled.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="border-slate-200">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-slate-950 text-sm line-clamp-1">{event.name}</h3>
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 text-[10px] shrink-0">
                        ${event.price.toLocaleString()}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-slate-500 space-y-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{format(new Date(event.eventDate), 'PPP p')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span>Seats available:</span>
                      <span className="font-semibold text-slate-950">
                        {event.remainingSeats} / {event.totalSeats}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
