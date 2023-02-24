// Select elements
const answers = document.querySelectorAll(".answers .card");
const submitButton = document.getElementById("submit-button");
const resultOverlay = document.getElementById("result-overlay");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");
const nextButton = document.getElementById("next-button");
var answer_text = null;

// Load questions and answers on page load
window.onload = function () {
    get_list_questionAnswer();
    load_audio();
};

// Add event listener for selecting an answer
answers.forEach((answer) => {
    answer.addEventListener("click", () => {
        answers.forEach((a) => a.classList.remove("selected"));
        answer.classList.add("selected");
        // Save answer text
        answer_text = answer.querySelector(".card-text").innerText;
        // Enable submit button
        submitButton.classList.remove("disabled");
    });
});

// Add event listener for submitting answer
submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent page from reloading on submit

    if (answer_text == get_correct_answer()) {
        display_correct();
        play_correct_audio();
    } else {
        display_wrong();
        play_wrong_audio();
    }

    // Show result overlay
    resultOverlay.classList.remove("hidden");

    // Enable next button after delay
    setTimeout(function () {
        nextButton.classList.remove("disabled");
    }, 200);
});

// Add event listener for next button
nextButton.addEventListener("click", function (event) {
    event.preventDefault();
    reset_css_question();
    // Show next question
    question_current++;
    show_question(question_current);
});
