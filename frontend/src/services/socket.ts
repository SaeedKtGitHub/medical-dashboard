import { io, Socket } from 'socket.io-client';
import type { Alert, Ambulance, Hospital } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/socket.io';

export type SocketHandlers = {
  onAmbulanceUpdated?: (ambulance: Ambulance) => void;
  onHospitalUpdated?: (hospital: Hospital) => void;
  onAlertCreated?: (alert: Alert) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export function createDashboardSocket(handlers: SocketHandlers): Socket {
  const socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    handlers.onConnect?.();
  });

  socket.on('disconnect', () => {
    handlers.onDisconnect?.();
  });

  socket.on('ambulance_updated', (ambulance: Ambulance) => {
    handlers.onAmbulanceUpdated?.(ambulance);
  });

  socket.on('hospital_updated', (hospital: Hospital) => {
    handlers.onHospitalUpdated?.(hospital);
  });

  socket.on('alert_created', (alert: Alert) => {
    handlers.onAlertCreated?.(alert);
  });

  return socket;
}
