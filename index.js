const answers = document.querySelectorAll(".answers .card");
const submitButton = document.getElementById("submit-button");
const resultOverlay = document.getElementById("result-overlay");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");
const nextButton = document.getElementById("next-button");
var answer_text = null;

// bắt sự kiện khi click chọn đáp án
answers.forEach((answer) => {
    answer.addEventListener("click", () => {
        answers.forEach((a) => a.classList.remove("selected"));
        answer.classList.add("selected");
        // Lưu câu trả lời
        answer_text = answer.querySelector(".card-text").innerText;
    });
});

// Thêm sự kiện click cho nút submit
submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn trang web tải lại khi nhấn nút submit

    if (answer_text) {
        resultModal.classList.remove("wrong");
        resultModal.classList.add("correct");
        resultText.textContent = "Tuyệt vời!";
        resultMessage.textContent = "";
        nextButton.textContent = "Tiếp theo";
        resultIcon.classList.remove("bi-x-circle-fill");
        resultIcon.classList.add("bi-check-circle-fill");
        play_correct_audio();
    } else {
        resultModal.classList.remove("correct");
        resultModal.classList.add("wrong");
        resultText.textContent = "Không chính xác";
        resultMessage.textContent = "Vui lòng thử lại";
        nextButton.textContent = "Đã hiểu";
        resultIcon.classList.remove("bi-check-circle-fill");
        resultIcon.classList.add("bi-x-circle-fill");
        play_wrong_audio();
    }

    // Hiển thị overlay kết quả
    resultOverlay.classList.remove("hidden");
});

// Thêm sự kiện click cho nút next
nextButton.addEventListener("click", function (event) {
    event.preventDefault();
    resultOverlay.classList.add("hidden");
});
