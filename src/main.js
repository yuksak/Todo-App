const labelTime = document.querySelector(".header__time");
const labelDate = document.querySelector(".header__date");

const listsContainer = document.querySelector(".list__section");
const listsItem = document.querySelector(".list__item");
const newListForm = document.querySelector(".list__form");
const newListName = document.querySelector(".list__name");
const newListInput = document.querySelector(".list__input");
const deleteListButton = document.querySelector(".list__delete");

const todoContainer = document.querySelector(".todo");
const todoTitle = document.querySelector(".todo__title");
const newTaskForm = document.querySelector(".todo__form");
const newTaskInput = document.querySelector(".todo__input");
const todoCount = document.querySelector(".todo__count");
const todoTasks = document.querySelector(".todo__tasks");
const todoTask = document.querySelector(".todo__task");
const clearTasksBtn = document.querySelector(".btn__delete");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

/////////////////// Time & date ////////////////
function timeDate() {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`;
  const monthSt = now.toLocaleString("en-US", { month: "long" });

  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  const sec = `${now.getSeconds()}`.padStart(2, 0);

  labelDate.textContent = `${day} ${monthSt}(${month}) ${year}`;
  labelTime.textContent = `${hour}:${min}:${sec}`;
  setTimeout(timeDate, 1000);
}
timeDate();
/////////////////// Time & date ////////////////

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

todoTasks.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearTasksBtn.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener("click", () => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

if (selectedListId === "") {
  todoContainer.style.display = "none";
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId === null) {
    todoContainer.style.display = "none";
  } else {
    todoContainer.style.display = "";
    todoTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(todoTasks);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const todoTask = `
          <div class="todo__task">
            <input type="checkbox" id="${task.id}" ${
      task.complete ? `checked="${task.complete}"` : ""
    }/>

            <label for="${task.id}">
              ${task.name}
              <span class="custom-checkbox"></span>
              <span class="task-completed">Completed</span>
            </label>
          </div>`;
    todoTasks.insertAdjacentHTML("beforeend", todoTask);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  todoCount.innerText = `${incompleteTaskCount} ${
    incompleteTaskCount === 1 ? "task" : "tasks"
  } remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = `
    <div class="list__item">
      <li class="list__name ${
        list.id === selectedListId ? "list__name--active" : ""
      }" data-list-id="${list.id}">${list.name}</li>
      <button class="list__delete ${
        list.id === selectedListId ? "" : "hide"
      }"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10.5" width="10" height="1.5"/></button>
    </div>`;
    listsContainer.insertAdjacentHTML("beforeend", listElement);
  });
}

{
  /* <button class="list__delete ${
          list.id === selectedListId ? "" : "hide"
        }"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        <rect x="6" y="10.5" width="10" height="1.5"/>
        </svg></button> */
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
