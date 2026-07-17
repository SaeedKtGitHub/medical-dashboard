-- Seed data: 30 hospitals, 15 ambulances, 12 alerts
-- Coordinates are realistic locations across Syria

INSERT INTO hospitals (id, name, latitude, longitude, occupancy, type, status, governorate) VALUES
  -- Existing core network
  ('a1000001-0000-4000-8000-000000000001', 'Damascus National Hospital', 33.5138, 36.2765, 72, 'Hospital', 'Active', 'Damascus'),
  ('a1000001-0000-4000-8000-000000000002', 'Aleppo University Medical Center', 36.2021, 37.1343, 85, 'Hospital', 'Active', 'Aleppo'),
  ('a1000001-0000-4000-8000-000000000003', 'Homs Central Hospital', 34.7268, 36.7234, 58, 'Hospital', 'Active', 'Homs'),
  ('a1000001-0000-4000-8000-000000000004', 'Latakia Coastal Medical Center', 35.5317, 35.7906, 41, 'Hospital', 'Active', 'Latakia'),
  ('a1000001-0000-4000-8000-000000000005', 'Hama Regional Hospital', 35.1318, 36.7578, 33, 'Hospital', 'Active', 'Hama'),
  ('a1000001-0000-4000-8000-000000000006', 'Tartus Emergency Hospital', 34.8950, 35.8867, 29, 'Hospital', 'Active', 'Tartus'),
  ('a1000001-0000-4000-8000-000000000007', 'Deir ez-Zor General Hospital', 35.3333, 40.1500, 67, 'Hospital', 'Maintenance', 'Deir ez-Zor'),
  ('a1000001-0000-4000-8000-000000000008', 'Raqqa Medical Complex', 35.9500, 39.0100, 54, 'Hospital', 'Active', 'Raqqa'),
  ('a1000001-0000-4000-8000-000000000009', 'Daraa Provincial Hospital', 32.6189, 36.1021, 46, 'Hospital', 'Active', 'Daraa'),
  ('a1000001-0000-4000-8000-000000000010', 'Idlib Health Center', 35.9306, 36.6339, 78, 'Clinic', 'Active', 'Idlib'),
  ('a1000001-0000-4000-8000-000000000011', 'Qamishli Northern Hospital', 37.0500, 41.2167, 38, 'Hospital', 'Active', 'Hasakah'),
  ('a1000001-0000-4000-8000-000000000012', 'Hasakah Community Clinic', 36.5000, 40.7500, 52, 'Clinic', 'Active', 'Hasakah'),
  ('a1000001-0000-4000-8000-000000000013', 'Sweida Mountain Medical Center', 32.7086, 36.5694, 24, 'Hospital', 'Closed', 'Sweida'),
  ('a1000001-0000-4000-8000-000000000014', 'Palmyra Field Medical Point', 34.5600, 38.2800, 91, 'Field Medical Point', 'Active', 'Homs'),
  ('a1000001-0000-4000-8000-000000000015', 'Damascus Pediatric Specialty Hospital', 33.4900, 36.3000, 61, 'Hospital', 'Active', 'Damascus'),

  -- Expanded facilities
  ('a1000001-0000-4000-8000-000000000016', 'Mouwasat University Hospital', 33.5050, 36.2910, 81, 'Hospital', 'Active', 'Damascus'),
  ('a1000001-0000-4000-8000-000000000017', 'Al-Assad University Hospital', 33.5280, 36.2680, 69, 'Hospital', 'Active', 'Damascus'),
  ('a1000001-0000-4000-8000-000000000018', 'Douma Community Clinic', 33.5720, 36.4020, 44, 'Clinic', 'Active', 'Damascus'),
  ('a1000001-0000-4000-8000-000000000019', 'Aleppo Ibn Rushd Hospital', 36.2150, 37.1550, 76, 'Hospital', 'Active', 'Aleppo'),
  ('a1000001-0000-4000-8000-000000000020', 'Aleppo Trauma Clinic', 36.1880, 37.1180, 63, 'Clinic', 'Active', 'Aleppo'),
  ('a1000001-0000-4000-8000-000000000021', 'Manbij Field Medical Point', 36.5280, 37.9550, 88, 'Field Medical Point', 'Active', 'Aleppo'),
  ('a1000001-0000-4000-8000-000000000022', 'Homs Al-Birr Hospital', 34.7400, 36.7100, 49, 'Hospital', 'Active', 'Homs'),
  ('a1000001-0000-4000-8000-000000000023', 'Talkalakh Rural Clinic', 34.6800, 36.2500, 31, 'Clinic', 'Active', 'Homs'),
  ('a1000001-0000-4000-8000-000000000024', 'Jableh Coastal Hospital', 35.3620, 35.9220, 37, 'Hospital', 'Active', 'Latakia'),
  ('a1000001-0000-4000-8000-000000000025', 'Qardaha Mountain Clinic', 35.4570, 36.0580, 28, 'Clinic', 'Maintenance', 'Latakia'),
  ('a1000001-0000-4000-8000-000000000026', 'Salamiyah District Hospital', 35.0110, 37.0530, 55, 'Hospital', 'Active', 'Hama'),
  ('a1000001-0000-4000-8000-000000000027', 'Masyaf Community Clinic', 35.0650, 36.3400, 42, 'Clinic', 'Active', 'Hama'),
  ('a1000001-0000-4000-8000-000000000028', 'Banias Port Hospital', 35.1820, 35.9480, 47, 'Hospital', 'Active', 'Tartus'),
  ('a1000001-0000-4000-8000-000000000029', 'Safita Highland Clinic', 34.8200, 36.1200, 35, 'Clinic', 'Active', 'Tartus'),
  ('a1000001-0000-4000-8000-000000000030', 'Mayadin Field Medical Point', 35.0200, 40.4500, 82, 'Field Medical Point', 'Active', 'Deir ez-Zor');

