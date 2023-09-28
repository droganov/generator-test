from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import whisper
from io import BytesIO
import soundfile as sf
import numpy as np
from pydub import AudioSegment

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model...")
model = whisper.load_model("large")
print("Model loaded.")


@app.post("/expense/add", operation_id="add_expense")
def add_expense(audio: Annotated[UploadFile, File()]) -> str:
    print("Transcribing...")
    try:
        buffer = BytesIO(audio.file.read())
        buffer.seek(0)
        format = audio.content_type.split('/')[1]
        print(format)
        audio_segment = AudioSegment.from_file(buffer, format=format)
        samples = np.array(audio_segment.get_array_of_samples())
        result = model.transcribe(audio=audio_segment)
    except Exception as e:
        print(e)
        return "Error"
    print("Transcription complete.")
    print(result)
    return result
