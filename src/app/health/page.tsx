'use client';

import { useHealth, useReady, useLive } from '@/hooks/useHealth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, AlertCircle, Database, Cpu, HelpCircle } from 'lucide-react';
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
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Diagnostics</h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Real-time latency metrics and connection states. Automatically fetches fresh data every 10 seconds.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 border-slate-200">
          <RefreshCw className="h-4 w-4" /> Refresh Now
        </Button>
      </div>

      {/* Quick probes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Liveness */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Liveness Probe</span>
              <p className="font-bold text-slate-900">Process Status</p>
            </div>
            <Badge
              className={`py-1 px-2.5 ${
                liveStatus === 'LIVENESS_UP'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
              }`}
            >
              {liveStatus || 'DOWN'}
            </Badge>
          </CardContent>
        </Card>

        {/* Readiness */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Readiness Probe</span>
              <p className="font-bold text-slate-900">System Availability</p>
            </div>
            <Badge
              className={`py-1 px-2.5 ${
                readyStatus === 'READY'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
              }`}
            >
              {readyStatus || 'NOT_READY'}
            </Badge>
          </CardContent>
        </Card>

        {/* Global Health */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Service Registry</span>
              <p className="font-bold text-slate-900">Overall Health</p>
            </div>
            <Badge
              className={`py-1 px-2.5 ${
                health?.status === 'UP'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
              }`}
            >
              {health?.status || 'DOWN'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span>Assembling diagnostic metrics...</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h3 className="mt-4 text-lg font-bold text-rose-900">Backend Unreachable</h3>
          <p className="mt-2 text-sm text-rose-600">{(error as Error)?.message || 'Make sure the NestJS server is running on localhost:3000.'}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-6 font-semibold flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      ) : !health ? (
        <div className="text-center py-20 text-slate-500 border border-dashed rounded-xl bg-white">
          No diagnostic report generated by the backend.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Core Services */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" /> Core Dependencies
                </CardTitle>
                <CardDescription>Status and connection latency of critical backend database services.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-slate-100 pt-0">
                {/* Database */}
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">PostgreSQL Database</span>
                    <span className="text-xs text-slate-500">Source of truth for rooms & bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">Latency: {health.services.database.latency || 'N/A'}</span>
                    <Badge
                      className={
                        health.services.database.status === 'UP'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                      }
                    >
                      {health.services.database.status}
                    </Badge>
                  </div>
                </div>

                {/* Redis */}
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">Redis Cache Store</span>
                    <span className="text-xs text-slate-500">Idempotency storage and cache mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">Latency: {health.services.redis.latency || 'N/A'}</span>
                    <Badge
                      className={
                        health.services.redis.status === 'UP'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                      }
                    >
                      {health.services.redis.status}
                    </Badge>
                  </div>
                </div>

                {/* BullMQ Queues */}
                <div className="py-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-sm text-slate-900 block">BullMQ Queue Manager</span>
                      <span className="text-xs text-slate-500">Coordinates async background booking processes</span>
                    </div>
                    <Badge
                      className={
                        health.services.queue.status === 'UP'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                      }
                    >
                      {health.services.queue.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Waiting</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{health.services.queue.waiting}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Active</span>
                      <span className="font-mono text-sm font-bold text-indigo-600">{health.services.queue.active}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Delayed</span>
                      <span className="font-mono text-sm font-bold text-slate-500">{health.services.queue.delayed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                      <span className="font-mono text-sm font-bold text-emerald-600">{health.services.queue.completed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Failed</span>
                      <span className="font-mono text-sm font-bold text-rose-600">{health.services.queue.failed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel: System Telemetry */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-600" /> Host Metrics
                </CardTitle>
                <CardDescription>Server memory allocation and process states.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Uptime:</span>
                  <span className="font-medium text-slate-900">{formatDistanceToNow(new Date(Date.now() - health.uptime * 1000))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Environment:</span>
                  <Badge variant="outline" className="font-mono uppercase text-xs">{health.environment}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">API Version:</span>
                  <span className="font-mono font-semibold">{health.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Node.js Engine:</span>
                  <span className="font-mono text-xs">{health.nodeVersion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">NestJS Framework:</span>
                  <span className="font-mono text-xs">v{health.nestjsVersion}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2">Memory Allocation</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">RSS Size:</span>
                    <span className="font-mono">{health.metrics.memory.rss}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Heap Total:</span>
                    <span className="font-mono">{health.metrics.memory.heapTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Heap Used:</span>
                    <span className="font-mono text-indigo-600 font-semibold">{health.metrics.memory.heapUsed}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2">CPU Utilization</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">User Time:</span>
                    <span className="font-mono">{health.metrics.cpu.user}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">System Time:</span>
                    <span className="font-mono">{health.metrics.cpu.system}</span>
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
