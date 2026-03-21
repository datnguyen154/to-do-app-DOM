$ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");

const tbody = document.createElement("tbody");
table.append(tbody);

let count = 0;

function updateSerialNumbers() {
    // 1. Lấy tất cả các thẻ <tr> đang có trong tbody
    const rows = tbody.querySelectorAll("tr");

    // 2. Lặp qua từng thẻ <tr> để đánh lại số
    rows.forEach((row, index) => {
        // Tìm ô <td> đầu tiên (chứa số thứ tự)
        const sttCell = row.querySelector("td");

        // Mảng bắt đầu từ 0, nên STT hiển thị phải là index + 1
        sttCell.innerText = index + 1;
    });

    // 3. Cập nhật lại biến count bằng đúng số lượng task hiện tại
    // Nếu xóa hết sạch, rows.length = 0 => count về 0. Task tiếp theo sẽ là 1.
    count = rows.length;
}

btn.addEventListener("click", () => {
    let inputValue = input.value.trim();

    if (inputValue === "") {
        alert("Input filed cannot be empty");
        return;
    }
    count++;

    const newRow = `
        <tr>
            <td>${count}</td>
            <td>${inputValue}</td>
            <td> 
                 <button class="btn-action btn-delete">Delete <span class="icon-box">✖</span></button>
                 <button class="btn-action btn-done"> Done <span class="icon-box">✔</span> </button> 
            </td>
        </tr>
   `;
    tbody.insertAdjacentHTML("beforeend", newRow);
    input.value = "";
    input.focus();
});

table.addEventListener("click", function (e) {
    const btnDelete = e.target.closest(".btn-delete");
    const btnDone = e.target.closest(".btn-done");

    if (btnDelete) {
        const row = btnDelete.closest("tr");
        row.remove();

        updateSerialNumbers();
    }

    if (btnDone) {
        const row = btnDone.closest("tr");
        const taskContent = row.querySelectorAll("td")[1];

        taskContent.style.textDecoration = "line-through";
        taskContent.style.color = "#888";
    }
});
