const maxQuestion = 15;
let wrongAnswersCount;

// Lấy tất cả các câu hỏi từ file csv bằng cách sử dụng thư viện PapaParse để phân tích dữ liệu.
function getAllQuiz() {
    // Sử dụng fetch để lấy nội dung của file csv.
    return (
        fetch("https://dangtus.github.io/store/js.hoc_tu_vung/vocabulary.csv")
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

// Hàm getLeastUsedQuizs nhận vào danh sách tất cả các câu hỏi và số lượng câu hỏi muốn trả về.
// Nó trả về một mảng mới chứa 'numQuiz' câu hỏi được sắp xếp theo số lần trả lời ít nhất.
// Nếu danh sách các câu hỏi đã trả lời là trống, nó trả về danh sách tất cả các câu hỏi.
function getLeastUsedQuizs(allQuiz, numQuiz) {
    // Lấy danh sách các câu hỏi đã trả lời từ localStorage
    answeredQuizs = JSON.parse(localStorage.getItem("answeredQuizs"));
    console.log("Danh sách những câu hỏi đã trả lời", answeredQuizs);

    // Nếu danh sách câu hỏi đã trả lời rỗng, hiển thị thông báo và trả về danh sách tất cả các câu hỏi.
    if (!answeredQuizs) {
        console.log("Danh sách những câu hỏi đã trả lời của bạn đang trống");
        return allQuiz;
    }

    // Tạo một bản sao mới của danh sách tất cả các câu hỏi và gán số lần trả lời tương ứng cho mỗi câu hỏi.
    let newQuiz = JSON.parse(JSON.stringify(allQuiz));
    newQuiz = newQuiz.map((quiz) => {
        const aQuiz = answeredQuizs.find((a) => a.id === quiz.id);
        quiz.count = aQuiz ? aQuiz.count : 0;
        return quiz;
    });

    // Sắp xếp danh sách mới theo số lần trả lời ít nhất và trả về 'numQuiz' câu hỏi đầu tiên.
    return newQuiz.sort((a, b) => a.count - b.count).slice(0, numQuiz);
}

// Viết hoa chữ cái đầu tiên của mỗi từ trong thuộc tính 'en' và 'vi' của tất cả các câu đố trong mảng đã cho
function capitalizeFirstLetterAllQuiz(allQuiz) {
    return allQuiz.map((quiz) => ({
        id: quiz.id,
        en: capitalizeFirstLetter(quiz.en),
        vi: capitalizeFirstLetter(quiz.vi),
    }));
}

// Lấy tất cả các câu trả lời từ một loạt các câu hỏi đã cho
function getAllAnswers(allQuiz) {
    const allAnswers = allQuiz.map((quiz) => quiz.en);
    return allAnswers;
}
