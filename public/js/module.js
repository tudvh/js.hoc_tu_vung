// Hàm này được sử dụng để viết hoa chữ cái đầu tiên của một chuỗi
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Hàm này được sử dụng để lấy ngẫu nhiên một phần tử trong một mảng
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// Lấy ngẫu nhiên một số phần tử từ một mảng.
function getRandomElements(array, count, excludedElements = []) {
    // Lọc các phần tử không bị loại bỏ khỏi danh sách đầu vào.
    const filteredArray = array.filter(
        (element) => !excludedElements.includes(element)
    );

    // Mảng chứa các phần tử được lấy ngẫu nhiên.
    const randomElements = [];

    // Lấy ngẫu nhiên các phần tử từ mảng đã lọc.
    for (let i = 0; i < count && filteredArray.length > 0; i++) {
        // Chọn ngẫu nhiên một chỉ số từ mảng đã lọc.
        const randomIndex = Math.floor(Math.random() * filteredArray.length);

        // Lấy phần tử tại chỉ số ngẫu nhiên đã chọn.
        const randomElement = filteredArray[randomIndex];

        // Thêm phần tử đã lấy vào mảng chứa kết quả.
        randomElements.push(randomElement);

        // Xóa phần tử đã lấy khỏi mảng đã lọc.
        filteredArray.splice(randomIndex, 1);
    }

    // Trả về mảng chứa các phần tử được lấy ngẫu nhiên.
    return randomElements;
}

// Trộn ngẫu nhiên một mảng.
function shuffleArray(array) {
    // Tạo ra một bản sao của mảng đầu vào.
    const newArray = [...array];

    // Sử dụng thuật toán Fisher-Yates để trộn ngẫu nhiên mảng.
    for (let i = newArray.length - 1; i > 0; i--) {
        // Chọn một phần tử ngẫu nhiên từ mảng không trộn.
        const j = Math.floor(Math.random() * (i + 1));

        // Hoán đổi phần tử thứ i và j trong mảng.
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    // Trả về mảng sau khi được trộn ngẫu nhiên.
    return newArray;
}

// Hàm để mở hoặc đóng chế độ toàn màn hình trên trang
function toggleFullscreen() {
    // Lấy phần tử HTML chính của trang
    const elem = document.documentElement;

    // Nếu trang không đang ở chế độ toàn màn hình
    if (
        !document.fullscreenElement && // Standard syntax
        !document.webkitFullscreenElement && // Chrome, Safari and Opera syntax
        !document.msFullscreenElement // IE/Edge syntax
    ) {
        // Yêu cầu chuyển sang chế độ toàn màn hình
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        // Nếu trang đang ở chế độ toàn màn hình
        // Yêu cầu thoát khỏi chế độ toàn màn hình
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
