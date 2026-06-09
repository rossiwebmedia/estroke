// Utility geografiche client-side, niente network.

const R_KM = 6371; // raggio terrestre in km

function toRad(deg) { return (deg * Math.PI) / 180; }

// Distanza in linea d'aria fra due coordinate (km).
export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

// Stima molto rozza dei minuti di guida da una distanza in linea d'aria.
// Fattore 1.4 per la tortuosità delle strade, 50 km/h velocità media.
// Risultato in minuti, arrotondato.
export function estimateDriveMinutes(linearKm) {
  const roadKm = linearKm * 1.4;
  const minutes = (roadKm / 50) * 60;
  return Math.max(1, Math.round(minutes));
}

// Ritorna i `limit` ospedali più vicini al punto, con km in linea d'aria e
// stima minuti di guida.
export function nearestHospitals(point, hospitals, limit = 5) {
  return hospitals
    .map((h) => {
      const km = haversineKm(point, h);
      return {
        ...h,
        distanceKm: Math.round(km * 10) / 10,
        driveMinutes: estimateDriveMinutes(km),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
