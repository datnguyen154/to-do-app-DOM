$ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");

const tbody = document.createElement("tbody");
table.append(tbody);

let count = 0;

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
    }

    if (btnDone) {
        const row = btnDone.closest("tr");
        const taskContent = row.querySelectorAll("td")[1];

        taskContent.style.textDecoration = "line-through";
        taskContent.style.color = "#888";
    }
});
