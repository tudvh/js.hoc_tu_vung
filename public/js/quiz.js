const maxQuestion = 10;

// Hàm lấy tất cả các câu hỏi từ file vocabulary.csv
async function getAllQuiz() {
    try {
        const response = await fetch('https://tudvh.github.io/store/js.hoc_tu_vung/vocabulary.csv');
        const data = await response.text();
        const results = Papa.parse(data, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
        });
        return results.data;
    } catch (error) {
        throw error;
    }
}

// Hàm lấy danh sách các câu hỏi ít được trả lời nhất
function getLeastUsedQuizs(allQuiz, numQuiz) {
    // Lấy danh sách các câu hỏi đã được trả lời từ localStorage
    answeredQuizs = JSON.parse(localStorage.getItem('answeredQuizs') || '[]');
    console.log('Danh sách những câu hỏi đã trả lời', answeredQuizs);

    // Nếu danh sách trả lời rỗng thì trả về toàn bộ danh sách câu hỏi
    if (!answeredQuizs) {
        console.log('Danh sách những câu hỏi đã trả lời của bạn đang trống');
        return allQuiz;
    }

    // Thêm số lần câu hỏi đã được trả lời vào từng câu hỏi
    newQuiz = allQuiz.map((quiz) => {
        const aQuiz = answeredQuizs.find((a) => a.id === quiz.id);
        count = aQuiz ? aQuiz.count : 0;
        return {
            ...quiz,
            count,
        };
    });

    // Sắp xếp và trả về numQuiz câu hỏi ít được trả lời nhất
    return newQuiz.sort((a, b) => a.count - b.count).slice(0, numQuiz);
}

// Hàm viết hoa chữ cái đầu tiên của từ trong câu hỏi
function capitalizeFirstLetterAllQuiz(allQuiz) {
    return allQuiz.map((quiz) => ({
        id: quiz.id,
        en: capitalizeFirstLetter(quiz.en),
        vi: capitalizeFirstLetter(quiz.vi),
    }));
}

// Hàm lấy tất cả các đáp án từ danh sách câu hỏi
function getAllAnswers(allQuiz) {
    return allQuiz.map((quiz) => quiz.en);
}
