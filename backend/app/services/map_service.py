import math

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two lat/lon coordinates."""
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def estimate_eta_minutes(distance_km: float, speed_kmh: float = 35.0) -> int:
    """Estimate travel time in minutes assuming average city emergency speed."""
    if distance_km <= 0:
        return 1
    hours = distance_km / speed_kmh
    minutes = math.ceil(hours * 60)
    return max(1, minutes)

def interpolate_route(start_lat: float, start_lon: float, end_lat: float, end_lon: float, steps: int = 10):
    """Generate linear interpolation points between two coordinates for simulated ambulance movement."""
    points = []
    for i in range(steps + 1):
        t = i / float(steps)
        lat = start_lat + t * (end_lat - start_lat)
        lon = start_lon + t * (end_lon - start_lon)
        points.append({"lat": round(lat, 6), "lon": round(lon, 6)})
    return points
