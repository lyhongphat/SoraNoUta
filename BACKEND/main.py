from http.client import HTTPException
from fastapi import FastAPI

from controller import auth_controller, weather_controller

app = FastAPI(title="Sora no Uta API")


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(weather_controller.router)
app.include_router(auth_controller.router)

LOCATION_IPINFO_URL = "https://ipinfo.io/json"


@app.get("/server_location")
def get_server_location():
    import requests
    response = requests.get(LOCATION_IPINFO_URL, timeout=5)
    if not response.ok:
        raise HTTPException(
            status_code=502, detail="Failed to reach upstream location service")
    try:
        data = response.json()
        return {
            "ip": data.get("ip"),
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country"),
            "loc": data.get("loc"),
            "org": data.get("org"),
            "postal": data.get("postal"),
            "timezone": data.get("timezone"),
        }
    except ValueError as exc:
        raise HTTPException(
            status_code=502, detail="Invalid response from upstream service") from exc
