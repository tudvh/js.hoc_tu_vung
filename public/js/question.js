// Get the HTML element
const question_html = document.getElementById("question");
const load_html = document.querySelector(".load-wrapper");

// Initialize variables for the list of questions, the list of questions to be shown, and the current question number
let questions_all_obj = null;
let questions_show_obj = null;
let question_current = 0;

// Asynchronously fetch the list of question-answer pairs from a CSV file and parse it using the Papa.parse library
async function get_list_questionAnswer() {
    try {
        // show loader
        load_html.classList.remove("hidden");

        const response = await fetch("public/csv/vocabulary.csv");
        const data = await response.text();
        const results = await Papa.parse(data, {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
        });
        // set data
        questions_all_obj = results.data;
        questions_all_obj = capitalizeFirstLetterQA(questions_all_obj);

        questions_show_obj = choose_random_obj(questions_all_obj, 10);
        console.log(questions_show_obj);

        show_question(question_current);
    } catch (error) {
        console.error(error);
    }
}

// Display the current question and its corresponding answer choices
function show_question(index_q) {
    // show loader
    load_html.classList.remove("hidden");

    question_html.innerHTML = `<h1>Câu ${index_q + 1}</h1>
    <p>Trong tiếng Anh, từ <strong>${
        questions_show_obj[index_q].en
    }</strong> có nghĩa là gì?</p>`;

    show_answers(index_q);

    // hide loader
    setTimeout(function () {
        load_html.classList.add("hidden");
    }, 1000);
}

// Display the answer choices for the current question
function show_answers(index_q) {
    answer_text = get_answers(index_q);

    for (let i = 0; i < 4; i++) {
        answers[i].querySelector(".card-text").innerText = answer_text[i];
    }
}

// Get the answer choices for the current question by selecting a correct answer and three incorrect ones and shuffling them
function get_answers(index_q) {
    answer = [];
    // Choose three random incorrect answers and add them to the answer array
    questionAnswers_random = choose_random_obj(questions_all_obj, 3);
    questionAnswers_random.forEach((qa) => {
        if (qa.vi == get_correct_answer()) {
            return get_answers(index_q);
        } else {
            answer.push(qa.vi);
        }
    });
    // Add the correct answer to the answer array
    answer.push(get_correct_answer());
    // Shuffle the answer array
    answer = shuffleArray(answer);

    return answer;
}

function get_correct_answer() {
    return questions_show_obj[question_current].vi;
}
