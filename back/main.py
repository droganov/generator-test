from typing import Annotated
from fastapi import FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
# from user import router as user_router
import whisper
import uuid
import os
import json
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import AIMessage, HumanMessage, SystemMessage, BaseOutputParser
from config import config
from datetime import datetime
from pydantic import BaseModel

# model = whisper.load_model("base")
model = whisper.load_model("medium")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExpenseCategory(BaseModel):
    name: str
    slug: str


class Expense(BaseModel):
    amount: float
    currencyCode: str
    category: ExpenseCategory
    time: str
    title: str


class JSONParser(BaseOutputParser):
    def parse(self, text: str):
        print("respone")
        print(text)
        return json.loads(text.strip())


@app.post(
    "/expense/add",
    operation_id="add_expense"
)
def add_expense(audio: Annotated[bytes, File()]) -> list[Expense]:
    file = f"uploads/audio_{uuid.uuid4().hex}.mp3"
    with open(file, "wb") as f:
        f.write(audio)
    currentDateTime = datetime.now()
    result = model.transcribe(file, fp16=False)
    os.remove(file)
    text = result["text"]

    print(text)
    print(result['language'])
    print(currentDateTime)

    chat_prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content="""Create a JSON array of expences.
            Categories:
                rent, utilities, groceries, transportation, health, connectivity
                cafes-and-restaurants, shopping-and-goods, entertainment, travel, hobbies
                gym-membership, beauty-and-hygiene, insurance, education
                emergency-fund, retirement-fund, investments
                credit-card, loans, mortgage
                gifts-and-donations, pets, taxes, fees, subscriptions, vices-and-bad-habbits, other
                
                JSON myst be:
                [{
                    amount: number,
                    currencyCode: string (ISO 4217),
                    category: {
                        name: string (human-friendly slug name in user language),
                        slug: string (one of the above)
                    },
                    time: string (ISO 8601),
                    title: string (item name in user language)
                }]
                
                Make sure you determine correct category and currency code for every item.
                Title must be a product or service name.
                """),
        HumanMessage(content="""купил капучино 240 динар и оставил 60 динар чаевых.
                Current time: 2021-09-11T12:00:00+02:00
                Default currency: RSD"""),
        AIMessage(content=json.dumps([
            {
                "amount": 240,
                "currencyCode": "RSD",
                "category": {
                    "name": "Кафе и рестораны",
                    "slug": "cafes-and-restaurants"
                },
                "time": "2021-09-11T12:00:00+02:00",
                "title": "Капучино",
            },
            {
                "amount": 60,
                "currencyCode": "RSD",
                "category": {
                    "name": "Кафе и рестораны",
                    "slug": "cafes-and-restaurants"
                },
                "time": "2021-09-11T12:00:00+02:00",
                "title": "Чаевые",
            }
        ])),
        HumanMessage(content="""Визит к стоматологу 5000 евро вчера в 12:30
                Current time: 2023-09-11T12:33:20+02:00
                Default currency: RSD"""),
        AIMessage(content=json.dumps([{
            "amount": 5000,
            "currencyCode": "EUR",
            "category": {
                "name": "Здоровье",
                "slug": "health"
            },
            "time": "2023-09-10T12:30:00+02:00",
            "title": "Визит к стоматологу",
        }])),
        HumanMessage(content=f"""{text}
            Current time: {datetime.now()}
            Default currency: RSD""")
    ])

    chain = chat_prompt | ChatOpenAI(openai_api_key=config.openai_api_key, model="gpt-4")
    # input = HumanMessage(content=f"""{text}
    #         Current time: {datetime.now()}
    #         Default currency: RSD""")
    result = chain.invoke(input={})

    print(result)

    return json.loads(result.content)


# @app.get("/expense/list", operation_id="fetch_expenses")
# def list_expenses() -> list:
#     print("list_expenses")
#     return []


# @app.get("/expense/list_all", operation_id="fetch_expenses")
# def list_all_expenses() -> list:
#     print("list_all_expenses")
#     return []


# app.include_router(user_router, prefix="/user")
