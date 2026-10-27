/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  countryCode: string;
  regionName?: string;
  timezone?: string;
  source: "browser-gps" | "ip-service" | "timezone-fallback";
  ip?: string;
  lastUpdated: number;
}

const STORAGE_KEY = "jolsel_real_user_location_v2";

// Timezone to approximate coordinates fallback map
const TIMEZONE_COORDS: Record<string, { lat: number; lon: number; city: string; country: string; code: string }> = {
  "America/New_York": { lat: 40.7128, lon: -74.006, city: "New York", country: "United States", code: "US" },
  "America/Chicago": { lat: 41.8781, lon: -87.6298, city: "Chicago", country: "United States", code: "US" },
  "America/Los_Angeles": { lat: 34.0522, lon: -118.2437, city: "Los Angeles", country: "United States", code: "US" },
  "America/Denver": { lat: 39.7392, lon: -104.9903, city: "Denver", country: "United States", code: "US" },
  "America/Toronto": { lat: 43.6532, lon: -79.3832, city: "Toronto", country: "Canada", code: "CA" },
  "America/Sao_Paulo": { lat: -23.5505, lon: -46.6333, city: "São Paulo", country: "Brazil", code: "BR" },
  "Europe/London": { lat: 51.5074, lon: -0.1278, city: "London", country: "United Kingdom", code: "GB" },
  "Europe/Paris": { lat: 48.8566, lon: 2.3522, city: "Paris", country: "France", code: "FR" },
  "Europe/Berlin": { lat: 52.52, lon: 13.405, city: "Berlin", country: "Germany", code: "DE" },
  "Europe/Amsterdam": { lat: 52.3676, lon: 4.9041, city: "Amsterdam", country: "Netherlands", code: "NL" },
  "Europe/Warsaw": { lat: 52.2297, lon: 21.0122, city: "Warsaw", country: "Poland", code: "PL" },
  "Asia/Tokyo": { lat: 35.6762, lon: 139.6503, city: "Tokyo", country: "Japan", code: "JP" },
  "Asia/Singapore": { lat: 1.3521, lon: 103.8198, city: "Singapore", country: "Singapore", code: "SG" },
  "Asia/Seoul": { lat: 37.5665, lon: 126.978, city: "Seoul", country: "South Korea", code: "KR" },
  "Asia/Hong_Kong": { lat: 22.3193, lon: 114.1694, city: "Hong Kong", country: "Hong Kong", code: "HK" },
  "Asia/Dubai": { lat: 25.2048, lon: 55.2708, city: "Dubai", country: "United Arab Emirates", code: "AE" },
  "Asia/Kolkata": { lat: 19.076, lon: 72.8777, city: "Mumbai", country: "India", code: "IN" },
  "Australia/Sydney": { lat: -33.8688, lon: 151.2093, city: "Sydney", country: "Australia", code: "AU" },
  "Pacific/Auckland": { lat: -36.8485, lon: 174.7633, city: "Auckland", country: "New Zealand", code: "NZ" },
};

/**
 * Gets cached location if fresh (< 2 hours)
 */
export function getCachedUserLocation(): UserGeoLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: UserGeoLocation = JSON.parse(raw);
    if (Date.now() - parsed.lastUpdated < 2 * 60 * 60 * 1000) {
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/**
 * Actively detects user's real location via Browser GPS -> IP Geolocation API -> Timezone heuristics.
 */
export async function detectRealUserLocation(): Promise<UserGeoLocation> {
  const cached = getCachedUserLocation();
  if (cached) {
    return cached;
  }

  // 1. Try Browser Geolocation API if available and user permits
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          maximumAge: 60000,
          enableHighAccuracy: false,
        });
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Reverse geocode via BigDataCloud client API (free, no auth required, client-side friendly)
      try {
        const revRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          const location: UserGeoLocation = {
            latitude: lat,
            longitude: lon,
            city: revData.city || revData.locality || "Local Node",
            country: revData.countryName || "Earth",
            countryCode: revData.countryCode || "GL",
            regionName: revData.principalSubdivision || "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            source: "browser-gps",
            lastUpdated: Date.now(),
          };
          saveLocation(location);
          return location;
        }
      } catch {
        // Fallback with raw lat/lon
        const location: UserGeoLocation = {
          latitude: lat,
          longitude: lon,
          city: "GPS Node",
          country: "Verified Location",
          countryCode: "GPS",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          source: "browser-gps",
          lastUpdated: Date.now(),
        };
        saveLocation(location);
        return location;
      }
    } catch {
      // Permission denied or timed out, move to IP Geolocation
    }
  }

  // 2. Try IP-based Geolocation lookup
  try {
    const ipRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3500) });
    if (ipRes.ok) {
      const data = await ipRes.json();
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        const location: UserGeoLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || "Connected City",
          country: data.country_name || "Connected Country",
          countryCode: data.country_code || "UN",
          regionName: data.region || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          ip: data.ip,
          source: "ip-service",
          lastUpdated: Date.now(),
        };
        saveLocation(location);
        return location;
      }
    }
  } catch {
    // IP API failed or was blocked by ad-blocker
  }

  // Secondary IP lookup
  try {
    const secRes = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(3000) });
    if (secRes.ok) {
      const data = await secRes.json();
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        const location: UserGeoLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.cityName || "Node City",
          country: data.countryName || "Earth",
          countryCode: data.countryCode || "UN",
          regionName: data.regionName || "",
          timezone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          ip: data.ipAddress,
          source: "ip-service",
          lastUpdated: Date.now(),
        };
        saveLocation(location);
        return location;
      }
    }
  } catch {
    // Secondary IP failed
  }

  // 3. Fallback based on browser's configured IANA timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const match = TIMEZONE_COORDS[tz];
  if (match) {
    const location: UserGeoLocation = {
      latitude: match.lat,
      longitude: match.lon,
      city: match.city,
      country: match.country,
      countryCode: match.code,
      timezone: tz,
      source: "timezone-fallback",
      lastUpdated: Date.now(),
    };
    saveLocation(location);
    return location;
  }

  // Default fallback (Prime Meridian / London Hub)
  const defaultLocation: UserGeoLocation = {
    latitude: 51.5074,
    longitude: -0.1278,
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: tz,
    source: "timezone-fallback",
    lastUpdated: Date.now(),
  };
  saveLocation(defaultLocation);
  return defaultLocation;
}

function saveLocation(loc: UserGeoLocation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Mathematical conversion of Latitude & Longitude to 3D Cartesian coordinates on a sphere.
 * R = sphere radius
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return { x, y, z };
}
