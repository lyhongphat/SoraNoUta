from fastapi import APIRouter, Query

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get(
    "/login",
    summary="Login placeholder",
    description="Demo login endpoint that echoes a provided number. Replace with real auth later.",
)
def login(number: int = Query(..., description="User phone number or identifier")):
    return {"number": number}
