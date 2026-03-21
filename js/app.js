$ = document.querySelector.bind(document);

const btn = $("#btn");
const input = $("#input");
const table = $("#table");

let count = 0;

btn.addEventListener("click", () => {
    let inputValue = input.value.trim();

    if (inputValue === "") {
        alert("Input filed cannot be empty");
        return;
    }
    count++;

    const tbody = document.createElement("tbody");

    tbody.innerHTML = `
        <tr>
            <td>${count}</td>
            <td>${inputValue}</td>
            <td> <button id="delete" class="btn-action btn-delete">Delete <span class="icon-box">✖</span></button>
                 <button id="done" class="btn-action btn-done"> Done <span class="icon-box">✔</span> </button> 
            </td>
        </tr>
   `;
    table.append(tbody);
    input.value = "";
});
