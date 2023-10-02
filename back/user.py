from fastapi import APIRouter

router = APIRouter()


@router.get("/list", operation_id="fetch_users")
def list_users() -> list:
    print("list_users")
    return []
