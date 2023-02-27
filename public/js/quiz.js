// Khởi tạo các biến
let listQuiz = null;
let listWrongQuiz = [];
let currentLearningMode = null;
let listAnswer = null;
let currentQuestion = 0;
let currentWrongQuestion = 0;
let maxQuestion = 10;

// Lấy đồng bộ danh sách các cặp câu hỏi-trả lời từ một tệp CSV và phân tích cú pháp nó sử dụng thư viện Papa.parse
async function getListQuiz() {
    try {
        // Lấy tất cả câu hỏi
        const response = await fetch("public/csv/vocabulary.csv");
        const data = await response.text();
        const results = await Papa.parse(data, {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
        });
        allQuiz = results.data;
        // Viết hoa chữ cái đầu cho câu hỏi và câu trả lời
        allQuiz = capitalizeFirstLetterQA(allQuiz);

        // Chọn ngẫu nhiên 10 câu hỏi cho bài học
        listQuiz = chooseRandomObj(allQuiz, maxQuestion);
        currentLearningMode = listQuiz;
        console.log(listQuiz);

        // Lấy tất cả câu trả lời
        listAnswer = getListAnswer(allQuiz);

        checkMode();
    } catch (error) {
        console.error(error);
    }
}

// Kiểm tra chế độ học tập và hiển thị các màn hình tương ứng
function checkMode() {
    // Nếu đang ở chế độ học
    if (currentLearningMode == listQuiz) {
        // Nếu đã trả lời đủ số lượng câu hỏi tối đa
        if (currentQuestion + 1 > maxQuestion) {
            // Nếu không có câu trả lời nào sai
            if (listWrongQuiz.length == 0) {
                showResultScreen(); // Hiển thị màn hình kết quả
            } else {
                showRetryScreen(); // Hiển thị màn hình chuẩn bị trả lời lại những câu hỏi sai
            }
        } else {
            showCurrentQuiz(); // Hiển thị câu hỏi tiếp theo
        }
        // Nếu đang ở chế độ trả lời lại các câu hỏi sai
    } else if (currentLearningMode == listWrongQuiz) {
        // Nếu đã trả lời quá số lượng câu hỏi sai tối đa
        if (currentWrongQuestion > maxQuestion * 1.5) {
            // Chuyển hướng về trang chủ
            location.href = ".";

            // Nếu đã trả lời đủ số lượng câu hỏi sai
        } else if (currentWrongQuestion + 1 > listWrongQuiz.length) {
            showResultScreen(); // Hiển thị màn hình kết quả
        } else {
            showCurrentQuiz(); // Hiển thị câu hỏi tiếp theo
        }
    }
}

// Hiển thị câu hỏi và phương án trả lời hiện tại
function showCurrentQuiz() {
    showLoading();

    showCurrentQuestion();
    showCurrentAnswers();

    setTimeout(function () {
        hideLoading();
    }, 1000);
}

// Hiển thị câu hỏi hiện tại
function showCurrentQuestion() {
    questionElement.innerHTML = getCurrentQuestion();
}

// Lấy câu hỏi hiện tại
function getCurrentQuestion() {
    return `<h1>${getQuestionHeader()}</h1><p>${getQuestionText()}</p>`;
}

// Lấy phần header của câu hỏi hiện tại
function getQuestionHeader() {
    if (currentLearningMode == listQuiz) {
        return `Câu ${currentQuestion + 1}: `;
    } else if (currentLearningMode == listWrongQuiz) {
        return "Câu sai trước đây: ";
    } else {
        return null;
    }
}

// Lấy phần nội dung của câu hỏi hiện tại
function getQuestionText() {
    if (currentLearningMode == listQuiz) {
        return `Trong tiếng Anh, từ <strong>${currentLearningMode[currentQuestion].vi}</strong> có nghĩa là gì?`;
    } else if (currentLearningMode == listWrongQuiz) {
        return `Trong tiếng Anh, từ <strong>${currentLearningMode[currentWrongQuestion].vi}</strong> có nghĩa là gì?`;
    } else {
        return null;
    }
}

// Hiển thị các phương án trả lời cho câu hỏi hiện tại.
function showCurrentAnswers() {
    const quizAnswers = getCurrentAnswers();

    for (let i = 0; i < 4; i++) {
        answerElements[i].querySelector(".card-text").innerText =
            quizAnswers[i];
    }
}

// Lấy các phương án trả lời cho câu hỏi hiện tại bằng cách chọn một đáp án đúng và ba đáp án sai và xáo trộn chúng.
function getCurrentAnswers() {
    const answers = [];

    // Thêm 3 đáp án sai từ listAnswer
    answers.push(...chooseRandomArr(listAnswer, 3, getCorrectAnswer()));

    // Thêm đáp án đúng
    answers.push(getCorrectAnswer());

    // Xáo trộn mảng đáp án
    shuffleArr(answers);

    return answers;
}

// Lấy câu trả lời chính xác cho câu hỏi hiện tại.
function getCorrectAnswer() {
    if (currentLearningMode == listQuiz) {
        return currentLearningMode[currentQuestion].en;
    } else if (currentLearningMode == listWrongQuiz) {
        return currentLearningMode[currentWrongQuestion].en;
    } else {
        return null;
    }
}

// Lấy danh sách tất cả các câu trả lời từ một mảng chứa các đối tượng câu hỏi.
function getListAnswer(allQuiz) {
    let listAnswer = [];
    allQuiz.forEach((quiz) => {
        listAnswer.push(quiz.en);
    });
    return listAnswer;
}
