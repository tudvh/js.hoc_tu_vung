// Khai báo các biến lưu trữ các phần tử trên trang web
const startScreenElement = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const retryScreen = document.getElementById('retry-screen');
const resultScreen = document.getElementById('result-screen');

const progressBarElement = document.querySelector('.progress-bar');
const questionElement = document.getElementById('question');
const answerElements = document.querySelectorAll('.answers .card');
const buttons = document.querySelectorAll('button');
const submitButton = document.getElementById('submit-button');
const resultOverlayElement = document.getElementById('result-overlay');
const resultModalElement = document.getElementById('result-modal');
const resultTextElement = document.getElementById('result-text');
const resultMessageElement = document.getElementById('result-message');
const resultIconElement = document.getElementById('result-icon');
const nextButton = document.getElementById('next-button');
const audioCorrect = document.getElementById('audio-correct');
const audioWrong = document.getElementById('audio-wrong');
const loadElement = document.querySelector('.load-wrapper');

// Khởi tạo các biến lưu trữ trạng thái của bài học và các câu hỏi
let learningQuiz;
let wrongQuiz;
let currentQuiz;
let selectedAnswer = null;
let answeredQuizs = null;

// Khởi tạo các biến lưu trữ trạng thái của giọng nói và các phát âm
let voiceSpeech;
const utterance = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;

const currentVersion = '2.0';

function checkVersion() {
    const previousVersion = localStorage.getItem('appVersion');

    if (previousVersion === null || previousVersion !== currentVersion) {
        showLoading('Đang kiểm tra cập nhật...');

        localStorage.clear();
        localStorage.setItem('appVersion', currentVersion);

        setTimeout(() => hideLoading(), 1000);
    }
}

function setProgressBar() {
    let currentProgress = learningQuiz.current + wrongQuiz.current + 1;
    let totalQuiz = learningQuiz.length + wrongQuiz.length;
    let percent = (currentProgress / totalQuiz) * 100;

    const completedElement = progressBarElement.querySelector('.completed');
    completedElement.style.width = `${percent}%`;

    console.log(`${percent}%`);
}

// Thay đổi giao diện hiển thị kết quả đúng
function displayCorrectResult() {
    // Loại bỏ lớp "wrong" và thêm lớp "correct" vào phần tử modal kết quả
    resultModalElement.classList.remove('wrong');
    resultModalElement.classList.add('correct');

    // Thiết lập văn bản thông báo kết quả đúng
    resultTextElement.textContent = 'Tuyệt vời!';

    // Xóa văn bản thông báo chi tiết và thay đổi nút tiếp tục thành "Tiếp tục"
    resultMessageElement.textContent = '';
    nextButton.textContent = 'Tiếp tục';

    // Loại bỏ biểu tượng "bi-x-circle-fill" và thêm biểu tượng "bi-check-circle-fill"
    resultIconElement.classList.remove('bi-x-circle-fill');
    resultIconElement.classList.add('bi-check-circle-fill');
}

// Thay đổi giao diện hiển thị kết quả sai
function displayWrongResult() {
    // Loại bỏ lớp "correct" và thêm lớp "wrong" vào phần tử modal kết quả
    resultModalElement.classList.remove('correct');
    resultModalElement.classList.add('wrong');

    // Thiết lập văn bản thông báo kết quả sai
    resultTextElement.textContent = 'Không chính xác';

    // Thiết lập văn bản thông báo chi tiết về đáp án đúng và thay đổi nút tiếp tục thành "Đã hiểu"
    resultMessageElement.innerHTML = `<strong>Đáp án đúng: </strong>${currentQuiz.correctAnswer}`;
    nextButton.textContent = 'Đã hiểu';

    // Loại bỏ biểu tượng "bi-check-circle-fill" và thêm biểu tượng "bi-x-circle-fill"
    resultIconElement.classList.remove('bi-check-circle-fill');
    resultIconElement.classList.add('bi-x-circle-fill');
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
    resultOverlayElement.classList.add('hidden');

    // Vô hiệu hóa nút "Tiếp tục"
    nextButton.classList.add('disabled');

    // Đặt lại CSS cho các câu trả lời
    answerElements.forEach((a) => {
        a.classList.remove('selected');
    });
}

// Hiển thị giao diện load
function showLoading(content) {
    let loadContent = loadElement.querySelector('.load-text');
    loadContent.textContent = content;
    loadElement.classList.remove('hidden');
}

// Ẩn giao diện load
function hideLoading() {
    loadElement.classList.add('hidden');
}

// Hàm này được sử dụng để chuyển hướng người dùng về trang chủ.
function redirectToHome() {
    location.href = '.';
}

