// Chọn các phần tử trong màn hình
const startScreenElement = document.getElementById("start-screen"); // Phần tử màn hình bắt đầu
const quizScreen = document.getElementById("quiz-screen"); // Phần tử màn hình trả lời câu hỏi
const retryScreen = document.getElementById("retry-screen"); // Phần tử màn hình thử lại
const resultScreen = document.getElementById("result-screen"); // Phần tử màn hình kết quả

// Chọn các phần tử trong màn hình trả lời câu hỏi
const questionElement = document.getElementById("question"); // Phần tử câu hỏi
const answerElements = document.querySelectorAll(".answers .card"); // Mảng các phần tử trả lời
const buttonElements = document.querySelectorAll("button"); // Mảng các nút bấm
const submitButton = document.getElementById("submit-button"); // Nút bấm để nộp bài
const resultOverlayElement = document.getElementById("result-overlay"); // Phần tử lớp phủ kết quả
const resultModalElement = document.getElementById("result-modal"); // Phần tử kết quả
const resultTextElement = document.getElementById("result-text"); // Phần tử văn bản kết quả
const resultMessageElement = document.getElementById("result-message"); // Phần tử thông báo kết quả
const resultIconElement = document.getElementById("result-icon"); // Phần tử biểu tượng kết quả
const nextButton = document.getElementById("next-button"); // Nút bấm để chuyển sang câu hỏi tiếp theo
const audioCorrect = document.getElementById("audio-correct"); // Phần tử âm thanh khi trả lời đúng
const audioWrong = document.getElementById("audio-wrong"); // Phần tử âm thanh khi trả lời sai
const loadElement = document.querySelector(".load-wrapper"); // Phần tử hiển thị khi đang tải
var selectedAnswer = null; // Biến chứa phần tử trả lời đã chọn

// Các biến phục vụ việc chuyển đổi văn bản thành giọng nói
let voiceSpeech;

window.onload = function () {
    // Chuẩn bị giọng đọc khi vừa load trang
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        setTimeout(loadVoices, 100);
    }
};

// Chuyển sang chế độ bắt đầu trả lời câu hỏi
function swapToQuizMode() {
    showLoading();

    getListQuiz();
    showQuizScreen();
}

// Chuyển sang chế độ trả lời lại những câu hỏi sai
function swapToRetryMode() {
    currentLearningMode = listWrongQuiz;
    checkMode();
    showQuizScreen();
}

// Hiển thị màn hình học trắc nghiệm
function showQuizScreen() {
    startScreenElement.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    retryScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
}

// Hiển thị màn hình thông báo chuẩn bị trả lời lại những câu hỏi sai
function showRetryScreen() {
    showLoading();

    startScreenElement.classList.add("hidden");
    quizScreen.classList.add("hidden");
    retryScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");

    setTimeout(function () {
        hideLoading();
    }, 1000);
}

// Hiển thị màn hình kết quả bài học
function showResultScreen() {
    showLoading();

    startScreenElement.classList.add("hidden");
    quizScreen.classList.add("hidden");
    retryScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    setTimeout(function () {
        hideLoading();
    }, 1000);
}

// Thêm sự kiện khi chọn câu trả lời
answerElements.forEach((aElement) => {
    aElement.addEventListener("click", () => {
        // lưu lại nội dung của câu trả lời được chọn
        selectedAnswer = aElement.querySelector(".card-text").innerText;

        // đọc nội dung câu trả lời được chọn
        textToSpeech(selectedAnswer);

        // xóa class selected cho tất cả các câu trả lời
        answerElements.forEach((a) => a.classList.remove("selected"));

        // thêm class selected cho câu trả lời được chọn
        aElement.classList.add("selected");

        // Bật nút submit
        submitButton.classList.remove("disabled");
    });

    aElement.addEventListener("mousedown", () => {
        aElement.classList.add("active");
    });

    aElement.addEventListener("mouseup", () => {
        aElement.classList.remove("active");
    });

    aElement.addEventListener("mouseleave", () => {
        setTimeout(function () {
            aElement.classList.remove("active");
        }, 300);
    });

    aElement.addEventListener("touchstart", () => {
        aElement.classList.add("active");
    });

    aElement.addEventListener("touchend", () => {
        aElement.classList.remove("active");
    });
});

