$ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");

function saveData() {
    localStorage.setItem("todoData", tbody.innerHTML);
}

function loadData() {
    const savedHTML = localStorage.getItem("todoData");

    if (savedHTML) {
        tbody.innerHTML = savedHTML;
        updateSerialNumbers();
    }
}

const tbody = document.createElement("tbody");
table.append(tbody);

let count = 0;

function updateSerialNumbers() {
    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row, index) => {
        const sttCell = row.querySelector("td");

        sttCell.innerText = index + 1;
    });

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
            <td class="action-cell"> 
                <button class="btn-action btn-done"> Done <span class="icon-box">✔</span> </button> 
                <button class="btn-action btn-edit" style="background-color: #ff9800;">Edit <span class="icon-box">✏️</span></button>
                <button class="btn-action btn-delete">Delete <span class="icon-box">✖</span></button>
            </td>
        </tr>
   `;
    tbody.insertAdjacentHTML("beforeend", newRow);
    input.value = "";
    input.focus();
    saveData();
});

table.addEventListener("click", function (e) {
    const btnDelete = e.target.closest(".btn-delete");
    const btnDone = e.target.closest(".btn-done");

    if (btnDelete) {
        const row = btnDelete.closest("tr");
        row.remove();

        updateSerialNumbers();
        saveData();
    }

    if (btnDone) {
        const row = btnDone.closest("tr");
        const taskContent = row.querySelectorAll("td")[1];

        taskContent.style.textDecoration = "line-through";
        taskContent.style.color = "#888";
        saveData();
    }

    const btnEdit = e.target.closest(".btn-edit");

    if (btnEdit) {
        const row = btnEdit.closest("tr");
        const taskContent = row.querySelectorAll("td")[1];

        if (btnEdit.classList.contains("is-editing")) {
            const editInput = taskContent.querySelector("input");
            const newValue = editInput.value.trim();

            if (newValue === "") {
                alert("Task description cannot be empty!");
                return;
            }

            taskContent.innerText = newValue;

            btnEdit.classList.remove("is-editing");
            btnEdit.innerHTML = `Edit <span class="icon-box">✏️</span>`;
            btnEdit.style.backgroundColor = "#ff9800";
        } else {
            const currentText = taskContent.innerText;

            taskContent.innerHTML = `<input type="text" class="edit-input" value="${currentText}" style="padding: 5px; font-size: 16px; width: 80%;">`;

            const editInput = taskContent.querySelector("input");
            editInput.focus();

            editInput.selectionStart = editInput.value.length;

            btnEdit.classList.add("is-editing");

            btnEdit.innerHTML = `Save <span class="icon-box">💾</span>`;
            btnEdit.style.backgroundColor = "#2196f3";

            editInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();

                    btnEdit.click();
                }
            });
        }
    }
});

loadData();
