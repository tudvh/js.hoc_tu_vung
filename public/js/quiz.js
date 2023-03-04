const maxQuestion = 15;
let wrongAnswersCount;

// Lấy toàn bộ bộ câu hỏi từ file CSV và trả về Promise
function getAllQuiz() {
    return new Promise((resolve, reject) => {
        fetch("public/csv/vocabulary.csv")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                Papa.parse(data, {
                    header: true,
                    delimiter: ",",
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve(results.data);
                    },
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Viết hoa chữ cái đầu cho các từ trong bộ câu hỏi
function capitalizeFirstLetterAllQuiz(allQuiz) {
    allQuiz.forEach((quiz) => {
        quiz.en = capitalizeFirstLetter(quiz.en);
        quiz.vi = capitalizeFirstLetter(quiz.vi);
    });
    return allQuiz;
}

// Lấy toàn bộ các câu trả lời từ bộ câu hỏi
function getAllAnswers(allQuiz) {
    const allAnswers = allQuiz.map((quiz) => quiz.en);
    return allAnswers;
}
