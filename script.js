const gridContainer = document.getElementById("grid-container");
const resetButton = document.getElementById("reset-button");
const maxInteractions = 10; // Maximum number of interactions to reach full black
const eraserButton = document.getElementById("eraser-button"); // Add an eraser button
let erasing = false; // Flag to indicate eraser mode

function createGrid(size) {
    gridContainer.innerHTML = "";

    // Calculate the number of rows and columns based on viewport height and desired square size
    const viewportHeight = window.innerHeight;
    const squareSize = Math.floor(viewportHeight / size);

    gridContainer.style.gridTemplateColumns = `repeat(${size}, ${squareSize}px)`; // Set the number of columns
    gridContainer.style.gridTemplateRows = `repeat(${size}, ${squareSize}px)`; // Set the number of rows

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.dataset.interactions = 0; // Initialize interaction count
        gridContainer.appendChild(square);
    }

    addHoverEffect();
}

function addHoverEffect() {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
        square.addEventListener("mouseover", () => {
            if (erasing) {
                // If eraser mode is enabled, change square color to white
                square.style.backgroundColor = "white";
            } else {
                const interactions = parseInt(square.dataset.interactions);
                if (interactions < maxInteractions) {
                    randomizeAndDarkenColor(square, interactions);
                    square.dataset.interactions = interactions + 1; // Increment interaction count
                }
            }
        });
    });
}

function randomizeAndDarkenColor(square, interactions) {
    const currentColor = getComputedStyle(square).backgroundColor;
    const rgbValues = currentColor.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);

    // Generate random RGB values
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);

    // Calculate the darken factor (10% per interaction)
    const darkenFactor = (interactions + 1) / maxInteractions;

    // Calculate the new RGB values by blending the random color and darkening
    const newR = Math.max(0, r * (1 - darkenFactor) + randomR * darkenFactor);
    const newG = Math.max(0, g * (1 - darkenFactor) + randomG * darkenFactor);
    const newB = Math.max(0, b * (1 - darkenFactor) + randomB * darkenFactor);

    square.style.backgroundColor = `rgb(${Math.round(newR)},${Math.round(newG)},${Math.round(newB)})`;

    // Check if it's the last interaction and set to full black if needed
    if (interactions === maxInteractions - 1) {
        square.style.backgroundColor = "black";
    }
}

// Initial grid creation
createGrid(16);

// Reset button functionality
resetButton.addEventListener("click", () => {
    const newSize = prompt("Enter the number of squares per side (maximum 100):");
    const newSizeInt = parseInt(newSize);

    if (!isNaN(newSizeInt) && newSizeInt > 0 && newSizeInt <= 100) {
        createGrid(newSizeInt);
    } else {
        alert("Please enter a valid number between 1 and 100.");
    }
});

// Toggle eraser mode
eraserButton.addEventListener("click", () => {
    erasing = !erasing; // Toggle the eraser flag
    if (erasing) {
        eraserButton.textContent = "Eraser On"; // Update button text
    } else {
        eraserButton.textContent = "Eraser Off"; // Update button text
    }
});