// Thêm sự kiện khi click vào các nút button
buttonElements.forEach((bElement) => {
    bElement.addEventListener("mousedown", () => {
        bElement.classList.add("active");
    });

    bElement.addEventListener("mouseup", () => {
        bElement.classList.remove("active");
    });

    bElement.addEventListener("mouseleave", () => {
        setTimeout(function () {
            bElement.classList.remove("active");
        }, 300);
    });

    bElement.addEventListener("touchstart", () => {
        bElement.classList.add("active");
    });

    bElement.addEventListener("touchend", () => {
        bElement.classList.remove("active");
    });
});

// thêm sự kiện khi nhấn vào nút submit button
submitButton.addEventListener("click", function (event) {
    // Prevent page from reloading on submit
    event.preventDefault();

    // set kết quả vào ô result và chuẩn bị phát âm thanh
    if (selectedAnswer == getCorrectAnswer()) {
        displayCorrectResult();
        playCorrectAudio();
    } else {
        displayWrongResult();
        playWrongAudio();

        // Thêm vào câu sai
        if (currentLearningMode == listQuiz) {
            listWrongQuiz.push(listQuiz[currentQuestion]);
        } else {
            listWrongQuiz.push(listWrongQuiz[currentWrongQuestion]);
        }
        console.log(listWrongQuiz);
    }

    // Hiển thị kết quả
    resultOverlayElement.classList.remove("hidden");

    // Bật nút sang câu tiếp theo
    setTimeout(function () {
        nextButton.classList.remove("disabled");
    }, 200);

    // Tắt nút trả lời
    submitButton.classList.add("disabled");
});

// Add event listener for next button
nextButton.addEventListener("click", function (event) {
    event.preventDefault();

    resetCssElements();

    // Show next question
    if (currentLearningMode == listQuiz) {
        currentQuestion++;
    } else {
        currentWrongQuestion++;
    }
    checkMode();
});

// display correct result
function displayCorrectResult() {
    resultModalElement.classList.remove("wrong");
    resultModalElement.classList.add("correct");
    resultTextElement.textContent = "Tuyệt vời!";
    resultMessageElement.textContent = "";
    nextButton.textContent = "Tiếp tục";
    resultIconElement.classList.remove("bi-x-circle-fill");
    resultIconElement.classList.add("bi-check-circle-fill");
}

// display wrong result
function displayWrongResult() {
    resultModalElement.classList.remove("correct");
    resultModalElement.classList.add("wrong");
    resultTextElement.textContent = "Không chính xác";
    resultMessageElement.innerHTML = `<strong>Đáp án đúng: </strong>${getCorrectAnswer()}`;
    nextButton.textContent = "Đã hiểu";
    resultIconElement.classList.remove("bi-check-circle-fill");
    resultIconElement.classList.add("bi-x-circle-fill");
}

// load audio elements
function loadAudio() {
    audioCorrect.load();
    audioWrong.load();
}

// play correct audio
function playCorrectAudio() {
    audioCorrect.play();
}

// play wrong audio
function playWrongAudio() {
    audioWrong.play();
}

// reset CSS styles for question and answers
function resetCssElements() {
    // hide result overlay
    resultOverlayElement.classList.add("hidden");
    // disable next button
    nextButton.classList.add("disabled");
    // reset answer selections
    answerElements.forEach((a) => {
        a.classList.remove("selected");
    });
}

function showLoading() {
    loadElement.classList.remove("hidden");
}

function hideLoading() {
    loadElement.classList.add("hidden");
}

function loadVoices() {
    for (let voice of speechSynthesis.getVoices()) {
        if (voice.name === "Google UK English Female") {
            voiceSpeech = voice;
            break;
        }
    }
}

function textToSpeech(text) {
    // dừng đọc (nếu có)
    speechSynthesis.cancel();

    // đọc nội dung
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceSpeech;
    utterance.lang = voiceSpeech.lang;
    speechSynthesis.speak(utterance);
}
