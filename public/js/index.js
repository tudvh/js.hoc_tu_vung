const answers = document.querySelectorAll(".answers .card");
const submitButton = document.getElementById("submit-button");
const resultOverlay = document.getElementById("result-overlay");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");
const nextButton = document.getElementById("next-button");
var answer_text = null;

load_audio();

// Thêm sự kiện khi click chọn đáp án
answers.forEach((answer) => {
    answer.addEventListener("click", () => {
        answers.forEach((a) => a.classList.remove("selected"));
        answer.classList.add("selected");
        // Lưu câu trả lời
        answer_text = answer.querySelector(".card-text").innerText;
        // undisable submit button
        submitButton.classList.remove("disabled");
    });
});

// Thêm sự kiện click cho nút submit
submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn trang web tải lại khi nhấn nút submit

    if (answer_text == "Hanoi") {
        display_correct();
        play_correct_audio();
    } else {
        display_wrong();
        play_wrong_audio();
    }

    // Hiển thị overlay kết quả
    resultOverlay.classList.remove("hidden");

    // undisable next button
    setTimeout(function () {
        nextButton.classList.remove("disabled");
    }, 200);
});

// Thêm sự kiện click cho nút next
nextButton.addEventListener("click", function (event) {
    event.preventDefault();
    resultOverlay.classList.add("hidden");
    // disable next button
    nextButton.classList.add("disabled");
});
