const maxQuestion = 5;
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

function getLeastUsedQuizs(allQuiz, numQuiz) {
    answeredQuizs = JSON.parse(localStorage.getItem("answeredQuizs"));
    console.log(answeredQuizs)

    if (answeredQuizs) {
        let newQuiz = allQuiz.map((quiz) => {
            const answeredQuiz = answeredQuizs.find((a) => a.id === quiz.id);

            if (answeredQuiz) {
                quiz.count = parseInt(answeredQuiz.count) + 1;
            } else {
                quiz.count = 0;
            }

            return quiz;
        });

        let sortedQuiz = newQuiz.sort((a, b) => a.count - b.count);

        let leastUsedQuiz = sortedQuiz.slice(0, numQuiz);

        console.log(leastUsedQuiz);

        return leastUsedQuiz;
    } else {
        console.log("khong co cau hoi");
        return allQuiz;
    }
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
