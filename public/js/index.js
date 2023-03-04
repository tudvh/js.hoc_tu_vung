// Chọn các phần tử screen
const startScreenElement = document.getElementById("start-screen"); // Phần tử màn hình bắt đầu
const quizScreen = document.getElementById("quiz-screen"); // Phần tử màn hình trả lời câu hỏi
const retryScreen = document.getElementById("retry-screen"); // Phần tử màn hình thử lại
const resultScreen = document.getElementById("result-screen"); // Phần tử màn hình kết quả

// Chọn các phần tử trong màn hình trả lời câu hỏi
const questionElement = document.getElementById("question"); // Phần tử hiển thị câu hỏi
const answerElements = document.querySelectorAll(".answers .card"); // Mảng các phần tử hiển thị câu trả lời
const buttons = document.querySelectorAll("button"); // Mảng các nút bấm
const submitButton = document.getElementById("submit-button"); // Nút bấm để nộp bài
const resultOverlayElement = document.getElementById("result-overlay"); // Phần tử lớp phủ kết quả
const resultModalElement = document.getElementById("result-modal"); // Phần tử hiển thị kết quả
const resultTextElement = document.getElementById("result-text"); // Phần tử hiển thị văn bản kết quả
const resultMessageElement = document.getElementById("result-message"); // Phần tử hiển thị thông báo kết quả
const resultIconElement = document.getElementById("result-icon"); // Phần tử hiển thị biểu tượng kết quả
const nextButton = document.getElementById("next-button"); // Nút bấm để chuyển sang câu hỏi tiếp theo
const audioCorrect = document.getElementById("audio-correct"); // Phần tử âm thanh khi trả lời đúng
const audioWrong = document.getElementById("audio-wrong"); // Phần tử âm thanh khi trả lời sai
const loadElement = document.querySelector(".load-wrapper"); // Phần tử hiển thị khi đang tải

// Biến lưu trữ bộ câu hỏi
let learningQuiz; // Bộ câu hỏi
let wrongQuiz; // Những câu hỏi sai
let currentQuiz; // Bộ câu đang học
var selectedAnswer = null; // Câu trả lời được chọn

// Các biến phục vụ việc chuyển đổi văn bản thành giọng nói
let voiceSpeech; // Giọng nói hiện tại
const utterance = new SpeechSynthesisUtterance(); // Đoạn văn bản cần chuyển thành giọng nói
const synth = window.speechSynthesis; // Đối tượng synth cho phép chuyển đổi văn bản thành giọng nói

// Thay đổi giao diện hiển thị kết quả đúng
function displayCorrectResult() {
    // Loại bỏ lớp "wrong" và thêm lớp "correct" vào phần tử modal kết quả
    resultModalElement.classList.remove("wrong");
    resultModalElement.classList.add("correct");

    // Thiết lập văn bản thông báo kết quả đúng
    resultTextElement.textContent = "Tuyệt vời!";

    // Xóa văn bản thông báo chi tiết và thay đổi nút tiếp tục thành "Tiếp tục"
    resultMessageElement.textContent = "";
    nextButton.textContent = "Tiếp tục";

    // Loại bỏ biểu tượng "bi-x-circle-fill" và thêm biểu tượng "bi-check-circle-fill"
    resultIconElement.classList.remove("bi-x-circle-fill");
    resultIconElement.classList.add("bi-check-circle-fill");
}

// Thay đổi giao diện hiển thị kết quả sai
function displayWrongResult() {
    // Loại bỏ lớp "correct" và thêm lớp "wrong" vào phần tử modal kết quả
    resultModalElement.classList.remove("correct");
    resultModalElement.classList.add("wrong");

    // Thiết lập văn bản thông báo kết quả sai
    resultTextElement.textContent = "Không chính xác";

    // Thiết lập văn bản thông báo chi tiết về đáp án đúng và thay đổi nút tiếp tục thành "Đã hiểu"
    resultMessageElement.innerHTML = `<strong>Đáp án đúng: </strong>${currentQuiz.getCorrectAnswer()}`;
    nextButton.textContent = "Đã hiểu";

    // Loại bỏ biểu tượng "bi-check-circle-fill" và thêm biểu tượng "bi-x-circle-fill"
    resultIconElement.classList.remove("bi-check-circle-fill");
    resultIconElement.classList.add("bi-x-circle-fill");
}

