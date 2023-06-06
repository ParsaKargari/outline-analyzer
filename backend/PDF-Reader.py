import os
import json
from typing import List
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import openai

# Loading environment variables from .env file
load_dotenv()

# OpenAI API Key setup
API_KEY = os.getenv("OPENAI_API_KEY")  # Your API Key here
openai.api_key = API_KEY

thread_executor = ThreadPoolExecutor(max_workers=4)

# Flask web service
web_service = Flask(__name__)
CORS(web_service)

def break_text(input_text: str) -> List[str]:
    sentence_list = input_text.split(". ")
    num_sentences = 50

    segments = [
        ". ".join(sentence_list[i: i + num_sentences]) + ". "
        for i in range(0, len(sentence_list), num_sentences)
    ]
    return segments

def fetch_deadlines(input_text):
    print(f"\nRequesting OpenAI API: \n{input_text[:100]}...\n")

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """
You are an AI model programmed to find deadlines from text.
The source text is taken from a PDF, so common sense may be required to correct potential errors.""",
            },
            {
                "role": "user",
                "content": """Find the deadlines from the next text:
All tasks are worth 10 percent of your final grade
Task 2 due on 2020-10-30 at 11:59pm and late submissions
will receive a full letter grade penalty""",
            },
            {
                "role": "assistant",
                "content": json.dumps(
                    [
                        {
                            "name": "Task 2",
                            "date": "2020-10-30T23:59:00.000Z",
                            "weight": 10,
                        }
                    ]
                ),
            },
            {
                "role": "user",
                "content": """
Find deadlines from the next text.
Your response should be in the next format:
{
    name: string;
    date: Date;
    weight?: number;
}[]
If there's no deadlines, respond '[]'.
Text:
"""
                + input_text,
            },
        ],
    )

    if completion.choices[0].finish_reason != "stop":
        print("OpenAI API did not finish processing")
        print(completion)
        return []
    try:
        deadlines = json.loads(completion.choices[0].message.content)
    except json.JSONDecodeError:
        print(f"Unexpected API response: {completion}")
        deadlines = []
    return deadlines

def fetch_deadlines_from_pdf(input_pdf):
    full_text = ""
    for page in input_pdf.pages:
        full_text += page.extract_text()
    print("Text extracted from PDF")

    segments = break_text(full_text)

    thread_tasks = [thread_executor.submit(fetch_deadlines, segment) for segment in segments]

    deadlines = []
    for task in thread_tasks:
        deadlines += task.result()

    print(json.dumps(deadlines, indent=4))
    return deadlines

@web_service.route('/upload', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return 'No file uploaded', 400

    uploaded_file = request.files['file']
    input_pdf = PdfReader(uploaded_file)

    deadlines = fetch_deadlines_from_pdf(input_pdf)

    return {
        "Deadlines": deadlines,
    }

if __name__ == '__main__':
    web_service.run()
