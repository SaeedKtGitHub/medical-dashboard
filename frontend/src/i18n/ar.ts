/** Arabic UI labels. Filter option values stay English to match the API/database. */

export const labels = {
  appTitle: 'لوحة المعلومات الطبية',
  appSubtitle: 'نظرة عامة على العمليات الجغرافية',
  networkTitle: 'الشبكة الطبية في سوريا',
  liveSubtitle: 'إشغال المشافي ومواقع الإسعاف لحظيًا',
  historicalSubtitle: 'حالة النظام التاريخية (التحديثات الحية متوقفة)',
  historicalMode: 'الوضع التاريخي',
  liveMode: 'الوضع الحي',
  connected: 'متصل',
  disconnected: 'غير متصل',
  socketDisconnected:
    'انقطع الاتصال المباشر. التحديثات الحية متوقفة حتى يعود الاتصال.',
  loadingDashboard: 'جاري تحميل لوحة المعلومات الطبية...',
  loadingGeneric: 'جاري التحميل...',
  loadingMap: 'جاري تحميل بيانات الخريطة...',
  unableToLoad: 'تعذر تحميل لوحة المعلومات',
  tryAgain: 'إعادة المحاولة',
  backendUnavailable: 'الخادم غير متاح. تأكد من تشغيل واجهة البرمجة.',
  apiFailedPrefix: 'فشل طلب الواجهة البرمجية. ',
  hospitals: 'المشافي',
  ambulances: 'سيارات الإسعاف',
  averageOccupancy: 'متوسط الإشغال',
  activeAlerts: 'التنبيهات النشطة',
  last24Hours: 'آخر 24 ساعة',
  filters: 'التصفية',
  reset: 'إعادة تعيين',
  searchHospital: 'بحث عن مشفى',
  searchPlaceholder: 'ابحث بالاسم...',
  governorate: 'المحافظة',
  allGovernorates: 'كل المحافظات',
  facilityType: 'نوع المنشأة',
  allTypes: 'كل الأنواع',
  status: 'الحالة',
  allStatuses: 'كل الحالات',
  occupancy: 'الإشغال',
  allOccupancy: 'كل مستويات الإشغال',
  showHospitals: 'إظهار المشافي',
  showAmbulances: 'إظهار سيارات الإسعاف',
  timeMachine: 'آلة الزمن',
  timeMachineHint: 'اختر تاريخًا ووقتًا لمعاينة لقطة محفوظة للنظام.',
  date: 'التاريخ',
  time: 'الوقت',
  loadHistorical: 'تحميل العرض التاريخي',
  returnLive: 'العودة إلى الوضع الحي',
  alertCenter: 'مركز التنبيهات',
  noActiveAlerts: 'لا توجد تنبيهات نشطة',
  criticalAlert: 'تنبيه حرج',
  dismissNotification: 'إغلاق الإشعار',
  mapLegend: 'مفتاح الخريطة',
  legendLow: 'أخضر: إشغال منخفض',
  legendMedium: 'أصفر: إشغال متوسط',
  legendHigh: 'أحمر: إشغال مرتفع',
  legendAmbulance: 'وحدة إسعاف',
  noHospitalsFound: 'لا توجد مشافٍ',
  emptyMapHint: 'جرّب تعديل عوامل التصفية أو العودة إلى الوضع الحي.',
  occupancyLabel: 'الإشغال',
  typeLabel: 'النوع',
  statusLabel: 'الحالة',
  governorateLabel: 'المحافظة',
  latitude: 'خط العرض',
  longitude: 'خط الطول',
  nearestHospitals: 'أقرب المشافي',
  calculatingDistances: 'جاري حساب المسافات...',
  failedNearest: 'تعذر تحميل أقرب المشافي',
  failedLoadData: 'تعذر تحميل بيانات لوحة المعلومات',
  failedHistorical: 'تعذر تحميل العرض التاريخي',
  failedReturnLive: 'تعذر العودة إلى الوضع الحي',
  unknownApiError: 'خطأ غير معروف في الواجهة البرمجية',
  requestFailed: 'فشل الطلب',
  km: 'كم',
};

export const facilityTypeLabels: Record<string, string> = {
  Hospital: 'مشفى',
  Clinic: 'عيادة',
  'Field Medical Point': 'نقطة طبية ميدانية',
};

export const statusLabels: Record<string, string> = {
  Active: 'نشط',
  Maintenance: 'صيانة',
  Closed: 'مغلق',
  available: 'متاحة',
  en_route: 'في الطريق',
  busy: 'مشغولة',
  offline: 'غير متصل',
};

export const severityLabels: Record<string, string> = {
  INFO: 'معلومة',
  WARNING: 'تحذير',
  CRITICAL: 'حرج',
};

export const categoryLabels: Record<string, string> = {
  Hospital: 'مشفى',
  Ambulance: 'إسعاف',
  Emergency: 'طوارئ',
  System: 'نظام',
};

export const governorateLabels: Record<string, string> = {
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

export function translateFacilityType(value: string): string {
  return facilityTypeLabels[value] ?? value;
}

export function translateStatus(value: string): string {
  return statusLabels[value] ?? value;
}

export function translateSeverity(value: string): string {
  return severityLabels[value] ?? value;
}

export function translateCategory(value: string): string {
  return categoryLabels[value] ?? value;
}

export function translateGovernorate(value: string): string {
  return governorateLabels[value] ?? value;
}