// Tải tệp âm thanh "audioCorrect" và "audioWrong"
function loadAudio() {
    audioCorrect.load();
    audioWrong.load();
}

// Phát âm thanh khi người dùng trả lời đúng
function playCorrectAudio() {
    audioCorrect.play();
}

// Phát âm thanh khi người dùng trả lời sai
function playWrongAudio() {
    audioWrong.play();
}

// Đặt lại CSS cho các phần tử trong câu hỏi và câu trả lời
function resetCssElements() {
    // Ẩn overlay kết quả
    resultOverlayElement.classList.add("hidden");

    // Vô hiệu hóa nút "Tiếp tục"
    nextButton.classList.add("disabled");

    // Đặt lại CSS cho các câu trả lời
    answerElements.forEach((a) => {
        a.classList.remove("selected");
    });
}

// Hiển thị giao diện load
function showLoading() {
    loadElement.classList.remove("hidden");
}

// Ẩn giao diện load
function hideLoading() {
    loadElement.classList.add("hidden");
}

// Chuyển đổi văn bản thành giọng nói sử dụng Text-to-Speech API
function textToSpeech(text) {
    utterance.text = text;
    synth.speak(utterance);
}

// Tải giọng nói tiếng Anh Anh từ Text-to-Speech API của trình duyệt
function loadEnGBVoice() {
    // Trả về một Promise để xử lý các sự kiện bất đồng bộ
    return new Promise((resolve) => {
        // Duyệt qua danh sách các giọng nói được hỗ trợ bởi trình duyệt
        for (let voice of synth.getVoices()) {
            if (
                voice.name == "Google UK English Female" ||
                voice.name == "Tiếng Anh Vương quốc Anh"
            ) {
                // Đặt giọng nói cho đối tượng voiceSpeech
                voiceSpeech = voice;

                // Đặt ngôn ngữ của đối tượng utterance cho ngôn ngữ của giọng nói
                utterance.lang = voiceSpeech.lang;

                // Ngừng vòng lặp khi tìm thấy giọng nói phù hợp
                break;
            }
        }
        // Trả về Promise để thực thi các tác vụ bất đồng bộ
        resolve();
    });
}

// Thiết lập câu hỏi và các phương án trả lời
function setQuizElement() {
    // Hiển thị giao diện load
    showLoading();

    // Thiết lập câu hỏi hiện tại cho trang HTML
    questionElement.innerHTML = currentQuiz.getCurrentQuestion();

    // Lấy danh sách các phương án trả lời hiện tại
    let answers = currentQuiz.getCurrentAnswers();

    // Thiết lập các phương án trả lời trên trang HTML
    for (let i = 0; i < 4; i++) {
        answerElements[i].querySelector(".card-text").textContent = answers[i];
    }

    // Ẩn giao diện load sau 1 giây
    setTimeout(() => {
        hideLoading();
    }, 1000);
}

// Hiển thị màn hình học
function showQuizScreen() {
    // Ẩn màn hình bắt đầu
    startScreenElement.classList.add("hidden");
    // Hiển thị màn hình học
    quizScreen.classList.remove("hidden");
    // Ẩn màn hình thử lại
    retryScreen.classList.add("hidden");
    // Ẩn màn hình kết quả
    resultScreen.classList.add("hidden");
}

// Chuyển đổi sang chế độ học bằng cách tạo ra một bài quiz mới với giọng Tiếng Anh
function swapToLearningMode() {
    // Hiển thị loading
    showLoading();

    // Lấy dữ liệu tất cả các câu hỏi và load giọng Tiếng Anh
    Promise.all([getAllQuiz(), loadEnGBVoice()])
        .then(([allQuiz, _]) => {
            // Chuyển đổi chữ cái đầu tiên của tất cả các câu hỏi sang chữ in hoa
            allQuiz = capitalizeFirstLetterAllQuiz(allQuiz);

            // Lấy danh sách tất cả các đáp án
            allAnswers = getAllAnswers(allQuiz);

            // Tạo ra một bài quiz mới cho chế độ học
            learningQuiz = new ListQuiz(
                getRandomElements(allQuiz, maxQuestion),
                "learning",
                allAnswers
            );

            // Tạo ra một bài quiz mới cho chế độ sai
            wrongQuiz = new ListQuiz([], "wrong", allAnswers);

            // Thiết lập bài quiz hiện tại là bài quiz cho chế độ học
            currentQuiz = learningQuiz;

            // Hiển thị màn hình quiz
            showQuizScreen();

            // Hiển thị các câu hỏi lên màn hình
            setQuizElement();
        })
        .catch((error) => {
            // Hiển thị lỗi nếu có
            console.error(error);
        });
}

