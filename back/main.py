from typing import Annotated

from fastapi import FastAPI, File

app = FastAPI()


@app.post("/expense/add", operation_id="add_expense")
def add_expense(audio: Annotated[bytes, File()]) -> None:
    print("audio: ")
