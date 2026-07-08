'use client';

import { useHealth, useReady, useLive } from '@/hooks/useHealth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, AlertCircle, Database, Cpu } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HealthPage() {
  // Queries
  const { data: health, isLoading, isError, error, refetch } = useHealth();
  const { data: readyStatus } = useReady();
  const { data: liveStatus } = useLive();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-8 py-6 text-[#FAFAFA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#7C3AED]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-[#FAFAFA]">System Diagnostics</h1>
          </div>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Real-time latency metrics and connection states. Automatically fetches fresh data every 10 seconds.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 border-white/[0.08] bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA]">
          <RefreshCw className="h-4 w-4" /> Refresh Now
        </Button>
      </div>

      {/* Quick probes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Liveness */}
        <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA] shadow-md">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-[#A1A1AA] font-semibold uppercase tracking-wider">Liveness Probe</span>
              <p className="font-bold text-[#FAFAFA]">Process Status</p>
            </div>
            <Badge
              className={`py-1 px-2.5 border ${
                liveStatus === 'LIVENESS_UP'
                  ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
              }`}
            >
              {liveStatus || 'DOWN'}
            </Badge>
          </CardContent>
        </Card>

        {/* Readiness */}
        <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA] shadow-md">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-[#A1A1AA] font-semibold uppercase tracking-wider">Readiness Probe</span>
              <p className="font-bold text-[#FAFAFA]">System Availability</p>
            </div>
            <Badge
              className={`py-1 px-2.5 border ${
                readyStatus === 'READY'
                  ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
              }`}
            >
              {readyStatus || 'NOT_READY'}
            </Badge>
          </CardContent>
        </Card>

        {/* Global Health */}
        <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA] shadow-md">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-[#A1A1AA] font-semibold uppercase tracking-wider">Service Registry</span>
              <p className="font-bold text-[#FAFAFA]">Overall Health</p>
            </div>
            <Badge
              className={`py-1 px-2.5 border ${
                health?.status === 'UP'
                  ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
              }`}
            >
              {health?.status || 'DOWN'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[#A1A1AA] flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-[#7C3AED]" />
          <span>Assembling diagnostic metrics...</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
          <h3 className="mt-4 text-lg font-bold text-[#FAFAFA]">Backend Unreachable</h3>
          <p className="mt-2 text-sm text-[#A1A1AA]">{(error as Error)?.message || 'Make sure the backend NestJS service is currently active.'}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-6 font-semibold flex items-center gap-2 mx-auto border-white/[0.08] text-[#FAFAFA]">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      ) : !health ? (
        <div className="text-center py-20 text-[#A1A1AA] border border-dashed border-white/[0.08] rounded-xl bg-[#111113]">
          No diagnostic report generated by the backend.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Core Services */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA]">
              <CardHeader className="border-b border-white/[0.08] bg-[#18181B]/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#FAFAFA]">
                  <Database className="h-5 w-5 text-[#7C3AED]" /> Core Dependencies
                </CardTitle>
                <CardDescription className="text-[#A1A1AA]">Status and connection latency of critical backend database services.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-white/[0.08] pt-0">
                {/* Database */}
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-sm text-[#FAFAFA] block">PostgreSQL Database</span>
                    <span className="text-xs text-[#A1A1AA]">Source of truth for rooms & bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#A1A1AA]">Latency: {health.services.database.latency || 'N/A'}</span>
                    <Badge
                      className={`border ${
                        health.services.database.status === 'UP'
                          ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                      }`}
                    >
                      {health.services.database.status}
                    </Badge>
                  </div>
                </div>

                {/* Redis */}
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-sm text-[#FAFAFA] block">Redis Cache Store</span>
                    <span className="text-xs text-[#A1A1AA]">Idempotency storage and cache mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#A1A1AA]">Latency: {health.services.redis.latency || 'N/A'}</span>
                    <Badge
                      className={`border ${
                        health.services.redis.status === 'UP'
                          ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                      }`}
                    >
                      {health.services.redis.status}
                    </Badge>
                  </div>
                </div>

                {/* BullMQ Queues */}
                <div className="py-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-sm text-[#FAFAFA] block">BullMQ Queue Manager</span>
                      <span className="text-xs text-[#A1A1AA]">Coordinates async background booking processes</span>
                    </div>
                    <Badge
                      className={`border ${
                        health.services.queue.status === 'UP'
                          ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                      }`}
                    >
                      {health.services.queue.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 bg-[#18181B] p-3 rounded-lg border border-white/[0.08] text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">Waiting</span>
                      <span className="font-mono text-sm font-bold text-[#FAFAFA]">{health.services.queue.waiting}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">Active</span>
                      <span className="font-mono text-sm font-bold text-[#8B5CF6]">{health.services.queue.active}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">Delayed</span>
                      <span className="font-mono text-sm font-bold text-[#A1A1AA]">{health.services.queue.delayed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">Completed</span>
                      <span className="font-mono text-sm font-bold text-[#22C55E]">{health.services.queue.completed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">Failed</span>
                      <span className="font-mono text-sm font-bold text-rose-400">{health.services.queue.failed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel: System Telemetry */}
          <div className="space-y-6">
            <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA]">
              <CardHeader className="border-b border-white/[0.08] bg-[#18181B]/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#FAFAFA]">
                  <Cpu className="h-5 w-5 text-[#7C3AED]" /> Host Metrics
                </CardTitle>
                <CardDescription className="text-[#A1A1AA]">Server memory allocation and process states.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Uptime:</span>
                  <span className="font-medium text-[#FAFAFA]">{formatDistanceToNow(new Date(Date.now() - health.uptime * 1000))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Environment:</span>
                  <Badge variant="outline" className="font-mono uppercase text-xs border-white/[0.08] text-[#FAFAFA]">{health.environment}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">API Version:</span>
                  <span className="font-mono font-semibold text-[#FAFAFA]">{health.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Node.js Engine:</span>
                  <span className="font-mono text-xs text-[#FAFAFA]">{health.nodeVersion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">NestJS Framework:</span>
                  <span className="font-mono text-xs text-[#FAFAFA]">v{health.nestjsVersion}</span>
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-2">
                  <span className="text-xs font-bold text-[#A1A1AA] block uppercase tracking-wider mb-2">Memory Allocation</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">RSS Size:</span>
                    <span className="font-mono text-[#FAFAFA]">{health.metrics.memory.rss}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">Heap Total:</span>
                    <span className="font-mono text-[#FAFAFA]">{health.metrics.memory.heapTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">Heap Used:</span>
                    <span className="font-mono text-[#8B5CF6] font-semibold">{health.metrics.memory.heapUsed}</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-2">
                  <span className="text-xs font-bold text-[#A1A1AA] block uppercase tracking-wider mb-2">CPU Utilization</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">User Time:</span>
                    <span className="font-mono text-[#FAFAFA]">{health.metrics.cpu.user}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">System Time:</span>
                    <span className="font-mono text-[#FAFAFA]">{health.metrics.cpu.system}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
