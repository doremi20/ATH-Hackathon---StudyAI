# StudyAI 🎓

StudyAI is a modern, responsive web application designed to act as your personal AI Study Assistant. It helps students turn their academic problems into clear study plans, daily schedules, and actionable goals, all wrapped in a beautiful, sci-fi inspired **Red & White** theme.

## Features

- **Modern UI/UX**: A sleek red and white color scheme with glassmorphism effects and smooth hover micro-animations.
- **Sci-Fi Animations**: Dynamic geometric network backgrounds and floating particles on canvas.
- **Full Authentication Flow**: Completely functioning Sign Up and Login pages.
- **Dynamic Dashboard**: Generate study plans, track your progress, see daily schedules, and interact with a simulated AI chat interface.
- **Persistent Storage**: Data is saved seamlessly to your browser's LocalStorage.
- **Session Management**: Data is safely scoped to individual user accounts.

## Tech Stack

### Frontend
- HTML5
- CSS3 (Custom Variables, Flexbox, CSS Grid, Glassmorphism)
- Vanilla JavaScript (DOM Manipulation, Canvas Animations)
- LocalStorage API for persistent data and session management.

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
│   ├── script.js           # Dashboard logic and canvas animations
│   ├── login.js            # Login form validation and LocalStorage management
│   └── signup.js           # Signup form validation and LocalStorage management
│
├── index.html              # Main application dashboard (Root)
├── login.html              # Login page
├── signup.html             # Sign up page
└── README.md
```

## 🚀 Getting Started & Deployment

StudyAI is configured as a **purely static frontend application**. It runs directly in the browser and uses `localStorage` for all backend-like features (authentication, data saving), meaning there are absolutely zero servers or databases to configure!

### Running Locally
Simply open the `index.html` file in your preferred web browser to launch the dashboard.

### Deploying to Vercel (1-Click)
Because the app is 100% static HTML/CSS/JS with an `index.html` root file, deploying it is incredibly easy:

1. Push your `StudyAI` folder to a new GitHub repository.
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **Add New > Project**.
4. Import your GitHub repository.
5. Do not configure anything in the build settings (Vercel automatically detects static sites). Just click **Deploy**.

Within 30 seconds, your site will be live and fully functional on a `.vercel.app` domain!
