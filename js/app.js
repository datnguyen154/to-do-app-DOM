const $ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");
const tbody = document.createElement("tbody");
table.append(tbody);

const API_URL = "https://6a09ee7de7e3f433d4839895.mockapi.io/tasks";

function loadTasks() {
    fetch(API_URL)
        .then((response) => response.json())
        .then((tasks) => {
            let htmlContent = "";
            tasks.forEach((task, index) => {
                htmlContent += generateRow(task, index);
            });
            tbody.innerHTML = htmlContent;
        })
        .catch((error) => console.error("Error fetching tasks:", error));
}

function generateRow(task, index) {
    const isCompleted = task.completed === true || task.completed === "true";
    const textStyle = isCompleted
        ? "text-decoration: line-through; color: #888;"
        : "";
    return `
        <tr data-id="${task.id}">
            <td>${index + 1}</td>
            <td style="${textStyle}">${task.title}</td>
            <td class="action-cell"> 
                <button type="button" class="btn-action btn-done"> Done <span class="icon-box">✔</span> </button> 
                <button type="button" class="btn-action btn-edit" style="background-color: #ff9800;">Edit <span class="icon-box">✏️</span></button>
                <button type="button" class="btn-action btn-delete">Delete <span class="icon-box">✖</span></button>
            </td>
        </tr>
    `;
}

// CREATE:
btn.addEventListener("click", () => {
    const inputValue = input.value.trim();
    if (!inputValue) {
        alert("Input field cannot be empty");
        return;
    }

    const originalBtnText = btn.innerHTML;
    btn.innerHTML = "Adding...";
    btn.disabled = true;

    const newTask = {
        title: inputValue,
        completed: false,
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
    })
        .then((response) => response.json())
        .then((task) => {
            const currentIndex = tbody.children.length;
            tbody.insertAdjacentHTML(
                "beforeend",
                generateRow(task, currentIndex),
            );

            input.value = "";
            input.focus();
        })
        .catch((error) => console.error("Error creating task:", error))
        .finally(() => {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        });
});

//  UPDATE & DELETE
table.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    if (!row) return;

    const taskId = row.getAttribute("data-id");
    const taskContent = row.querySelectorAll("td")[1];

    // 1. XỬ LÝ NÚT DELETE
    const btnDelete = e.target.closest(".btn-delete");
    if (btnDelete) {
        row.remove();

        Array.from(tbody.children).forEach((tr, index) => {
            tr.querySelector("td:first-child").innerText = index + 1;
        });

        fetch(`${API_URL}/${taskId}`, { method: "DELETE" }).catch((err) =>
            console.error("Error deleting:", err),
        );
        return;
    }

    // 2. XỬ LÝ NÚT DONE
    const btnDone = e.target.closest(".btn-done");
    if (btnDone) {
        const isCurrentlyCompleted =
            taskContent.style.textDecoration.includes("line-through");
        const newStatus = !isCurrentlyCompleted;

        taskContent.style.textDecoration = newStatus ? "line-through" : "none";
        taskContent.style.color = newStatus ? "#888" : "inherit";

        fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newStatus }),
        }).catch((err) => console.error("Error updating status:", err));
        return;
    }

    // 3. XỬ LÝ NÚT EDIT / SAVE
    const btnEdit = e.target.closest(".btn-edit");
    if (btnEdit) {
        if (btnEdit.classList.contains("is-editing")) {
            const editInput = taskContent.querySelector("input");
            if (!editInput) return;

            const newValue = editInput.value.trim();
            if (!newValue) {
                alert("Task description cannot be empty!");
                return;
            }

            taskContent.innerHTML = newValue;

            btnEdit.classList.remove("is-editing");
            btnEdit.innerHTML = `Edit <span class="icon-box">✏️</span>`;
            btnEdit.style.backgroundColor = "#ff9800";

            fetch(`${API_URL}/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newValue }),
            }).catch((err) => console.error("Error saving title:", err));
        } else {
            const currentText = taskContent.innerText;
            taskContent.innerHTML = `<input type="text" class="edit-input" value="${currentText}" style="padding: 5px; font-size: 16px; width: 80%;">`;

            const editInput = taskContent.querySelector("input");
            editInput.focus();
            editInput.selectionStart = editInput.value.length;

            btnEdit.classList.add("is-editing");
            btnEdit.innerHTML = `Save <span class="icon-box">💾</span>`;
            btnEdit.style.backgroundColor = "#2196f3";

            editInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    btnEdit.click();
                }
            });
        }
    }
});

loadTasks();
