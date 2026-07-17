import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { createDashboardSocket } from '../services/socket';
import { labels } from '../i18n/ar';
import type { Alert, Ambulance, Hospital } from '../types';

export type DashboardMode = 'live' | 'historical';

interface DashboardState {
  hospitals: Hospital[];
  ambulances: Ambulance[];
  alerts: Alert[];
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
  historyError: string | null;
  socketConnected: boolean;
  criticalToast: Alert | null;
  mode: DashboardMode;
  historicalAt: string | null;
}

const ALERT_HISTORY_LIMIT = 20;

function toLocalInputValues(iso?: string): { date: string; time: string } {
  const date = iso ? new Date(iso) : new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function useDashboardData() {
  const initialInputs = toLocalInputValues();
  const [state, setState] = useState<DashboardState>({
    hospitals: [],
    ambulances: [],
    alerts: [],
    loading: true,
    historyLoading: false,
    error: null,
    historyError: null,
    socketConnected: false,
    criticalToast: null,
    mode: 'live',
    historicalAt: null,
  });
  const [historyDate, setHistoryDate] = useState(initialInputs.date);
  const [historyTime, setHistoryTime] = useState(initialInputs.time);
  const modeRef = useRef<DashboardMode>('live');

  const loadInitialData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [hospitals, ambulances, alerts] = await Promise.all([
        api.getHospitals(),
        api.getAmbulances(),
        api.getAlerts(),
      ]);

      setState((prev) => ({
        ...prev,
        hospitals,
        ambulances,
        alerts: alerts.slice(0, ALERT_HISTORY_LIMIT),
        loading: false,
        error: null,
        mode: 'live',
        historicalAt: null,
      }));
      modeRef.current = 'live';
    } catch (error) {
      const message =
        error instanceof Error ? error.message : labels.failedLoadData;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  }, []);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const socket = createDashboardSocket({
      onConnect: () => {
        setState((prev) => ({ ...prev, socketConnected: true }));
      },
      onDisconnect: () => {
        setState((prev) => ({ ...prev, socketConnected: false }));
      },
      onAmbulanceUpdated: (ambulance) => {
        if (modeRef.current === 'historical') {
          return;
        }
        setState((prev) => ({
          ...prev,
          ambulances: prev.ambulances.map((item) =>
            item.id === ambulance.id ? ambulance : item
          ),
        }));
      },
      onHospitalUpdated: (hospital) => {
        if (modeRef.current === 'historical') {
          return;
        }
        setState((prev) => ({
          ...prev,
          hospitals: prev.hospitals.map((item) =>
            item.id === hospital.id ? hospital : item
          ),
        }));
      },
      onAlertCreated: (alert) => {
        if (modeRef.current === 'historical') {
          return;
        }
        setState((prev) => ({
          ...prev,
          alerts: [alert, ...prev.alerts].slice(0, ALERT_HISTORY_LIMIT),
          criticalToast:
            alert.severity === 'CRITICAL' ? alert : prev.criticalToast,
        }));
      },
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dismissCriticalToast = useCallback(() => {
    setState((prev) => ({ ...prev, criticalToast: null }));
  }, []);

  const loadHistoricalView = useCallback(async () => {
    const datetimeIso = new Date(`${historyDate}T${historyTime}:00`).toISOString();

    setState((prev) => ({
      ...prev,
      historyLoading: true,
      historyError: null,
    }));

    try {
      const historical = await api.getHistoryAt(datetimeIso);
      modeRef.current = 'historical';
      setState((prev) => ({
        ...prev,
        hospitals: historical.hospitals,
        ambulances: historical.ambulances,
        alerts: historical.alerts.slice(0, ALERT_HISTORY_LIMIT),
        mode: 'historical',
        historicalAt: historical.snapshot.createdAt,
        historyLoading: false,
        historyError: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : labels.failedHistorical;
      setState((prev) => ({
        ...prev,
        historyLoading: false,
        historyError: message,
      }));
    }
  }, [historyDate, historyTime]);

  const returnToLiveMode = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      historyLoading: true,
      historyError: null,
    }));

    try {
      const [hospitals, ambulances, alerts] = await Promise.all([
        api.getHospitals(),
        api.getAmbulances(),
        api.getAlerts(),
      ]);

      modeRef.current = 'live';
      setState((prev) => ({
        ...prev,
        hospitals,
        ambulances,
        alerts: alerts.slice(0, ALERT_HISTORY_LIMIT),
        mode: 'live',
        historicalAt: null,
        historyLoading: false,
        historyError: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : labels.failedReturnLive;
      setState((prev) => ({
        ...prev,
        historyLoading: false,
        historyError: message,
      }));
    }
  }, []);

  return {
    hospitals: state.hospitals,
    ambulances: state.ambulances,
    alerts: state.alerts,
    loading: state.loading,
    historyLoading: state.historyLoading,
    error: state.error,
    historyError: state.historyError,
    socketConnected: state.socketConnected,
    criticalToast: state.criticalToast,
    mode: state.mode,
    historicalAt: state.historicalAt,
    historyDate,
    historyTime,
    setHistoryDate,
    setHistoryTime,
    loadHistoricalView,
    returnToLiveMode,
    dismissCriticalToast,
    reload: loadInitialData,
  };
}
