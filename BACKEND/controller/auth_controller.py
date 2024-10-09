from main import app


@app.get("auth/login")
def login(number):
    return {"number": number}