// Chuyển sang chế độ trả lời lại những câu hỏi sai
function swapToRetryMode() {
    currentQuiz = wrongQuiz;
    wrongAnswersCount = wrongQuiz.getLength();

    // Kiểm tra chế độ hiện tại và cập nhật nút kiểm tra
    checkMode();

    // Hiển thị màn hình quiz
    showQuizScreen();
}

// Hiển thị màn hình thông báo chuẩn bị trả lời lại những câu hỏi sai
function showRetryScreen() {
    // Hiển thị loading
    showLoading();

    // Ẩn màn hình start và quiz, hiển thị màn hình retry và ẩn màn hình kết quả
    startScreenElement.classList.add("hidden");
    quizScreen.classList.add("hidden");
    retryScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");

    // Sau 1 giây, ẩn loading
    setTimeout(function () {
        hideLoading();
    }, 1000);
}

// Hiển thị màn hình kết quả bài học
function showResultScreen() {
    // Hiển thị loading
    showLoading();

    // Ẩn màn hình start và quiz, retry và hiển thị màn hình kết quả
    startScreenElement.classList.add("hidden");
    quizScreen.classList.add("hidden");
    retryScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    setTimeout(function () {
        hideLoading();
    }, 1000);
}

// Kiểm tra chế độ làm bài tập trắc nghiệm của người dùng và quyết định hành động tiếp theo.
function checkMode() {
    // Nếu đang ở chế độ học
    if (currentQuiz == learningQuiz) {
        // Nếu người dùng đã hoàn thành chế độ học
        if (currentQuiz.current >= currentQuiz.getLength()) {
            // Nếu người dùng có câu trả lời sai trong bài tập
            if (wrongQuiz.getLength()) {
                // Hiển thị màn hình thử lại
                showRetryScreen();
            } else {
                // Hiển thị màn hình kết quả
                showResultScreen();
            }
        } else {
            // Thiết lập phần tử câu hỏi mới
            setQuizElement();
        }
    }
    // Nếu đang ở chế độ trả lời những câu hỏi sai
    else if (currentQuiz == wrongQuiz) {
        // Nếu người dùng đã hoàn thành số lần trả lời sai tối đa
        if (currentQuiz.current >= wrongAnswersCount * 2) {
            // Chuyển hướng trở lại trang chủ
            location.href = ".";
        } else if (currentQuiz.current >= currentQuiz.getLength()) {
            // Hiển thị màn hình kết quả
            showResultScreen();
        } else {
            // Thiết lập phần tử bài tập mới
            setQuizElement();
        }
    }
}

window.onload = function () {
    loadEnGBVoice();
    loadAudio();
};

// Thêm sự kiện khi chọn câu trả lời
answerElements.forEach((aElement) => {
    aElement.addEventListener("click", () => {
        // lưu lại nội dung của câu trả lời được chọn
        selectedAnswer = aElement.querySelector(".card-text").innerText;

        // tắt giọng đọc trước đó nếu có
        synth.cancel();

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
buttons.forEach((bElement) => {
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
    if (selectedAnswer == currentQuiz.getCorrectAnswer()) {
        displayCorrectResult();
        playCorrectAudio();
    } else {
        displayWrongResult();
        playWrongAudio();

        // Thêm vào câu sai
        wrongQuiz.addQuiz(currentQuiz.getCurrentQuiz());
        if (currentQuiz == wrongQuiz) {
            currentQuiz = wrongQuiz;
        }
        console.log(wrongQuiz);
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
    currentQuiz.current += 1;
    checkMode();
});
