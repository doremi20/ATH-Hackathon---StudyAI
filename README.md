# StudyAI

StudyAI is a modern, responsive web application designed to act as your personal AI Study Assistant. It helps students turn their academic problems into clear study plans, daily schedules, and actionable goals, all wrapped in a beautiful, sci-fi inspired **Red & White** theme.

## Features

- **Modern UI/UX**: A sleek red and white color scheme with glassmorphism effects and smooth hover micro-animations.
- **Sci-Fi Animations**: Dynamic geometric network backgrounds and floating particles on canvas.
- **Full Authentication Flow**: Completely functioning Sign Up and Login pages.
- **Dynamic Dashboard**: Generate study plans, track your progress, see daily schedules, and interact with a simulated AI chat interface.
- **Persistent Storage**: Data is saved to a permanent SQLite database using a Python/Flask backend, with local browser storage as a fallback.
- **Session Management**: Data is safely scoped to individual user accounts.

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom Variables, Flexbox, CSS Grid, Glassmorphism)
- Vanilla JavaScript (DOM Manipulation, Canvas Animations, Fetch API)

### Backend
- **Language**: Python 3
- **Framework**: Flask
- **Database**: SQLite (via Flask-SQLAlchemy)
- **CORS**: Flask-CORS for seamless local frontend-backend communication.

## Project Structure

```text
StudyAI/
│
├── css/
│   ├── style.css           # Global styles and dashboard theme
│   └── login.css           # Specific styles for the login/signup flow
│
├── images/
│   └── scifi_bg.png        # Animated sci-fi background image
│
├── js/
│   ├── script.js           # Dashboard logic, canvas animations, API calls
│   ├── login.js            # Login form validation and backend communication
│   └── signup.js           # Signup form validation and backend communication
│
├── app.py                  # Main Python backend server (Flask)
├── dashboard.html          # Main application dashboard
├── login.html              # Login page
├── signup.html             # Sign up page
└── requirements.txt        # Python backend dependencies
```

## Getting Started

To run StudyAI locally with its full database functionality, follow these steps:

### Prerequisites
Make sure you have [Python 3.x](https://www.python.org/downloads/) installed on your machine.

### 1. Start the Backend Server

1. Open a terminal or command prompt in the `StudyAI` folder.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   *The server will start running on `http://127.0.0.1:5000` and will automatically create the `studyai.db` database file.*

### 2. Launch the Frontend

With the backend server running in the background, simply open the `login.html` or `signup.html` file in your preferred web browser. 

1. Create a new account on the Sign Up page.
2. Log in with your new credentials.
3. Start generating study plans on your Dashboard!

---

*Note: If the Python server is not running, the application will gracefully fall back to using your browser's local storage to save your session.*
