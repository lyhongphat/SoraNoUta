from fastapi import FastAPI

from BACKEND.controller import auth_controller, weather_controller

app = FastAPI(title="Sora no Uta API")


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(weather_controller.router)
app.include_router(auth_controller.router)