// Hàm này được sử dụng để lưu trữ các câu hỏi đã trả lời và câu hỏi sai vào phiên làm việc của người dùng.
function setDataSesstion() {
    // Thêm tất cả các câu hỏi đã trả lời vào phiên làm việc của người dùng.
    answeredQuizs = learningQuiz.addQuizsToSession(answeredQuizs);
    // Thêm tất cả các câu hỏi sai vào phiên làm việc của người dùng.
    answeredQuizs = wrongQuiz.addWrongQuizsToSession(answeredQuizs);
    // Lưu trữ phiên làm việc của người dùng trên trình duyệt bằng cách sử dụng phương thức setItem() của localStorage.
    localStorage.setItem('answeredQuizs', JSON.stringify(answeredQuizs));
}

// Chuyển đổi văn bản thành giọng nói sử dụng Text-to-Speech API
function textToSpeech(text) {
    synth.cancel();

    utterance.text = text;

    synth.speak(utterance);
}

// Tải giọng nói tiếng Anh Anh từ Text-to-Speech API của trình duyệt
function loadEnGBVoice() {
    // Trả về một Promise để xử lý các sự kiện bất đồng bộ
    return new Promise((resolve) => {
        // Duyệt qua danh sách các giọng nói được hỗ trợ bởi trình duyệt
        for (let voice of synth.getVoices()) {
            if (voice.name === 'Google UK English Female' || voice.name === 'Tiếng Anh Hoa Kỳ') {
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
    showLoading('Đang tải...');

    // Thiết lập câu hỏi hiện tại cho trang HTML
    questionElement.innerHTML = currentQuiz.currentQuestionHTML;

    // Lấy danh sách các phương án trả lời hiện tại
    let answers = currentQuiz.getCurrentAnswers();

    // Thiết lập các phương án trả lời trên trang HTML
    for (let i = 0; i < 4; i++) {
        answerElements[i].querySelector('.card-text').textContent = answers[i];
    }

    // Ẩn giao diện load sau 1 giây
    setTimeout(() => hideLoading(), 1000);
}

// Hiển thị màn hình học
function showQuizScreen() {
    // Ẩn màn hình bắt đầu
    startScreenElement.classList.add('hidden');
    // Hiển thị màn hình học
    quizScreen.classList.remove('hidden');
    // Ẩn màn hình thử lại
    retryScreen.classList.add('hidden');
    // Ẩn màn hình kết quả
    resultScreen.classList.add('hidden');
}

// Chuyển sang chế độ học tập.
async function swapToLearningMode() {
    // Hiển thị Loading
    showLoading('Đang tải...');

    try {
        // Tải giọng nói tiếng Anh.
        await loadEnGBVoice();

        // Lấy danh sách tất cả các câu hỏi và chuyển đổi tất cả các chữ cái đầu tiên thành chữ hoa.
        let allQuiz = await getAllQuiz();
        allQuiz = capitalizeFirstLetterAllQuiz(allQuiz);
        allQuiz = shuffleArray(allQuiz);

        // Lấy danh sách các câu hỏi ít được sử dụng nhất
        const leastUsedQuiz = getLeastUsedQuizs(allQuiz, 30);
        console.log('Danh sách những câu hỏi ít được sử dụng nhất', leastUsedQuiz);

        const allAnswers = getAllAnswers(allQuiz);

        // Tạo đối tượng những câu hỏi sẽ học lần này.
        learningQuiz = new ListQuiz(getRandomElements(leastUsedQuiz, maxQuestion), 'learning', allAnswers);

        // Tạo đối tượng những câu trả lời sai.
        wrongQuiz = new ListQuiz([], 'wrong', allAnswers);

        // Thiết lập chế độ hiện tại là chế độ học.
        currentQuiz = learningQuiz;

        // Hiển thị màn hình học.
        showQuizScreen();

        // Kiểm tra chế độ.
        checkMode();

        // Mở toàn màn hình.
        requestFullscreen();
    } catch (error) {
        console.error(error);
    }
}

// Chuyển sang chế độ trả lời lại những câu hỏi sai
function swapToRetryMode() {
    currentQuiz = wrongQuiz;
    wrongAnswersCount = wrongQuiz.length;

    // Kiểm tra chế độ hiện tại và cập nhật nút kiểm tra
    checkMode();

    // Hiển thị màn hình quiz
    showQuizScreen();
}

// Hiển thị màn hình thông báo chuẩn bị trả lời lại những câu hỏi sai
function showRetryScreen() {
    // Hiển thị loading
    showLoading('Đang tải...');

    // Ẩn màn hình start và quiz, hiển thị màn hình retry và ẩn màn hình kết quả
    startScreenElement.classList.add('hidden');
    quizScreen.classList.add('hidden');
    retryScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');

    // Sau 1 giây, ẩn loading
    setTimeout(() => hideLoading(), 1000);
}

// Hiển thị màn hình kết quả bài học
function showResultScreen() {
    // Hiển thị loading
    showLoading('Đang tải...');

    // Ẩn màn hình start và quiz, retry và hiển thị màn hình kết quả
    startScreenElement.classList.add('hidden');
    quizScreen.classList.add('hidden');
    retryScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    setTimeout(() => hideLoading(), 1000);
}

// Hàm kiểm tra khi hoàn thành bài học
function checkLearningQuizCompletion() {
    // Lưu dữ liệu phiên cho người dùng
    setDataSesstion();
    // Nếu số câu hỏi trả lời sai lớn hơn 0 thì hiển thị màn hình thử lại
    if (wrongQuiz.length) {
        return showRetryScreen();
    } else {
        // Ngược lại, hiển thị màn hình kết quả
        return showResultScreen();
    }
}

// Hàm kiểm tra chế độ hiện tại
function checkMode() {
    // Nếu đang ở chế độ học tập
    if (currentQuiz == learningQuiz) {
        // Nếu đã trả lời hết tất cả câu hỏi trong bài học
        if (currentQuiz.current >= currentQuiz.length) {
            return checkLearningQuizCompletion();
        } else {
            // Ngược lại, thiết lập phần tử của câu hỏi
            return setQuizElement();
        }
    } else if (currentQuiz == wrongQuiz) {
        // Nếu đang ở chế độ trả lời những câu hỏi sai
        // Nếu đã trả lời sai quá nhiều => về lại trang chủ
        if (currentQuiz.current >= wrongAnswersCount * 2) {
            return redirectToHome();
        } else if (currentQuiz.current >= currentQuiz.length) {
            // Nếu đã trả lời hết tất cả câu hỏi sai => hiển thị màn hình kết quả
            return showResultScreen();
        } else {
            // Ngược lại, thiết lập phần tử của câu hỏi
            return setQuizElement();
        }
    }
}

window.onload = function () {
    loadEnGBVoice();
    loadAudio();
    checkVersion();
};

// Thêm sự kiện khi chọn câu trả lời
answerElements.forEach((aElement) => {
    aElement.addEventListener('click', () => {
        // lưu lại nội dung của câu trả lời được chọn
        selectedAnswer = aElement.querySelector('.card-text').innerText;

        // đọc nội dung câu trả lời được chọn
        textToSpeech(selectedAnswer);

        // xóa class selected cho tất cả các câu trả lời
        answerElements.forEach((a) => a.classList.remove('selected'));

        // thêm class selected cho câu trả lời được chọn
        aElement.classList.add('selected');

        // Bật nút submit
        submitButton.classList.remove('disabled');
    });

    aElement.addEventListener('mousedown', () => {
        aElement.classList.add('active');
    });

    aElement.addEventListener('mouseup', () => {
        aElement.classList.remove('active');
    });

    aElement.addEventListener('mouseleave', () => {
        setTimeout(function () {
            aElement.classList.remove('active');
        }, 300);
    });

    aElement.addEventListener('touchstart', () => {
        aElement.classList.add('active');
    });

    aElement.addEventListener('touchend', () => {
        aElement.classList.remove('active');
    });
});

// Thêm sự kiện khi click vào các nút button
buttons.forEach((bElement) => {
    bElement.addEventListener('mousedown', () => {
        bElement.classList.add('active');
    });

    bElement.addEventListener('mouseup', () => {
        bElement.classList.remove('active');
    });

    bElement.addEventListener('mouseleave', () => {
        setTimeout(function () {
            bElement.classList.remove('active');
        }, 300);
    });

    bElement.addEventListener('touchstart', () => {
        bElement.classList.add('active');
    });

    bElement.addEventListener('touchend', () => {
        bElement.classList.remove('active');
    });
});

// thêm sự kiện khi nhấn vào nút submit button
submitButton.addEventListener('click', function (event) {
    // Prevent page from reloading on submit
    event.preventDefault();

    // set kết quả vào ô result và chuẩn bị phát âm thanh
    if (selectedAnswer == currentQuiz.correctAnswer) {
        displayCorrectResult();
        playCorrectAudio();
    } else {
        displayWrongResult();
        playWrongAudio();

        textToSpeech(currentQuiz.correctAnswer);

        // Thêm vào câu sai
        wrongQuiz.addQuiz(currentQuiz.currentQuizObject);
        if (currentQuiz == wrongQuiz) {
            currentQuiz = wrongQuiz;
        }
    }

    setProgressBar();

    // Hiển thị kết quả
    resultOverlayElement.classList.remove('hidden');

    // Bật nút sang câu tiếp theo
    setTimeout(function () {
        nextButton.classList.remove('disabled');
    }, 200);

    // Tắt nút trả lời
    submitButton.classList.add('disabled');
});

// Add event listener for next button
nextButton.addEventListener('click', function (event) {
    event.preventDefault();

    resetCssElements();

    // Show next question
    currentQuiz.current += 1;
    checkMode();
});
