// Select elements
const answers = document.querySelectorAll(".answers .card");
const buttons = document.querySelectorAll("button");
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

    answer.addEventListener("mousedown", () => {
        answer.classList.add("active");
    });

    answer.addEventListener("mouseup", () => {
        answer.classList.remove("active");
    });

    answer.addEventListener("mouseleave", () => {
        setTimeout(function () {
            answer.classList.remove("active");
        }, 300);
    });

    answer.addEventListener("touchstart", () => {
        answer.classList.add("active");
    });

    answer.addEventListener("touchend", () => {
        answer.classList.remove("active");
    });
});

buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.classList.add("active");
    });

    button.addEventListener("mouseup", () => {
        button.classList.remove("active");
    });

    button.addEventListener("mouseleave", () => {
        setTimeout(function () {
            button.classList.remove("active");
        }, 300);
    });

    button.addEventListener("touchstart", () => {
        button.classList.add("active");
    });

    button.addEventListener("touchend", () => {
        button.classList.remove("active");
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

    // Disable submit button
    submitButton.classList.add("disabled");
});

// Add event listener for next button
nextButton.addEventListener("click", function (event) {
    event.preventDefault();
    reset_css_question();
    // Show next question
    question_current++;
    show_question(question_current);
});
