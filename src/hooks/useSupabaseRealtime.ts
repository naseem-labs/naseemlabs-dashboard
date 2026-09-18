import { useEffect, useRef } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

export interface RealtimeTable {
  table: string;
  filter?: string;
}

export function useSupabaseRealtime(
  channelName: string | null,
  tables: RealtimeTable[],
  onChange: () => void | Promise<void>,
  enabled = true,
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const tablesRef = useRef(tables);
  tablesRef.current = tables;
  const tablesKey = tables
    .map((item) => `${item.table}:${item.filter ?? ''}`)
    .join('|');

  useEffect(() => {
    const currentTables = tablesRef.current;
    if (!enabled || !channelName || !isSupabaseConfigured() || currentTables.length === 0) {
      return;
    }

    const supabase = getSupabaseClient();
    let timeoutId: number | undefined;
    let refreshInFlight = false;
    let refreshPending = false;
    let isActive = true;

    const runRefresh = () => {
      if (refreshInFlight) {
        refreshPending = true;
        return;
      }

      refreshInFlight = true;

      Promise.resolve()
        .then(() => onChangeRef.current())
        .catch(() => undefined)
        .finally(() => {
          refreshInFlight = false;

          if (isActive && refreshPending) {
            refreshPending = false;
            runRefresh();
          }
        });
    };

    const schedule = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined;
        runRefresh();
      }, 350);
    };

    let channel = supabase.channel(channelName);

    for (const item of currentTables) {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: item.table,
          ...(item.filter ? { filter: item.filter } : {}),
        },
        schedule,
      );
    }

    channel.subscribe();

    return () => {
      isActive = false;
      refreshPending = false;
      window.clearTimeout(timeoutId);
      void supabase.removeChannel(channel);
    };
  }, [channelName, enabled, tablesKey]);
}
