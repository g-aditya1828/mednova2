// Music Player Functionality
const playButtons = document.querySelectorAll(".play-btn");
const mainPlayButton = document.querySelector(".main-play-btn");
const mainProgress = document.querySelector(".music-player .progress");
let isPlaying = false;
let currentTrack = null;
let mainPlayerPlaying = false;

// Theme of the website
const toggleBtn = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  }
});

// Main player controls
mainPlayButton.addEventListener("click", () => {
  mainPlayerPlaying = !mainPlayerPlaying;
  mainPlayButton.textContent = mainPlayerPlaying ? "⏸" : "▶";

  if (mainPlayerPlaying) {
    // Stop any playing track in the library
    if (currentTrack) {
      currentTrack.textContent = "▶";
      currentTrack = null;
      isPlaying = false;
    }
    simulateMainProgress();
  }
});

function simulateMainProgress() {
  if (!mainPlayerPlaying) {
    mainProgress.style.width = "30%";
    return;
  }

  let width = parseInt(mainProgress.style.width) || 30;
  if (width < 100) {
    width += 1;
    mainProgress.style.width = `${width}%`;
    setTimeout(simulateMainProgress, 1000);
  } else {
    mainProgress.style.width = "30%";
    mainPlayerPlaying = false;
    mainPlayButton.textContent = "▶";
  }
}

// Library track controls
let currentAudio = null;
playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const trackId = button.getAttribute("data-track");
    const audio = document.getElementById(`audio-${trackId}`);
    const wasPlaying = currentTrack === button;

    // Stop main player if active
    if (mainPlayerPlaying) {
      mainPlayerPlaying = false;
      mainPlayButton.textContent = "▶";
      mainProgress.style.width = "30%";
    }

    // Stop all other buttons and audios
    playButtons.forEach((btn) => (btn.textContent = "▶"));
    document.querySelectorAll("audio").forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });

    if (wasPlaying && currentAudio) {
      // User clicked same track again — stop it
      currentTrack = null;
      currentAudio = null;
      isPlaying = false;
      mainProgress.style.width = "30%";
      return;
    }

    // Play new track
    button.textContent = "⏸";
    currentTrack = button;
    currentAudio = audio;
    isPlaying = true;

    audio.play();
    mainProgress.style.width = "0%";
    updateAudioProgress(audio);
  });
});

function simulateProgress() {
  if (!isPlaying) return;

  let width = parseInt(mainProgress.style.width);
  if (width < 100) {
    width += 1;
    mainProgress.style.width = `${width}%`;
    setTimeout(simulateProgress, 1000);
  } else {
    mainProgress.style.width = "30%";
    if (currentTrack) {
      currentTrack.textContent = "▶";
    }
    isPlaying = false;
    currentTrack = null;
  }
}

function updateAudioProgress(audio) {
  const interval = setInterval(() => {
    if (!isPlaying || audio.ended) {
      clearInterval(interval);
      mainProgress.style.width = "30%";
      currentTrack.textContent = "▶";
      isPlaying = false;
      currentTrack = null;
      return;
    }
    const percent = (audio.currentTime / audio.duration) * 100;
    mainProgress.style.width = `${percent}%`;
  }, 500);
}

// Activity Chart
const ctx = document.getElementById("activityChart").getContext("2d");
const activityChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Steps",
        data: [7500, 8200, 7800, 6500, 9200, 8500, 8000],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Sleep",
        data: [7.5, 7.2, 6.8, 7.1, 7.8, 8.2, 7.9],
        borderColor: "#6FCF97",
        backgroundColor: "rgba(111, 207, 151, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "sleep",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10000,
        title: {
          display: true,
          text: "Steps",
        },
      },
      sleep: {
        position: "right",
        beginAtZero: true,
        max: 12,
        title: {
          display: true,
          text: "Sleep (hours)",
        },
      },
    },
  },
});

// Meditation Cards Interaction
const meditationCards = document.querySelectorAll(".meditation-card");

meditationCards.forEach((card) => {
  card.addEventListener("click", () => {
    meditationCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
  });
});

// Chat Functionality
async function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messageHTML = `
            <div class="message">
                <div class="time">${time}</div>
                <p>${message}</p>
            </div>
        `;
    chatBox.insertAdjacentHTML("beforeend", messageHTML);
    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🧠 OpenAI API call to get assistant response
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant focused on mental health and general wellness.",
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't understand that.";

      const responseHTML = `
                <div class="message assistant">
                    <div class="time">${new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</div>
                    <p>${reply}</p>
                </div>
            `;
      chatBox.insertAdjacentHTML("beforeend", responseHTML);
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error("OpenAI error:", error);
      const responseHTML = `
                <div class="message assistant">
                    <div class="time">${new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</div>
                    <p>Oops! Something went wrong. Please try again later.</p>
                </div>
            `;
      chatBox.insertAdjacentHTML("beforeend", responseHTML);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
}

<<<<<<< HEAD
//calendar and streak
const calendarGrid = document.getElementById("calendar-days");
const currentStreakEl = document.getElementById("current-streak");
const longestStreakEl = document.getElementById("longest-streak");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();

let streak = 0;
let longestStreak = 0;

for (let day = 1; day <= daysInMonth; day++) {
  const dayBox = document.createElement("div");
  dayBox.classList.add("day-box");
  dayBox.innerText = day;
  dayBox.addEventListener("click", () => {
    dayBox.classList.toggle("completed");
    updateStreak();
  });
  calendarGrid.appendChild(dayBox);
}

function updateStreak() {
  const completedDays = document.querySelectorAll(".day-box.completed");
  streak = completedDays.length;
  longestStreak = Math.max(longestStreak, streak);
  currentStreakEl.textContent = streak;
  longestStreakEl.textContent = longestStreak;
}
// cursor effect
function createWave(x, y) {
  const waveCount = 5; // Reduced number of waves for subtle effect

  for (let i = 0; i < waveCount; i++) {
    const wave = document.createElement("div");
    wave.classList.add("wave");

    // Randomly set the direction of the wave
    const angle = Math.random() * 360; // Random angle for wave direction
    const distance = Math.random() * 40 + 20; // Small distance for subtle movement
    const radian = (angle * Math.PI) / 180;
    const xMovement = Math.cos(radian) * distance;
    const yMovement = Math.sin(radian) * distance;

    // Set custom properties to control movement direction
    wave.style.setProperty("--x", `${xMovement}px`);
    wave.style.setProperty("--y", `${yMovement}px`);

    wave.style.left = `${x - 10}px`; // Offset the wave position to cursor
    wave.style.top = `${y - 10}px`; // Offset the wave position to cursor

    document.body.appendChild(wave);

    // Remove the wave after animation completes
    setTimeout(() => {
      wave.remove();
    }, 2000); // Duration of the wave animation
  }
}

// Listen for mouse movement to create subtle waves
document.addEventListener("mousemove", (e) => {
  createWave(e.pageX, e.pageY);
});

// View Profile Button functionality
document.getElementById("profileBtn").addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    window.location.href = "profile.html";
  } else {
    alert("Please log in to view your profile.");
  }
});
=======

>>>>>>> f640ca8ccd044ddf4019d3e6bcf401f2ce3b2a95
