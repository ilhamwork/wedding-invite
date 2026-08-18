-- Delete all guests with source = 'Bapa'
-- Migration date: 2026-08-18

DELETE FROM guests
WHERE source = 'Bapa';
