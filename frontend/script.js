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

<script>
function postFood() {

  let quality = document.getElementById("quality").value;

  fetch("http://127.0.0.1:5000/food", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      title: document.getElementById("title").value,
      quantity: document.getElementById("quantity").value,
      location: document.getElementById("location").value,
      quality: quality
    })
  })
  .then(() => alert("Posted"))
  .catch(err => console.log(err));
}
</script>
