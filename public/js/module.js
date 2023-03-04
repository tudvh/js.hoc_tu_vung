function capitalizeFirstLetter(text) {
    // Chuyển ký tự đầu tiên thành chữ in hoa và nối vào phần còn lại của chuỗi
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getRandomElement(array) {
    // Tạo một chỉ số ngẫu nhiên và trả về phần tử tương ứng trong mảng
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function getRandomElements(array, count, excludedElements=[]) {
    // Lọc các phần tử trong mảng không nằm trong danh sách bị loại trừ
    const filteredArray = array.filter(
        (element) => !excludedElements.includes(element)
    );

    // Tạo một mảng mới chứa các phần tử ngẫu nhiên được chọn từ mảng đã lọc
    const randomElements = [];

    // Lặp lại việc chọn phần tử ngẫu nhiên cho đến khi đạt được số lượng mong muốn hoặc hết phần tử trong mảng đã lọc
    while (randomElements.length < count && filteredArray.length > 0) {
        const randomElement = getRandomElement(filteredArray);
        randomElements.push(randomElement);

        // Xóa phần tử đã chọn khỏi mảng đã lọc để tránh chọn trùng lặp
        const index = filteredArray.indexOf(randomElement);
        filteredArray.splice(index, 1);
    }

    return randomElements;
}

function shuffleArray(array) {
    // Sắp xếp mảng theo thứ tự ngẫu nhiên bằng cách so sánh hai số ngẫu nhiên
    array.sort(() => Math.random() - 0.5);
    return array;
}
