import json
import openai
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    openai_api_key: str

    class Config:
        env_file = ".env"

        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == 'origins_web':
                return raw_val.split(",")
            return json.loads(raw_val)


config = Config()

openai.api_key = config.openai_api_key
