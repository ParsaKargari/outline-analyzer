# Course Outline Analyzer

## Introduction

The Course Outline Analyzer is a web application that allows users to upload course outlines and analyze the assignment, midterm, and exam deadlines. It leverages OpenAI integration for advanced analysis and provides users with a visual representation of the deadlines.

## Project Structure

The project consists of two main components:

1. Frontend: This directory contains the React.js frontend of the application.
2. Backend: This directory contains the Python backend server built with Flask and integrates with OpenAI for analysis.

## Demo

[![Course Outline Analyzer Demo](https://img.youtube.com/vi/creeqhqo5iI/maxresdefault.jpg)](https://www.youtube.com/watch?v=creeqhqo5iI)


## Getting Started

To get started with the Course Outline Analyzer, follow these steps:

1. Clone the repository: `git clone <link>`
2. Navigate to the backend directory: `cd backend`
3. Activate the Python virtual environment: `source venv/bin/activate` (Unix/Linux) or `venv\Scripts\activate` (Windows)
4. Install the Python dependencies: `pip install -r requirements.txt`
5. Start the Python backend server: `python PDF-Reader.py`
6. Open a separate terminal or command prompt.
7. Navigate to the frontend directory: `cd frontend`
8. Install the frontend dependencies: `npm install`
9. Start the development server for the frontend: `npm start`

The Course Outline Analyzer backend server should now be running on `http://localhost:5000`, and the frontend development server should be running on `http://localhost:3000`. You can access the application by opening `http://localhost:3000` in your web browser.

Make sure to include your OpenAI API key in the `backend/.env` file. Example: OPENAI_API_KEY=(Your API key)
You can obtain an API key from the [OpenAI website](https://beta.openai.com/).

## Future Goals

- Improve UI/UX design for a more visually appealing and user-friendly experience.
- Enhance the analysis algorithm to extract additional information from course outlines, such as assignments, projects, and resources.
- Optimize the application to handle a wide variety of course outline formats and reduce the chance of bugs during analysis.
- Implement a database system to store and manage course outlines and associated data.
- Add the ability to export all deadlines in a calendar format for easy integration with popular calendar applications.

These are just a few of the future goals and enhancements planned for the Course Outline Analyzer. Feel free to contribute ideas and suggestions to make it even better!


## Authors

- ParsaKargari (GitHub: [ParsaKargari](https://github.com/ParsaKargari))

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

This project was inspired by the idea of analyzing course outlines to extract deadlines and provide users with a comprehensive view of their course workload.