INSERT INTO ambulances (id, code, latitude, longitude, status, hospital_id) VALUES
  ('b2000001-0000-4000-8000-000000000001', 'AMB-DAM-01', 33.5200, 36.2900, 'en_route', 'a1000001-0000-4000-8000-000000000001'),
  ('b2000001-0000-4000-8000-000000000002', 'AMB-ALP-02', 36.2100, 37.1400, 'available', 'a1000001-0000-4000-8000-000000000002'),
  ('b2000001-0000-4000-8000-000000000003', 'AMB-HMS-03', 34.7300, 36.7300, 'busy', 'a1000001-0000-4000-8000-000000000003'),
  ('b2000001-0000-4000-8000-000000000004', 'AMB-LAT-04', 35.5400, 35.8000, 'available', 'a1000001-0000-4000-8000-000000000004'),
  ('b2000001-0000-4000-8000-000000000005', 'AMB-HMA-05', 35.1400, 36.7600, 'en_route', 'a1000001-0000-4000-8000-000000000005'),
  ('b2000001-0000-4000-8000-000000000006', 'AMB-DAM-06', 33.5100, 36.3050, 'available', 'a1000001-0000-4000-8000-000000000016'),
  ('b2000001-0000-4000-8000-000000000007', 'AMB-DAM-07', 33.5350, 36.2750, 'busy', 'a1000001-0000-4000-8000-000000000017'),
  ('b2000001-0000-4000-8000-000000000008', 'AMB-ALP-08', 36.2200, 37.1600, 'en_route', 'a1000001-0000-4000-8000-000000000019'),
  ('b2000001-0000-4000-8000-000000000009', 'AMB-ALP-09', 36.5300, 37.9600, 'available', 'a1000001-0000-4000-8000-000000000021'),
  ('b2000001-0000-4000-8000-000000000010', 'AMB-TRS-10', 34.9000, 35.9000, 'available', 'a1000001-0000-4000-8000-000000000006'),
  ('b2000001-0000-4000-8000-000000000011', 'AMB-RAQ-11', 35.9600, 39.0200, 'en_route', 'a1000001-0000-4000-8000-000000000008'),
  ('b2000001-0000-4000-8000-000000000012', 'AMB-DEZ-12', 35.3400, 40.1600, 'busy', 'a1000001-0000-4000-8000-000000000007'),
  ('b2000001-0000-4000-8000-000000000013', 'AMB-DRZ-13', 32.6300, 36.1100, 'available', 'a1000001-0000-4000-8000-000000000009'),
  ('b2000001-0000-4000-8000-000000000014', 'AMB-HSK-14', 37.0600, 41.2300, 'en_route', 'a1000001-0000-4000-8000-000000000011'),
  ('b2000001-0000-4000-8000-000000000015', 'AMB-MYD-15', 35.0300, 40.4600, 'available', 'a1000001-0000-4000-8000-000000000030');

INSERT INTO alerts (id, message, severity, category, is_read, created_at) VALUES
  ('c3000001-0000-4000-8000-000000000001', 'Hospital occupancy exceeded 90% at Aleppo University Medical Center.', 'WARNING', 'Hospital', TRUE, NOW() - INTERVAL '45 minutes'),
  ('c3000001-0000-4000-8000-000000000002', 'Ambulance AMB-DAM-01 is now unavailable.', 'WARNING', 'Ambulance', TRUE, NOW() - INTERVAL '30 minutes'),
  ('c3000001-0000-4000-8000-000000000003', 'Emergency case reported in Damascus.', 'CRITICAL', 'Emergency', FALSE, NOW() - INTERVAL '18 minutes'),
  ('c3000001-0000-4000-8000-000000000004', 'Latakia Coastal Medical Center reports normal operations.', 'INFO', 'System', TRUE, NOW() - INTERVAL '10 minutes'),
  ('c3000001-0000-4000-8000-000000000005', 'Medical center entered maintenance mode in Deir ez-Zor.', 'WARNING', 'Hospital', FALSE, NOW() - INTERVAL '4 minutes'),
  ('c3000001-0000-4000-8000-000000000006', 'Hospital occupancy exceeded 90% at Palmyra Field Medical Point.', 'CRITICAL', 'Hospital', FALSE, NOW() - INTERVAL '55 minutes'),
  ('c3000001-0000-4000-8000-000000000007', 'Ambulance AMB-ALP-08 requesting priority corridor clearance.', 'WARNING', 'Ambulance', TRUE, NOW() - INTERVAL '40 minutes'),
  ('c3000001-0000-4000-8000-000000000008', 'Emergency case reported in Aleppo.', 'CRITICAL', 'Emergency', FALSE, NOW() - INTERVAL '25 minutes'),
  ('c3000001-0000-4000-8000-000000000009', 'Mouwasat University Hospital capacity stabilized within normal range.', 'INFO', 'Hospital', TRUE, NOW() - INTERVAL '15 minutes'),
  ('c3000001-0000-4000-8000-000000000010', 'Ambulance AMB-DEZ-12 is now unavailable.', 'WARNING', 'Ambulance', FALSE, NOW() - INTERVAL '12 minutes'),
  ('c3000001-0000-4000-8000-000000000011', 'Qardaha Mountain Clinic entered maintenance mode.', 'WARNING', 'Hospital', TRUE, NOW() - INTERVAL '8 minutes'),
  ('c3000001-0000-4000-8000-000000000012', 'System heartbeat confirmed for medical network sensors.', 'INFO', 'System', TRUE, NOW() - INTERVAL '2 minutes');
