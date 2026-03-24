from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

# -------------------------------
# DATABASE CONNECTION
# -------------------------------
def get_db():
    return sqlite3.connect("hungerbridge.db")


# -------------------------------
# CREATE TABLE (RUNS AUTOMATICALLY)
# -------------------------------
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        quantity TEXT,
        location TEXT,
        status TEXT,
        expiry TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()


# -------------------------------
# HOME ROUTE (TEST)
# -------------------------------
@app.route('/')
def home():
    return "HungerBridge Backend Running 🚀"


# -------------------------------
# ADD FOOD (DONOR)
# -------------------------------
@app.route('/food', methods=['POST'])
def add_food():
    data = request.json

    expiry_time = (datetime.datetime.now() + datetime.timedelta(hours=2)).isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO food (title, quantity, location, status, expiry)
    VALUES (?, ?, ?, ?, ?)
    """, (
        data['title'],
        data['quantity'],
        data['location'],
        "available",
        expiry_time
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Added Successfully"})


# -------------------------------
# GET ALL FOOD (NGO + VOLUNTEER)
# -------------------------------
@app.route('/food', methods=['GET'])
def get_food():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM food")
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "title": row[1],
            "quantity": row[2],
            "location": row[3],
            "status": row[4],
            "expiry": row[5]
        })

    conn.close()
    return jsonify(result)


# -------------------------------
# CLAIM FOOD (NGO)
# -------------------------------
@app.route('/claim/<int:id>', methods=['POST'])
def claim_food(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE food SET status = 'claimed' WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Claimed"})


# -------------------------------
# DELIVER FOOD (VOLUNTEER)
# -------------------------------
@app.route('/deliver/<int:id>', methods=['POST'])
def deliver_food(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE food SET status = 'delivered' WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Delivered"})


# -------------------------------
# DELETE EXPIRED FOOD (OPTIONAL)
# -------------------------------
@app.route('/cleanup', methods=['GET'])
def cleanup():
    now = datetime.datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM food WHERE expiry < ?",
        (now,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Expired food removed"})


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

# -------------------------------
# DATABASE CONNECTION
# -------------------------------
def get_db():
    return sqlite3.connect("hungerbridge.db")


# -------------------------------
# CREATE TABLE (RUNS AUTOMATICALLY)
# -------------------------------
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        quantity TEXT,
        location TEXT,
        status TEXT,
        expiry TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()


# -------------------------------
# HOME ROUTE (TEST)
# -------------------------------
@app.route('/')
def home():
    return "HungerBridge Backend Running 🚀"


# -------------------------------
# ADD FOOD (DONOR)
# -------------------------------
@app.route('/food', methods=['POST'])
def add_food():
    data = request.json

    expiry_time = (datetime.datetime.now() + datetime.timedelta(hours=2)).isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO food (title, quantity, location, status, expiry)
    VALUES (?, ?, ?, ?, ?)
    """, (
        data['title'],
        data['quantity'],
        data['location'],
        "available",
        expiry_time
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Added Successfully"})


# -------------------------------
# GET ALL FOOD (NGO + VOLUNTEER)
# -------------------------------
@app.route('/food', methods=['GET'])
def get_food():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM food")
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "title": row[1],
            "quantity": row[2],
            "location": row[3],
            "status": row[4],
            "expiry": row[5]
        })

    conn.close()
    return jsonify(result)


# -------------------------------
# CLAIM FOOD (NGO)
# -------------------------------
@app.route('/claim/<int:id>', methods=['POST'])
def claim_food(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE food SET status = 'claimed' WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Claimed"})


# -------------------------------
# DELIVER FOOD (VOLUNTEER)
# -------------------------------
@app.route('/deliver/<int:id>', methods=['POST'])
def deliver_food(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE food SET status = 'delivered' WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Food Delivered"})


# -------------------------------
# DELETE EXPIRED FOOD (OPTIONAL)
# -------------------------------
@app.route('/cleanup', methods=['GET'])
def cleanup():
    now = datetime.datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM food WHERE expiry < ?",
        (now,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Expired food removed"})


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
