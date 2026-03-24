function getFood() {
  return JSON.parse(localStorage.getItem("foodData")) || [];
}

function saveFood(data) {
  localStorage.setItem("foodData", JSON.stringify(data));
}

// ➤ Add Food
function addFood(title, quantity, location) {
  let data = getFood();

  data.push({
    id: Date.now(),
    title,
    quantity,
    location,
    status: "available"
  });

  saveFood(data);
}

// ➤ Claim Food
function claimFood(id) {
  let data = getFood();

  data = data.map(f => {
    if(f.id == id) f.status = "claimed";
    return f;
  });

  saveFood(data);
}

// ➤ Deliver Food
function deliverFood(id) {
  let data = getFood();

  data = data.map(f => {
    if(f.id == id) f.status = "delivered";
    return f;
  });

  saveFood(data);
}