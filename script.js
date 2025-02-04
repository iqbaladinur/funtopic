let topics = [];

const card = document.getElementById("card");
const cardTitle = document.getElementById("card-title");
const cardDescription = document.getElementById("card-description");
const cardImg = document.getElementById("card-img");
const cardImgContainer = document.querySelector(".img-icon");

const swipeLeftBtn = document.getElementById("swipeLeft");
const swipeRightBtn = document.getElementById("swipeRight");

// Load topics from JSON file
fetch("topics.json")
  .then(response => response.json())
  .then(data => {
    topics = data.topics;
    // Display an initial topic if available
    const topic = getRandomTopic();
    if (topic) {
      displayTopic(topic);
    }
  })
  .catch(err => console.error("Error loading topics:", err));

// Helper function to generate a random hex color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Helper function that returns a random topic and removes it from the topics array
function getRandomTopic() {
  if (topics.length === 0) {
    alert("No topics left!");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics.splice(randomIndex, 1)[0];
}

function displayTopic(topic) {
  cardTitle.textContent = topic.title;
  cardDescription.textContent = topic.description;
  cardImg.src = topic.image;
  // Set cardImgContainer to a random background color
  cardImgContainer.style.backgroundColor = getRandomColor();
}

// Variables for swipe detection
let startX = 0;
let currentX = 0;
let isDragging = false;
const threshold = 100; // Minimum px to consider swipe

card.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
  isDragging = true;
  card.style.transition = "none";
});

card.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  currentX = e.clientX;
  const deltaX = currentX - startX;
  card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
});

card.addEventListener("pointerup", (e) => {
  isDragging = false;
  card.style.transition = "transform 0.3s ease";
  const deltaX = currentX - startX;
  if (Math.abs(deltaX) > threshold) {
    // Determine swipe direction
    swipeTopic(deltaX > 0 ? "right" : "left");
  } else {
    // Reset position if not swiped enough
    card.style.transform = "translateX(0) rotate(0)";
  }
});

card.addEventListener("pointercancel", () => {
  isDragging = false;
  card.style.transition = "transform 0.3s ease";
  card.style.transform = "translateX(0) rotate(0)";
});

// Optional button controls for swipe simulation
swipeLeftBtn.addEventListener("click", () => swipeTopic("left"));
swipeRightBtn.addEventListener("click", () => swipeTopic("right"));

function swipeTopic(direction) {
  // Animate card out of view
  const offScreenX = direction === "right" ? window.innerWidth : -window.innerWidth;
  card.style.transform = `translateX(${offScreenX}px) rotate(${direction === "right" ? 30 : -30}deg)`;
  card.style.opacity = 0;

  // Wait for animation then load the next random topic
  setTimeout(() => {
    const nextTopic = getRandomTopic();
    if (nextTopic) {
      displayTopic(nextTopic);
    }
    // Reset card position and opacity
    card.style.transition = "none";
    card.style.transform = "translateX(0) rotate(0)";
    card.style.opacity = 1;
  }, 300);
}
