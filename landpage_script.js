window.addEventListener("scroll", () => {
  const bottomHalf = document.getElementById("bottomHalf");
  const rect = bottomHalf.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    bottomHalf.style.visibility = "visible";
    bottomHalf.style.opacity = "1";
  }
});

function triggerRippleBurstAndWelcome() {
  const ripple = document.getElementById("ripple");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const capsuleLeft = document.getElementById("capsuleLeft");
  const capsuleRight = document.getElementById("capsuleRight");
  const capsuleText = document.getElementById("capsuleText");

  ripple.style.display = "block";
  gsap.to(ripple, {
    width: "1000px",
    height: "1000px",
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    onComplete: () => (ripple.style.display = "none"),
  });

  capsuleLeft.style.transform = "translateX(-150%) rotate(-30deg)";
  capsuleRight.style.transform = "translateX(150%) rotate(30deg)";
  capsuleLeft.style.opacity = "0";
  capsuleRight.style.opacity = "0";

  setTimeout(() => {
    welcomeMessage.style.display = "block";
    setTimeout(() => {
      window.location.href = "user_log.html";
    }, 1500);
  }, 1000);

  // Make the "Let's Get Started" text disappear when clicked
  capsuleText.style.display = "none";
}

function addRainElement() {
  const item = document.createElement("div");
  item.className = "rainItem";
  item.style.left = `${Math.random() * 100}%`;
  item.style.top = "-20px";
  document.body.appendChild(item);

  const duration = Math.random() * 3 + 2;
  gsap.to(item, {
    y: window.innerHeight * 2,
    opacity: 0.8,
    duration: duration,
    ease: "linear",
    onComplete: () => item.remove(),
  });
}

setInterval(addRainElement, 100);

document
  .getElementById("capsuleContainer")
  .addEventListener("click", triggerRippleBurstAndWelcome);

// New code to integrate backend
fetch("http://localhost:5000/track-visit", {
  method: "GET", // Assuming it's a GET request
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Visit Count:", data.count); // Log visit count for debugging
  })
  .catch((error) => console.error("Error:", error));
