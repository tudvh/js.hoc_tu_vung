const maxQuestion = 15;
let wrongAnswersCount;

// Lấy tất cả các câu hỏi từ file csv bằng cách sử dụng thư viện PapaParse để phân tích dữ liệu.
function getAllQuiz() {
    // Sử dụng fetch để lấy nội dung của file csv.
    return (
        fetch("public/csv/vocabulary.csv")
            // Sử dụng phương thức text để đọc dữ liệu của response.
            .then((response) => response.text())
            // Sử dụng Papa.parse để phân tích dữ liệu được đọc từ response.
            .then((data) =>
                Papa.parse(data, {
                    header: true,
                    delimiter: ",",
                    skipEmptyLines: true,
                })
            )
            // Trả về dữ liệu đã được phân tích bởi Papa.parse.
            .then((results) => results.data)
            // Nếu có lỗi, ném ra ngoại lệ để báo hiệu lỗi đến lớp gọi.
            .catch((error) => {
                throw error;
            })
    );
}

// Lấy danh sách các câu hỏi ít được sử dụng nhất.
function getLeastUsedQuizs(allQuiz, numQuiz) {
    // Lấy danh sách các câu hỏi đã được trả lời từ local storage.
    const answeredQuizs = JSON.parse(localStorage.getItem("answeredQuizs"));
    console.log(answeredQuizs);

    // Nếu danh sách câu hỏi đã được trả lời không tồn tại, trả về danh sách tất cả câu hỏi.
    if (!answeredQuizs) {
        console.log("Danh sách những câu hỏi mà bạn đã trả lời đang trống");
        return allQuiz;
    }

    // Tính số lần mỗi câu hỏi được trả lời và gán vào thuộc tính 'count'.
    const newQuiz = allQuiz.map((quiz) => {
        const aQuiz = answeredQuizs.find((a) => a.id === quiz.id);
        quiz.count = aQuiz ? parseInt(aQuiz.count) + 1 : 0;
        return quiz;
    });

    // Sắp xếp danh sách câu hỏi theo số lần được trả lời tăng dần.
    const sortedQuiz = newQuiz.sort((a, b) => a.count - b.count);

    // Lấy danh sách numQuiz câu hỏi ít được sử dụng nhất.
    const leastUsedQuiz = sortedQuiz.slice(0, numQuiz);

    console.log(leastUsedQuiz);

    return leastUsedQuiz;
}

// Viết hoa chữ cái đầu tiên của mỗi từ trong thuộc tính 'en' và 'vi' của tất cả các câu đố trong mảng đã cho
function capitalizeFirstLetterAllQuiz(allQuiz) {
    return allQuiz.map((quiz) => ({
        en: capitalizeFirstLetter(quiz.en),
        vi: capitalizeFirstLetter(quiz.vi),
    }));
}

// Lấy tất cả các câu trả lời từ một loạt các câu hỏi đã cho
function getAllAnswers(allQuiz) {
    const allAnswers = allQuiz.map((quiz) => quiz.en);
    return allAnswers;
}
