from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

app = Flask(__name__)
CORS(app)

# MongoDB connection (local)
client = MongoClient("mongodb://localhost:27017/")
db = client["hungerbridge"]
foods = db["foods"]

# ➤ Add Food
@app.route('/food', methods=['POST'])
def add_food():
    data = request.json

    food = {
        "title": data.get("title"),
        "quantity": data.get("quantity"),
        "location": data.get("location"),
        "status": "available",
        "createdAt": datetime.datetime.utcnow(),
        "expiryTime": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    foods.insert_one(food)
    return jsonify({"message": "Food Added"})

# ➤ Get Food
@app.route('/food', methods=['GET'])
def get_food():
    data = []
    for f in foods.find():
        f["_id"] = str(f["_id"])
        data.append(f)
    return jsonify(data)

# ➤ Claim Food
@app.route('/claim/<id>', methods=['POST'])
def claim_food(id):
    foods.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "claimed"}}
    )
    return jsonify({"message": "Claimed"})

# ➤ Deliver Food
@app.route('/deliver/<id>', methods=['POST'])
def deliver_food(id):
    foods.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "delivered"}}
    )
    return jsonify({"message": "Delivered"})

# ➤ Cleanup expired
@app.route('/cleanup', methods=['GET'])
def cleanup():
    now = datetime.datetime.utcnow()
    foods.delete_many({"expiryTime": {"$lt": now}})
    return jsonify({"message": "Expired removed"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
