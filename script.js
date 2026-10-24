const slider = document.getElementById("currentSlider");

const currentValue = document.getElementById("currentValue");
const angleValue = document.getElementById("angleValue");
const fieldValue = document.getElementById("fieldValue");
const sliderValue = document.getElementById("sliderValue");

const movingSystem = document.getElementById("movingSystem");
const scaleMarks = document.getElementById("scaleMarks");
const workingText = document.getElementById("workingText");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

let instrumentOn = false;
let targetAngle = 0;
let displayedAngle = 0;

const MAX_CURRENT = 5;
const MAX_ANGLE = 70;

// Create instrument scale markings
function createScale() {
    scaleMarks.innerHTML = "";

    for (let i = 0; i <= 10; i++) {
        const angle = -70 + i * 14;

        // Scale center is the pivot at (350,330)
        const radius = 250;
        const rad = angle * Math.PI / 180;

        const x1 = 350 + radius * Math.sin(rad);
        const y1 = 330 - radius * Math.cos(rad);

        const tickLength = i % 2 === 0 ? 18 : 10;

        const x2 = 350 + (radius - tickLength) * Math.sin(rad);
        const y2 = 330 - (radius - tickLength) * Math.cos(rad);

        const tick = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        tick.setAttribute("x1", x1);
        tick.setAttribute("y1", y1);
        tick.setAttribute("x2", x2);
        tick.setAttribute("y2", y2);
        tick.setAttribute(
            "class",
            i % 2 === 0 ? "tick major" : "tick"
        );

        scaleMarks.appendChild(tick);

        // Add numeric scale labels
        if (i % 2 === 0) {
            const label = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

            const labelRadius = 205;

            label.setAttribute(
                "x",
                350 + labelRadius * Math.sin(rad)
            );

            label.setAttribute(
                "y",
                330 - labelRadius * Math.cos(rad)
            );

            label.setAttribute("class", "tick-label");

            // Values from 0 to 100
            label.textContent = i * 10;

            scaleMarks.appendChild(label);
        }
    }
}

// Calculate deflection based on current
function calculateDeflection(current) {
    if (current <= 0) return 0;

    // Approximate attraction-type MI characteristic:
    // Deflection is proportional to current squared.
    const ratio = current / MAX_CURRENT;

    return MAX_ANGLE * ratio * ratio;
}

// Update the instrument
function updateInstrument() {
    const current = instrumentOn
        ? Number(slider.value)
        : 0;

    targetAngle = calculateDeflection(current);

    currentValue.textContent = current.toFixed(2) + " A";
    sliderValue.textContent = current.toFixed(2) + " A";

    if (current > 0) {
        fieldValue.textContent = "ON";
        fieldValue.style.color = "#0077cc";

        workingText.textContent =
            "Current flows through the electromagnet coil. " +
            "The coil produces a magnetic field and attracts " +
            "the iron vane. The pointer deflects according to " +
            "the strength of the current.";
    } else {
        fieldValue.textContent = "OFF";
        fieldValue.style.color = "#d93025";

        workingText.textContent =
            "No current is flowing through the coil. " +
            "The magnetic field disappears and the pointer " +
            "returns to its zero position.";
    }
}

// Animate pointer movement smoothly
function animatePointer() {
    const difference = targetAngle - displayedAngle;

    displayedAngle += difference * 0.08;

    if (Math.abs(difference) < 0.01) {
        displayedAngle = targetAngle;
    }

    movingSystem.setAttribute(
        "transform",
        `rotate(${displayedAngle} 350 330)`
    );

    angleValue.textContent =
        displayedAngle.toFixed(1) + "°";

    requestAnimationFrame(animatePointer);
}

// Switch ON
startBtn.addEventListener("click", () => {
    instrumentOn = true;
    slider.disabled = false;
    updateInstrument();
});

// Switch OFF
stopBtn.addEventListener("click", () => {
    instrumentOn = false;
    slider.value = 0;
    updateInstrument();
});

// Change current
slider.addEventListener("input", () => {
    if (!instrumentOn) return;
    updateInstrument();
});

// Reset
resetBtn.addEventListener("click", () => {
    instrumentOn = false;
    slider.value = 0;
    slider.disabled = false;

    displayedAngle = 0;
    targetAngle = 0;

    updateInstrument();
});

// Initialize
createScale();
slider.disabled = false;
updateInstrument();
animatePointer();
