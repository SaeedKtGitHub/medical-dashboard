import L from 'leaflet';
import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { Ambulance, Hospital } from '../../types';
import {
  formatOccupancy,
  formatStatusLabel,
  getHospitalMarkerColor,
} from '../../services/formatters';
import {
  labels,
  translateFacilityType,
  translateGovernorate,
} from '../../i18n/ar';
import { AmbulancePopupContent } from './AmbulancePopupContent';

const SYRIA_CENTER: [number, number] = [34.8, 38.5];
const DEFAULT_ZOOM = 7;

function createHospitalIcon(occupancy: number): L.DivIcon {
  const color = getHospitalMarkerColor(occupancy);

  return L.divIcon({
    className: 'custom-marker',
    html: `<span class="marker-dot marker-dot--hospital" style="background:${color}; box-shadow:0 0 0 3px ${color}33;"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

const ambulanceIcon = L.divIcon({
  className: 'custom-marker',
  html: `<span class="marker-ambulance" title="${labels.ambulances}">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="2" y="8" width="16" height="9" rx="2" fill="#007A3D"/>
      <path d="M18 11h3l1 3v3h-4v-6z" fill="#007A3D"/>
      <circle cx="7" cy="18" r="2" fill="#005C2E"/>
      <circle cx="17" cy="18" r="2" fill="#005C2E"/>
      <rect x="6" y="4" width="6" height="4" rx="1" fill="#EAF5EE"/>
      <path d="M8 5.2h2M9 4.2v2" stroke="#007A3D" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  </span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -12],
});

interface HospitalMarkersProps {
  hospitals: Hospital[];
}

function HospitalMarkers({ hospitals }: HospitalMarkersProps) {
  return (
    <>
      {hospitals.map((hospital) => (
        <Marker
          key={`${hospital.id}-${hospital.occupancy}`}
          position={[hospital.latitude, hospital.longitude]}
          icon={createHospitalIcon(hospital.occupancy)}
        >
          <Popup>
            <div className="map-popup">
              <strong>{hospital.name}</strong>
              <p>
                {labels.occupancyLabel}: {formatOccupancy(hospital.occupancy)}
              </p>
              <p>
                {labels.typeLabel}: {translateFacilityType(hospital.type)}
              </p>
              <p>
                {labels.statusLabel}: {formatStatusLabel(hospital.status)}
              </p>
              <p>
                {labels.governorateLabel}:{' '}
                {translateGovernorate(hospital.governorate)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

interface AmbulanceMarkerProps {
  ambulance: Ambulance;
}

function AmbulanceMarker({ ambulance }: AmbulanceMarkerProps) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <Marker
      position={[ambulance.latitude, ambulance.longitude]}
      icon={ambulanceIcon}
      eventHandlers={{
        popupopen: () => setPopupOpen(true),
        popupclose: () => setPopupOpen(false),
      }}
    >
      <Popup>
        <AmbulancePopupContent ambulance={ambulance} enabled={popupOpen} />
      </Popup>
    </Marker>
  );
}

interface AmbulanceMarkersProps {
  ambulances: Ambulance[];
}

function AmbulanceMarkers({ ambulances }: AmbulanceMarkersProps) {
  return (
    <>
      {ambulances.map((ambulance) => (
        <AmbulanceMarker key={ambulance.id} ambulance={ambulance} />
      ))}
    </>
  );
}

interface DashboardMapProps {
  hospitals: Hospital[];
  ambulances: Ambulance[];
  loading?: boolean;
  mode?: 'live' | 'historical';
}

export function DashboardMap({
  hospitals,
  ambulances,
  loading = false,
  mode = 'live',
}: DashboardMapProps) {
  const hospitalMarkers = useMemo(
    () => <HospitalMarkers hospitals={hospitals} />,
    [hospitals]
  );

  const isEmpty = hospitals.length === 0 && ambulances.length === 0;

  return (
    <div
      className={`map-shell ${mode === 'historical' ? 'map-shell--historical' : ''}`}
    >
      <MapContainer
        center={SYRIA_CENTER}
        zoom={DEFAULT_ZOOM}
        className="dashboard-map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitalMarkers}
        <AmbulanceMarkers ambulances={ambulances} />
      </MapContainer>

      <div className="map-legend" aria-label={labels.mapLegend}>
        <strong className="map-legend__title">{labels.mapLegend}</strong>
        <span>
          <i className="legend-swatch legend-swatch--green" /> {labels.legendLow}
        </span>
        <span>
          <i className="legend-swatch legend-swatch--yellow" />{' '}
          {labels.legendMedium}
        </span>
        <span>
          <i className="legend-swatch legend-swatch--red" /> {labels.legendHigh}
        </span>
        <span>
          <i className="legend-swatch legend-swatch--ambulance" />{' '}
          {labels.legendAmbulance}
        </span>
      </div>

      {loading ? (
        <div className="map-overlay" role="status">
          <div className="spinner" aria-hidden="true" />
          <p>{labels.loadingMap}</p>
        </div>
      ) : null}

      {!loading && isEmpty ? (
        <div className="map-overlay map-overlay--empty" role="status">
          <p>{labels.noHospitalsFound}</p>
          <span>{labels.emptyMapHint}</span>
        </div>
      ) : null}
    </div>
  );
}
