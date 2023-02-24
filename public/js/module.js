const audio_correct = document.getElementById("audio_correct");
const audio_wrong = document.getElementById("audio_wrong");

function display_correct() {
    resultModal.classList.remove("wrong");
    resultModal.classList.add("correct");
    resultText.textContent = "Tuyệt vời!";
    resultMessage.textContent = "";
    nextButton.textContent = "Tiếp theo";
    resultIcon.classList.remove("bi-x-circle-fill");
    resultIcon.classList.add("bi-check-circle-fill");
}

function display_wrong() {
    resultModal.classList.remove("correct");
    resultModal.classList.add("wrong");
    resultText.textContent = "Không chính xác";
    resultMessage.textContent = "Vui lòng thử lại";
    nextButton.textContent = "Đã hiểu";
    resultIcon.classList.remove("bi-check-circle-fill");
    resultIcon.classList.add("bi-x-circle-fill");
}

function load_audio() {
    audio_correct.load();
    audio_wrong.load();
}

function play_correct_audio() {
    audio_correct.play();
}

function play_wrong_audio() {
    audio_wrong.play();
}
