const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        // 1. Highlight the selection
        cards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");

        // 2. Get the value (e.g., "Apartment")
        const userChoice = card.innerText.split(' ')[0]; // Gets "Apartment" or "House"
        
        // 3. Save it temporarily in the browser
        localStorage.setItem("userHome", userChoice);

        // 4. Wait a half-second so they see the click, then go to results
        setTimeout(() => {
            window.location.href = "results.html"; 
        }, 600);
    });
});