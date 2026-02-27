const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", () => {

        cards.forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

    });
});
async function getPets() {
    const response = await fetch('http://localhost:5000/pets');
    const data = await response.json();
    console.log(data); // This will show the pets from pets.json
}