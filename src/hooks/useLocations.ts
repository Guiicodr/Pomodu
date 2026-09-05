/**
 * useLocations.ts — Hook para gerenciar locais de trabalho
 */

import { useState, useEffect, useCallback } from 'react';
import { WorkLocation } from '@/types';
import * as locationService from '@/services/locationService';

export function useLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await locationService.getAll();
      setLocations(all);
    } catch (err) {
      console.error('[useLocations] refresh', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const granted = await locationService.requestPermission();
      setPermissionGranted(granted);
      await refresh();
    })();
  }, [refresh]);

  const capturePosition = useCallback(async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    try {
      return await locationService.getCurrentPosition();
    } catch {
      return null;
    }
  }, []);

  const createLocation = useCallback(
    async (name: string, latitude: number, longitude: number) => {
      const existing = await locationService.findByCoords(latitude, longitude);
      if (existing) return existing;
      const loc = await locationService.create(name, latitude, longitude);
      setLocations((prev) => [loc, ...prev]);
      return loc;
    },
    []
  );

  const resolveLocation = useCallback(async (): Promise<{ locationId: string | null; name: string | null }> => {
    try { return await locationService.resolveSessionLocation(); } catch { return { locationId: null, name: null }; }
  }, []);

  const deleteLocation = useCallback(async (id: string) => {
    await locationService.remove(id);
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return {
    locations,
    loading,
    permissionGranted,
    refresh,
    capturePosition,
    createLocation,
    resolveLocation,
    deleteLocation,
  };
}