import os
import sqlite3
import random
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'super_secret_quote_generator_key'
DATABASE = 'database.db'

# Predefined quote pool for generation
QUOTE_POOL = [
    {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"quote": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt"},
    {"quote": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
    {"quote": "Whoever is happy will make others happy too.", "author": "Anne Frank"},
    {"quote": "Try not to become a man of success, but rather try to become a man of value.", "author": "Albert Einstein"},
    {"quote": "Life is what happens when you're busy making other plans.", "author": "John Lennon"},
    {"quote": "The best way to predict the future is to create it.", "author": "Peter Drucker"},
]

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS operations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quote_text TEXT NOT NULL,
                author TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                is_favourite INTEGER DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()

@app.route('/')
def home():
    if 'user_id' in session:
        return render_template('index.html', logged_in=True, email=session.get('email'))
    return render_template('index.html', logged_in=False)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    hashed_pw = generate_password_hash(password)
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))
            conn.commit()
            session['user_id'] = cursor.lastrowid
            session['email'] = email
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Email already exists"}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        session['email'] = user['email']
        return jsonify({"success": True})

    return jsonify({"success": False, "message": "Invalid email or password"}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True})

@app.route('/api/quotes/generate', methods=['POST'])
def generate_quote():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    selected = random.choice(QUOTE_POOL)
    import datetime
    now = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO operations (user_id, quote_text, author, timestamp) VALUES (?, ?, ?, ?)",
            (session['user_id'], selected['quote'], selected['author'], now)
        )
        conn.commit()
        quote_id = cursor.lastrowid

    return jsonify({
        "success": True,
        "id": quote_id,
        "quote": selected['quote'],
        "author": selected['author'],
        "timestamp": now,
        "is_favourite": 0
    })

@app.route('/api/quotes/favourite/<int:quote_id>', methods=['POST'])
def toggle_favourite(quote_id):
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    with get_db() as conn:
        conn.execute(
            "UPDATE operations SET is_favourite = 1 WHERE id = ? AND user_id = ?",
            (quote_id, session['user_id'])
        )
        conn.commit()
    return jsonify({"success": True})

@app.route('/api/data/dashboard', methods=['GET'])
def get_dashboard_data():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = session['user_id']
    with get_db() as conn:
        total_quotes = conn.execute("SELECT COUNT(*) FROM operations WHERE user_id = ?", (user_id,)).fetchone()[0]
        total_favs = conn.execute("SELECT COUNT(*) FROM operations WHERE user_id = ? AND is_favourite = 1", (user_id,)).fetchone()[0]
        last_item = conn.execute("SELECT timestamp FROM operations WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
        recent_history = conn.execute("SELECT * FROM operations WHERE user_id = ? ORDER BY id DESC LIMIT 4", (user_id,)).fetchall()

    history_list = [dict(row) for row in recent_history]
    last_updated = last_item['timestamp'].split(',')[0] if last_item else "N/A"

    return jsonify({
        "total_quotes": total_quotes,
        "quotes_saved": total_favs,
        "last_updated": last_updated,
        "recent_history": history_list
    })

@app.route('/api/data/history', methods=['GET'])
def get_all_history():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    with get_db() as conn:
        rows = conn.execute("SELECT * FROM operations WHERE user_id = ? ORDER BY id DESC", (session['user_id'],)).fetchall()
    return jsonify([dict(row) for row in rows])

@app.route('/api/data/favourites', methods=['GET'])
def get_favourites():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    with get_db() as conn:
        rows = conn.execute("SELECT * FROM operations WHERE user_id = ? AND is_favourite = 1 ORDER BY id DESC", (session['user_id'],)).fetchall()
    return jsonify([dict(row) for row in rows])

@app.route('/api/quotes/delete/<int:quote_id>', methods=['DELETE'])
def delete_quote(quote_id):
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    with get_db() as conn:
        conn.execute("DELETE FROM operations WHERE id = ? AND user_id = ?", (quote_id, session['user_id']))
        conn.commit()
    return jsonify({"success": True})

@app.route('/api/quotes/clear/<string:target>', methods=['DELETE'])
def clear_quotes(target):
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = session['user_id']
    with get_db() as conn:
        if target == 'favourites':
            conn.execute("UPDATE operations SET is_favourite = 0 WHERE user_id = ?", (user_id,))
        else:
            conn.execute("DELETE FROM operations WHERE user_id = ?", (user_id,))
        conn.commit()
    return jsonify({"success": True})

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    app.run(debug=True, port=5000)