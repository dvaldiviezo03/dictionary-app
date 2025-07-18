const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const wordText = document.getElementById("word-text");
const typeText = document.getElementById("type-text");
const phoneticText = document.getElementById("phonetic-text");
const soundButton = document.getElementById("sound-button");
const definitionText = document.getElementById("definition-text");
const exampleText = document.getElementById("example-text");
const audio = new Audio();
const wordDetailsElem = document.querySelector(".word-details");
const errorText = document.querySelector(".error-message");

async function getWordDetails(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const wordData = data[0];
    const phonetics = wordData.phonetics || [];

    let phoneticText = "", phoneticAudio = "";

    for (const phonetic of phonetics) {
        if (phonetic.text && !localPhoneticText)
            localPhoneticText = phonetic.text;
        if (phonetic.audio && !phoneticAudio)
            phoneticAudio = phonetic.audio;
        if (phoneticText && phoneticAudio) break;
    }

    const meaning = wordData.meanings[0];

    return {
        word: word.toLowerCase(),
        phonetic: {
            text: localPhoneticText,
            audio: phoneticAudio
        },
        speechPart: meaning.partOfSpeech,
        definition: meaning.definitions[0].definition,
        example: meaning.definitions[0].example || ""
    }
}

searchBox.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (searchInput.value.trim() == "") {
        errorText.textContent = "Please Enter a Word."
    } else {
        errorText.textContent = "";
        wordDetailsElem.classList.remove("active")
        try {
            const wordDetails = await getWordDetails(searchInput.value);
            wordText.textContent = wordDetails.word;
            typeText.textContent = wordDetails.speechPart;
            phoneticText.textContent = wordDetails.phonetic.text;
            audio.src = wordDetails.phonetic.audio;
            definitionText.textContent = wordDetails.definition;
            exampleText.querySelector("p").textContent = wordDetails.example;
            exampleText.style.display = wordDetails.example === "" ? "none" : "block";
            wordDetailsElem.classList.add("active")
        } catch (err) {
            errorText.textContent = "Word Not Found.";
        }
    }
});

soundButton.addEventListener("click", () => {
    if (audio.src) {
        audio.play();
    }
});