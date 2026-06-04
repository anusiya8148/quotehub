# ☕ The Great Coffee Rating App

The Great Coffee Rating App is a premium, specialized web application built to catalog, vote on, and rank artisan coffee blends. Combining a sleek dark-and-cream aesthetic tailored for coffee aficionados with robust backend metric tracking, the platform offers real-time leaderboard calculations and secure session-based operations.

---

## ✨ Key Features

* **Premium UI/UX:** Styled with custom palettes, background blurs, and organic border radiuses to mirror a high-end specialty café interface.
* **Granular Session Security:** Secure onboarding and gatekeeping handled via cryptographic password hashing (`scrypt`) and encrypted client-side cookies.
* **Instant Dynamic Voting:** Single-action HTTP POST tracking that updates relational counts seamlessly across client views.
* **Error-Free Custom Metrics:** Employs advanced CSS Custom Properties (`--bar-width`) to securely inject server-side template computations without triggering local editor syntax linting errors.
* **Fuzzy Search Integration:** Built-in SQL wildcard filtering to instantly isolate specific beans or beverage styles.
* **Stateful Profile CRUD:** Provides end-to-end relational data modification parameters allowing users to update core metadata securely.

---

## 📂 Project Architecture

Organize your local directory frame according to the following layout topology:

```text
coffee_rating_app/
│
├── app.py                  # Main monolithic server script, entry point, & DB hooks
├── database.db             # Relational SQLite file (Instantiated automatically)
├── README.md               # Infrastructure documentation
├── static/
│   └── css/
│       └── style.css       # Global design token matrix & responsive framework
└── templates/
    ├── base.html           # Document boilerplate, global flash notification loop
    ├── landing.html        # Public-facing conversion and product hero display
    ├── login.html          # Authentication ingress panel
    ├── register.html       # Identity provisioning panel
    ├── dashboard_layout.html# Structural frame containing side-dock layouts
    ├── dashboard.html      # Relational entity grid with operational vote actions
    ├── toprated.html       # Error-free leaderboards with responsive relative gauges
    ├── about.html          # Immutable system stack description
    └── profile.html        # Relational update gateway for user settings

    🛠️ Environment Setup & Deployment
Follow these sequential steps to establish your environment dependencies and spin up the local server context.

Prerequisites
Python: Version 3.11 or later installed. Verify installation using:

Bash
  python --version
(Ensure you check "Add Python to PATH" during setup on Windows platforms).

Step 1: Install Dependencies
Open your operational Terminal or Command Prompt (CMD) in the root directory housing your files, and execute the runtime installer wrapper:

Bash
pip install Flask
Step 2: Initialize Database & Run Server
Run the primary application script. The relational schemas and pre-seeded sample data entries will generate automatically upon boot if no database is found:

Bash
python app.py
Upon successful deployment, your terminal output will report the active listener loops:

Plaintext
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on [http://127.0.0.1:5000](http://127.0.0.1:5000)
Step 3: Accessing the App
Open any modern web browser instance and interface with the target loopback adapter address:

Plaintext
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)


Author
Anusiya R
Full stack developer
