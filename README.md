 Quote Generator App

A beautiful, production-ready, mobile-friendly full-stack web application built using Python (Flask), SQLite3, vanilla HTML5, CSS3, and modern JavaScript (Async/Fetch API). The application lets users register, login, generate random quotes dynamically, manage a personal favorites list, and maintain a historical log of generated quotes.

## 🚀 Features

- **Secure User Authentication**: Full Login and Sign-Up flows using encrypted password hashing (`werkzeug.security`).
- **Dynamic Quote Generation**: Fetches instant random quotes instantly from an asynchronous backend pool.
- **Interactive Favorites System**: Toggle quotes into your personal "Favourites" tab with real-time UI updates.
- **Comprehensive Quote History**: Automated local logging of generated quotes tracking precise timestamps down to the minute.
- **Granular Data Actions**: Delete specific cards via row-by-row trash triggers, or perform full wipes using "Clear All" features.
- **Interactive Logout Modal**: Double-confirmation layer preventing accidental logouts.
- **100% Mobile Responsive**: Fluid grid design shifting cleanly from large desktop setups down to mobile side-drawers using css media queries.
- **Zero Jinja Collisions**: Handled completely through standard JSON REST APIs to prevent rendering crashes or dynamic string formatting bugs.

---

## 📂 Project Directory Structure

Ensure your project environment is organized exactly as follows:

```text
quote_app/
│
├── database.db          # Created automatically by SQLite on application startup
├── app.py               # Main Flask Python application backend
│
├── templates/
│   └── index.html       # Single-page app architecture containing all system interfaces
│
└── static/
    ├── css/
    │   └── style.css    # Typography, animations, responsive grid design
    └── js/
        └── app.js       # Asynchronous Fetch API client handling view operations

🛠️ Installation & Setup Guide
Follow these simple steps to install dependencies and deploy the server locally:

1. Clone or Create Project Folder
Create a clean directory named quote_app and replicate the layout listed in the structure section above by copying the required code into each respective file.

2. Set Up a Virtual Environment (Optional but Recommended)
Navigate to your project directory inside your terminal and initialize an isolated workspace:

Bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
3. Install Required Dependencies
Install the Flask framework using pip:

Bash
pip install flask
(Note: SQLite3 comes standard with Python standard libraries, so no extra database downloads are needed!)

4. Initialize and Boot up the Server
Execute the main application controller module:

Bash
python app.py
5. Access the Platform
Once the terminal outputs an active connection string, open your favorite web browser and navigate to:

Plaintext
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)
⚙️ How the Application Works (API Layer)
The frontend coordinates user activity smoothly by processing actions through asynchronous fetch() operations directed at these secure REST endpoints:

POST /api/auth/register : Submits user email and securely hashes credentials to register a new user.

POST /api/auth/login : Validates login input against the database entries and provisions session parameters.

POST /api/auth/logout : Completely clears active session parameters.

POST /api/quotes/generate : Pulls a quote, records a timestamp, saves it to the SQLite timeline, and updates the screen.

POST /api/quotes/favourite/<id> : Flags is_favourite = 1 matching the specific unique identifier inside the database.

DELETE /api/quotes/delete/<id> : Dispatches a target request to wipe out a quote matching that ID.

DELETE /api/quotes/clear/<target> : Mass updates or deletes rows depending on whether you choose history or favourites.

📝 Modifying the Quote Collection
To add or customize your own selection of quotes, open app.py and modify the dictionary elements within the global QUOTE_POOL list:

Python
QUOTE_POOL = [
    {"quote": "Your custom motivational quote goes here.", "author": "Author Name"},
    {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
]
📄 License
This system is completely open-source and free to adapt for personal training, school prototypes, or commercial software engineering evaluations.

Author
Anusiya R
Full stack developer
        
