# HungerBridge
# 🍛 HungerBridge

## 🚀 Real-Time Food Rescue System

HungerBridge is a web-based platform that connects food donors, NGOs, and volunteers to reduce food waste and help needy people. It ensures that surplus food is distributed quickly before it expires.

---

## 📌 Problem

Every day, a large amount of food is wasted in restaurants, weddings, and hostels, while many people go hungry. There is no real-time system to connect food donors with people who need it.

---

## 💡 Solution

HungerBridge provides a platform where:

* 🍛 Donors can post available surplus food
* 🤝 NGOs can view and claim food
* 🚚 Volunteers can deliver food

All actions happen quickly to prevent food waste.

---

## 🎯 Features

* ✅ Role-based system (Donor, NGO, Volunteer)
* ✅ Post food with details (name, quantity, location)
* ✅ Food quality selection (Good, Better, Best, Excellent)
* ✅ View available food in real-time
* ✅ Claim food (NGO)
* ✅ Deliver food (Volunteer)
* ✅ Status tracking (Available → Claimed → Delivered)
* ✅ Clean and modern UI (Dark theme)

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (Fetch API)

### Backend

* Python (Flask)
* Flask-CORS

### Database

* SQLite (No setup required)

---

## 📂 Project Structure

```
HungerBridge/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── donor.html
│   ├── ngo.html
│   ├── volunteer.html
│   ├── style.css
```

---

## ⚙️ How to Run the Project

### 1️⃣ Install Dependencies

```
pip install flask flask-cors
```

---

### 2️⃣ Run Backend

```
cd backend
python app.py
```

Backend will run at:

```
http://127.0.0.1:5000
```

---

### 3️⃣ Run Frontend

Open a new terminal:

```
cd frontend
python -m http.server 5500
```

---

### 4️⃣ Open in Browser

```
http://127.0.0.1:5500
```

---

## 🔄 Application Flow

1. User selects role (Donor / NGO / Volunteer)
2. Donor posts food
3. NGO views and claims food
4. Volunteer delivers food
5. Status updates to Delivered

---

## 📡 API Endpoints

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | /             | Test server  |
| POST   | /food         | Add food     |
| GET    | /food         | Get all food |
| POST   | /claim/<id>   | Claim food   |
| POST   | /deliver/<id> | Deliver food |

---

## 🗄️ Database

* SQLite database (`hungerbridge.db`)
* Automatically created when backend runs
* Stores food data and status

---

## 🌍 Impact

* Reduces food wastage
* Helps needy people
* Saves resources
* Supports community welfare

---

## 🔮 Future Enhancements

* 📍 Google Maps integration
* ⏳ Countdown timer for expiry
* 📊 Dashboard (meals saved)
* 🔔 Notifications system
* 📱 Mobile app version

---

## 👨‍💻 Developed By

* Anshu Selwatkar
* Shreya Gedam
* Arnik Waghmare
* Divyansh Khobragade

---

## ❤️ Conclusion

HungerBridge is a simple yet powerful solution to connect surplus food with people in need.

**“Saving food is saving lives.”**
