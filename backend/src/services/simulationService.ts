import { Server as SocketServer } from 'socket.io';
import { AlertCategory, AlertSeverity } from '../models/Alert';
import { Ambulance } from '../models/Ambulance';
import { Hospital } from '../models/Hospital';
import { createAlert } from './alertService';
import {
  getAllAmbulances,
  updateAmbulancePosition,
} from './ambulanceService';
import {
  getAllHospitals,
  updateHospitalOccupancy,
} from './hospitalService';
import { logger } from '../utils/logger';

/** Approximate Syria bounding box to keep simulated movement inside the country */
const SYRIA_BOUNDS = {
  minLat: 32.3,
  maxLat: 37.3,
  minLng: 35.6,
  maxLng: 42.3,
};

interface AlertTemplate {
  severity: AlertSeverity;
  category: AlertCategory;
  templates: string[];
}

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    severity: 'INFO',
    category: 'System',
    templates: [
      'اكتملت مراجعة الحالة الروتينية للمنشآت المراقبة.',
      '{hospital} يسجل تدفق استقبال طبيعي.',
      'تم تأكيد نبض النظام لحساسات الشبكة الطبية.',
    ],
  },
  {
    severity: 'INFO',
    category: 'Hospital',
    templates: [
      'استقرت سعة {hospital} ضمن النطاق الطبيعي.',
      'تم تحديث مستويات التوظيف في {hospital}.',
    ],
  },
  {
    severity: 'WARNING',
    category: 'Hospital',
    templates: [
      'تجاوز إشغال المشفى 90٪ في {hospital}.',
      'دخلت المنشأة الطبية وضع الصيانة في {hospital}.',
      'ارتفاع أوقات الانتظار في الطوارئ لدى {hospital}.',
    ],
  },
  {
    severity: 'WARNING',
    category: 'Ambulance',
    templates: [
      'سيارة الإسعاف {ambulance} غير متاحة الآن.',
      'تأخير سيارة الإسعاف {ambulance} بسبب ازدحام المرور.',
      'سيارة الإسعاف {ambulance} تطلب ممر أولوية.',
    ],
  },
  {
    severity: 'CRITICAL',
    category: 'Emergency',
    templates: [
      'بلاغ حالة طارئة في {governorate}.',
      'وصلت السعة الحرجة في {hospital}. مطلوب دعم فوري.',
      'تفعيل حالة الاستنفار بالقرب من {hospital}.',
    ],
  },
  {
    severity: 'CRITICAL',
    category: 'Hospital',
    templates: [
      'تجاوز إشغال المشفى 90٪ في {hospital}.',
      'تفعيل بروتوكول التحويل الحرج لـ {hospital}.',
    ],
  },
];

interface AmbulanceMotionState {
  bearing: number;
  speed: number;
}

const motionState = new Map<string, AmbulanceMotionState>();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const GOVERNORATE_AR: Record<string, string> = {
  Damascus: 'دمشق',
  Aleppo: 'حلب',
  Homs: 'حمص',
  Latakia: 'اللاذقية',
  Hama: 'حماة',
  Tartus: 'طرطوس',
  'Deir ez-Zor': 'دير الزور',
  Raqqa: 'الرقة',
  Daraa: 'درعا',
  Idlib: 'إدلب',
  Hasakah: 'الحسكة',
  Sweida: 'السويداء',
  دمشق: 'دمشق',
  حلب: 'حلب',
  حمص: 'حمص',
  اللاذقية: 'اللاذقية',
  حماة: 'حماة',
  طرطوس: 'طرطوس',
  'دير الزور': 'دير الزور',
  الرقة: 'الرقة',
  درعا: 'درعا',
  إدلب: 'إدلب',
  الحسكة: 'الحسكة',
  السويداء: 'السويداء',
};

function getOrCreateMotion(ambulance: Ambulance): AmbulanceMotionState {
  const existing = motionState.get(ambulance.id);
  if (existing) {
    return existing;
  }

  const state: AmbulanceMotionState = {
    bearing: randomInRange(0, 360),
    speed: randomInRange(0.0008, 0.0022),
  };
  motionState.set(ambulance.id, state);
  return state;
}

/**
 * Generates a small, natural-looking position delta for an ambulance.
 * Uses a persistent bearing with gentle drift and occasional turns.
 */
