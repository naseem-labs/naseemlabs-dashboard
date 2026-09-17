import { useEffect, useRef } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

export interface RealtimeTable {
  table: string;
  filter?: string;
}

export function useSupabaseRealtime(
  channelName: string | null,
  tables: RealtimeTable[],
  onChange: () => void,
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

    const schedule = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        onChangeRef.current();
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
      window.clearTimeout(timeoutId);
      void supabase.removeChannel(channel);
    };
  }, [channelName, enabled, tablesKey]);
}
