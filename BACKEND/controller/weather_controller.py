import requests
from fastapi import APIRouter, HTTPException, Query

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
IPINFO_URL = "https://ipinfo.io/json"

router = APIRouter(tags=["Weather"])


def _fetch_json(url: str, params: dict | None = None) -> dict:
    response = requests.get(url, params=params, timeout=5)
    if not response.ok:
        raise HTTPException(
            status_code=502, detail="Failed to reach upstream weather service")
    try:
        return response.json()
    except ValueError as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=502, detail="Invalid response from upstream service") from exc


def _resolve_location(location: str | None) -> dict:
    if location:
        geocode = _fetch_json(GEOCODE_URL, {"name": location, "count": 1})
        results = geocode.get("results") or []
        if not results:
            raise HTTPException(status_code=404, detail="Location not found")
        top = results[0]
        return {
            "name": top.get("name"),
            "country": top.get("country"),
            "latitude": top.get("latitude"),
            "longitude": top.get("longitude"),
        }

    # Default to server's public IP location if no location is provided
    ipinfo = _fetch_json(IPINFO_URL)
    loc = (ipinfo.get("loc") or ",").split(",")
    if len(loc) != 2 or not loc[0] or not loc[1]:
        raise HTTPException(
            status_code=503, detail="Unable to detect server location")
    latitude, longitude = map(float, loc)
    return {
        "name": ipinfo.get("city") or "Server location",
        "country": ipinfo.get("country"),
        "latitude": latitude,
        "longitude": longitude,
    }


@router.get(
    "/weather",
    summary="Get current weather",
    description="Returns current weather for a given location; defaults to server location when omitted.",
)
def get_weather(location: str | None = Query(None, description="City or place name")):
    resolved = _resolve_location(location)
    weather = _fetch_json(
        WEATHER_URL,
        {
            "latitude": resolved["latitude"],
            "longitude": resolved["longitude"],
            "current_weather": True,
            "timezone": "auto",
        },
    )
    current = weather.get("current_weather")
    if not current:
        raise HTTPException(status_code=503, detail="Weather data unavailable")

    return {
        "location": resolved,
        "weather": {
            "temperature": current.get("temperature"),
            "windspeed": current.get("windspeed"),
            "winddirection": current.get("winddirection"),
            "weathercode": current.get("weathercode"),
            "time": current.get("time"),
        },
    }
