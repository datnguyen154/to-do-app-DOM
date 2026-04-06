const $ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");
const tbody = document.createElement("tbody");
table.append(tbody);

const API_URL = "http://localhost:3000/tasks";

// --- READ: Fetch and render tasks ---
function loadTasks() {
    fetch(API_URL)
        .then((response) => response.json())
        .then((tasks) => {
            let htmlContent = "";

            tasks.forEach((task, index) => {
                const textStyle = task.completed
                    ? "text-decoration: line-through; color: #888;"
                    : "";

                htmlContent += `
                    <tr data-id="${task.id}">
                        <td>${index + 1}</td>
                        <td style="${textStyle}">${task.title}</td>
                        <td class="action-cell"> 
                            <button class="btn-action btn-done"> Done <span class="icon-box">✔</span> </button> 
                            <button class="btn-action btn-edit" style="background-color: #ff9800;">Edit <span class="icon-box">✏️</span></button>
                            <button class="btn-action btn-delete">Delete <span class="icon-box">✖</span></button>
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = htmlContent;
        })
        .catch((error) => console.error("Error fetching tasks:", error));
}

// --- CREATE: Add a new task ---
btn.addEventListener("click", () => {
    const inputValue = input.value.trim();

    if (!inputValue) {
        alert("Input field cannot be empty");
        return;
    }

    const newTask = {
        title: inputValue,
        completed: false,
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    })
        .then(() => {
            input.value = "";
            input.focus();
            loadTasks();
        })
        .catch((error) => console.error("Error creating task:", error));
});

// --- UPDATE & DELETE ---
// Using Event Delegation on the table to handle dynamically generated buttons
table.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    if (!row) return;

    const taskId = row.getAttribute("data-id");

    // Handle Delete
    const btnDelete = e.target.closest(".btn-delete");
    if (btnDelete) {
        fetch(`${API_URL}/${taskId}`, {
            method: "DELETE",
        })
            .then(() => loadTasks())
            .catch((error) => console.error("Error deleting task:", error));
    }

    // Handle Toggle Completed Status (PATCH)
    const btnDone = e.target.closest(".btn-done");
    if (btnDone) {
        const isCurrentlyCompleted =
            row.querySelector("td:nth-child(2)").style.textDecoration ===
            "line-through";

        fetch(`${API_URL}/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !isCurrentlyCompleted }),
        })
            .then(() => loadTasks())
            .catch((error) => console.error("Error updating status:", error));
    }

    // Handle Edit Task Title (PATCH)
    const btnEdit = e.target.closest(".btn-edit");
    if (btnEdit) {
        const taskContent = row.querySelectorAll("td")[1];

        if (btnEdit.classList.contains("is-editing")) {
            // Save mode
            const editInput = taskContent.querySelector("input");
            const newValue = editInput.value.trim();

            if (!newValue) {
                alert("Task description cannot be empty!");
                return;
            }

            fetch(`${API_URL}/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newValue }),
            })
                .then(() => loadTasks())
                .catch((error) =>
                    console.error("Error updating title:", error),
                );
        } else {
            // Edit mode
            const currentText = taskContent.innerText;
            taskContent.innerHTML = `<input type="text" class="edit-input" value="${currentText}" style="padding: 5px; font-size: 16px; width: 80%;">`;

            const editInput = taskContent.querySelector("input");
            editInput.focus();
            // Move cursor to the end of the text
            editInput.selectionStart = editInput.value.length;

            btnEdit.classList.add("is-editing");
            btnEdit.innerHTML = `Save <span class="icon-box">💾</span>`;
            btnEdit.style.backgroundColor = "#2196f3";

            // Allow saving by pressing Enter key
            editInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    btnEdit.click();
                }
            });
        }
    }
});

// Initialize app
loadTasks();