export function generateAmbulanceMovement(ambulance: Ambulance): {
  latitude: number;
  longitude: number;
} {
  const motion = getOrCreateMotion(ambulance);

  if (Math.random() < 0.15) {
    motion.bearing += randomInRange(-90, 90);
  } else {
    motion.bearing += randomInRange(-18, 18);
  }
  motion.bearing = ((motion.bearing % 360) + 360) % 360;

  motion.speed = clamp(
    motion.speed + randomInRange(-0.0002, 0.0002),
    0.0006,
    0.0025
  );

  const radians = (motion.bearing * Math.PI) / 180;
  let latitude = ambulance.latitude + Math.cos(radians) * motion.speed;
  let longitude = ambulance.longitude + Math.sin(radians) * motion.speed;

  if (latitude < SYRIA_BOUNDS.minLat || latitude > SYRIA_BOUNDS.maxLat) {
    motion.bearing = 180 - motion.bearing;
    latitude = clamp(latitude, SYRIA_BOUNDS.minLat, SYRIA_BOUNDS.maxLat);
  }
  if (longitude < SYRIA_BOUNDS.minLng || longitude > SYRIA_BOUNDS.maxLng) {
    motion.bearing = -motion.bearing;
    longitude = clamp(longitude, SYRIA_BOUNDS.minLng, SYRIA_BOUNDS.maxLng);
  }

  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  };
}

/**
 * Produces a realistic occupancy change for a hospital (±3–12 points).
 */
export function generateHospitalOccupancy(currentOccupancy: number): number {
  const delta = Math.round(randomInRange(3, 12)) * (Math.random() < 0.5 ? -1 : 1);
  return clamp(currentOccupancy + delta, 5, 98);
}

/**
 * Builds a realistic alert using hospital/ambulance context.
 */
export function generateRandomAlert(
  hospitals: Hospital[],
  ambulances: Ambulance[]
): { message: string; severity: AlertSeverity; category: AlertCategory } {
  const templateGroup = pickRandom(ALERT_TEMPLATES);
  const template = pickRandom(templateGroup.templates);
  const hospital = pickRandom(hospitals);
  const ambulance = pickRandom(ambulances);

  const message = template
    .replace('{hospital}', hospital?.name ?? 'منشأة طبية مراقبة')
    .replace('{ambulance}', ambulance?.code ?? 'وحدة إسعاف')
    .replace(
      '{governorate}',
      GOVERNORATE_AR[hospital?.governorate ?? ''] ??
        hospital?.governorate ??
        'دمشق'
    );

  return {
    message,
    severity: templateGroup.severity,
    category: templateGroup.category,
  };
}

export class SimulationService {
  private io: SocketServer | null = null;
  private timers: NodeJS.Timeout[] = [];
  private running = false;

  start(io: SocketServer): void {
    if (this.running) {
      return;
    }

    this.io = io;
    this.running = true;

    this.timers.push(
      setInterval(() => {
        void this.tickAmbulances();
      }, 2000)
    );

    this.timers.push(
      setInterval(() => {
        void this.tickHospitalOccupancy();
      }, 5000)
    );

    this.timers.push(
      setInterval(() => {
        void this.tickAlert();
      }, 20000)
    );

    logger.info('Simulation service started');
  }

  stop(): void {
    for (const timer of this.timers) {
      clearInterval(timer);
    }
    this.timers = [];
    this.running = false;
    logger.info('Simulation service stopped');
  }

  private async tickAmbulances(): Promise<void> {
    try {
      const ambulances = await getAllAmbulances();

      for (const ambulance of ambulances) {
        if (ambulance.status === 'offline') {
          continue;
        }

        const next = generateAmbulanceMovement(ambulance);
        const updated = await updateAmbulancePosition(
          ambulance.id,
          next.latitude,
          next.longitude
        );

        if (updated && this.io) {
          this.io.emit('ambulance_updated', updated);
        }
      }
    } catch (error) {
      logger.error('Ambulance simulation tick failed', error);
    }
  }

  private async tickHospitalOccupancy(): Promise<void> {
    try {
      const hospitals = await getAllHospitals();
      if (hospitals.length === 0) {
        return;
      }

      const hospital = pickRandom(hospitals);
      const occupancy = generateHospitalOccupancy(hospital.occupancy);
      const updated = await updateHospitalOccupancy(hospital.id, occupancy);

      if (updated && this.io) {
        this.io.emit('hospital_updated', updated);
      }
    } catch (error) {
      logger.error('Hospital occupancy simulation tick failed', error);
    }
  }

  private async tickAlert(): Promise<void> {
    try {
      const [hospitals, ambulances] = await Promise.all([
        getAllHospitals(),
        getAllAmbulances(),
      ]);

      if (hospitals.length === 0) {
        return;
      }

      const { message, severity, category } = generateRandomAlert(
        hospitals,
        ambulances
      );
      const alert = await createAlert(message, severity, category);

      if (this.io) {
        this.io.emit('alert_created', alert);
      }
    } catch (error) {
      logger.error('Alert simulation tick failed', error);
    }
  }
}

export const simulationService = new SimulationService();
