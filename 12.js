const list = document.querySelector(".list");
const input = document.querySelector(".add-input");
const addBtn = document.querySelector(".create-btn");
const buttons = document.querySelectorAll(".buttons button");
const summary = document.querySelector(".summary");
const clearBtn = document.querySelector(".clear-btn");

let content = [];
let type = "All";
let id = 1;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const listItem = (item) => {
  return `
    <div class="item ${item.isDone ? "completed" : ""}" data-id="${item.id}">
      <input class="checkbox" type="checkbox" data-id="${item.id}" ${item.isDone ? "checked" : ""} />
      <p>${escapeHtml(item.text)}</p>
      <button class="delete-btn" data-id="${item.id}">Delete</button>
    </div>
  `;
};

const updateSummary = () => {
  const doneCount = content.filter((item) => item.isDone).length;
  summary.textContent = `${doneCount} of ${content.length} tasks completed`;
};

const filteredItems = () => {
  if (type === "Active") return content.filter((item) => !item.isDone);
  if (type === "Completed") return content.filter((item) => item.isDone);
  return content;
};

const render = () => {
  const items = filteredItems();

  if (items.length === 0) {
    list.innerHTML = '<p class="empty">No tasks yet. Add one above!</p>';
  } else {
    list.innerHTML = items.map((item) => listItem(item)).join("");
  }

  updateSummary();
};

const addItem = () => {
  const text = input.value.trim();
  if (!text) return;

  content.push({
    id: id++,
    text,
    isDone: false,
  });

  input.value = "";
  render();
};

addBtn.addEventListener("click", addItem);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addItem();
});

buttons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("chosen"));
    btn.classList.add("chosen");

    if (i === 0) type = "All";
    else if (i === 1) type = "Active";
    else type = "Completed";

    render();
  });
});

list.addEventListener("click", (event) => {
  const target = event.target;
  const targetId = Number(target.dataset.id);
  if (!targetId) return;

  if (target.classList.contains("delete-btn")) {
    content = content.filter((item) => item.id !== targetId);
    render();
  }

  if (target.classList.contains("checkbox")) {
    content = content.map((item) =>
      item.id === targetId ? { ...item, isDone: !item.isDone } : item
    );
    render();
  }
});

clearBtn.addEventListener("click", () => {
  content = content.filter((item) => !item.isDone);
  render();
});

render();
