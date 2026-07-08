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
    <div className="space-y-10 py-6 text-[#FAFAFA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#FAFAFA]">Conference Rooms</h1>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Select a room to check availability, schedule meetings, or view legacy scheduled events.
          </p>
        </div>
        {(isErrorRooms || isErrorEvents) && (
          <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2 border-white/[0.08] bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA]">
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </Button>
        )}
      </div>

      {/* Grid Layout for Rooms and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rooms Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <LayoutGrid className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-xl font-bold text-[#FAFAFA]">Available Conference Rooms</h2>
          </div>

          {isLoadingRooms ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : isErrorRooms ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-rose-400" />
              <h3 className="mt-2 text-md font-semibold text-[#FAFAFA]">Failed to load rooms</h3>
              <p className="mt-1 text-sm text-[#A1A1AA]">{(errorRooms as Error)?.message || 'Unexpected server error'}</p>
              <Button onClick={() => refetchRooms()} variant="outline" size="sm" className="mt-4 border-white/[0.08] text-[#FAFAFA]">
                Retry Rooms
              </Button>
            </div>
          ) : !rooms || rooms.length === 0 ? (
            <div className="text-center py-12 text-[#A1A1AA] border border-dashed border-white/[0.08] rounded-xl">
              No rooms registered in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-white/[0.08] bg-[#111113] text-[#FAFAFA]">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-[#FAFAFA]">{room.name}</CardTitle>
                      <Badge variant="secondary" className="bg-[#18181B] text-[#A1A1AA] border border-white/[0.04]">ID: {room.name}</Badge>
                    </div>
                    <CardDescription className="mt-2 text-sm text-[#A1A1AA] line-clamp-2">
                      {room.description || 'No description provided for this room.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6 px-6">
                    <Link href={`/rooms/${room.id}`} className="w-full">
                      <Button className="w-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white flex items-center justify-center gap-2 font-medium">
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
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <List className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-xl font-bold text-[#FAFAFA]">Legacy Event List</h2>
          </div>

          {isLoadingEvents ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : isErrorEvents ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
              <h3 className="mt-2 text-sm font-semibold text-[#FAFAFA]">Failed to load events</h3>
              <p className="mt-1 text-xs text-[#A1A1AA]">{(errorEvents as Error)?.message || 'Unexpected server error'}</p>
              <Button onClick={() => refetchEvents()} variant="outline" size="sm" className="mt-3 border-white/[0.08] text-[#FAFAFA]">
                Retry Events
              </Button>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-8 text-[#A1A1AA] border border-dashed border-white/[0.08] rounded-xl text-sm">
              No legacy events scheduled.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="border-white/[0.08] bg-[#111113] text-[#FAFAFA]">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-[#FAFAFA] text-sm line-clamp-1">{event.name}</h3>
                      <Badge className="bg-[#7C3AED]/10 text-[#8B5CF6] hover:bg-[#7C3AED]/20 border border-[#7C3AED]/20 text-[10px] shrink-0">
                        ${event.price.toLocaleString()}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-[#A1A1AA] space-y-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-white/[0.3]" />
                      <span>{format(new Date(event.eventDate), 'PPP p')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/[0.08]">
                      <span>Seats available:</span>
                      <span className="font-semibold text-[#FAFAFA]">
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
