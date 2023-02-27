// Viết hoa chữ cái đầu của mỗi từ trong bộ câu hỏi
function capitalizeFirstLetterQA(allQA) {
    allQA.forEach((qa) => {
        qa.en = qa.en.charAt(0).toUpperCase() + qa.en.slice(1);
        qa.vi = qa.vi.charAt(0).toUpperCase() + qa.vi.slice(1);
    });

    return allQA;
}

// Chọn ngẫu nhiên một số đối tượng từ một mảng đối tượng
function chooseRandomObj(obj, count) {
    const keys = Object.keys(obj);
    const randomKeys = keys.sort(() => Math.random() - 0.5).slice(0, count);
    const randomValues = randomKeys.map((key) => obj[key]);
    return randomValues;
}

// Chọn các phần tử ngẫu nhiên từ một mảng
function chooseRandomArr(arr, count, excludedElement) {
    const chosenIndexes = new Set();
    while (chosenIndexes.size < count) {
        let index = Math.floor(Math.random() * arr.length);
        if (arr[index] === excludedElement) {
            continue;
        }
        chosenIndexes.add(index);
    }
    return Array.from(chosenIndexes).map((index) => arr[index]);
}

// Xáo trộn một mảng ngẫu nhiên
function shuffleArr(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Xáo trộn một đối tượng ngẫu nhiên
function shuffleObj(obj) {
    const shuffledKeys = Object.keys(obj).sort(() => Math.random() - 0.5);
    const shuffledObject = {};
    shuffledKeys.forEach((key) => (shuffledObject[key] = obj[key]));
    return shuffledObject;
}
