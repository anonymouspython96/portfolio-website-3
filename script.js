document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("add-task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const taskFooter = document.getElementById("task-footer");
  const taskCount = document.getElementById("task-count");
  const filtersContainer = document.getElementById("filters");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  const currentDateEl = document.getElementById("current-date");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    if (tasks.length === 0) {
      taskList.innerHTML = `<li class="text-center text-stone-400 p-4">Your task list is empty.</li>`;
      taskFooter.classList.add("hidden");
      return;
    }

    if (filteredTasks.length === 0 && tasks.length > 0) {
      let message = "No tasks here. Keep going!";
      if (currentFilter === "active")
        message = "Great job! All tasks completed.";
      if (currentFilter === "completed") message = "No completed tasks yet.";
      taskList.innerHTML = `<li class="text-center text-stone-400 p-4">${message}</li>`;
    }

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item flex items-center justify-between p-3 rounded-lg bg-stone-50/70 group ${
        task.completed ? "completed" : ""
      }`;
      li.dataset.id = task.id;

      li.innerHTML = `
                        <div class="flex items-center gap-3">
                            <input type="checkbox" class="custom-checkbox" ${
                              task.completed ? "checked" : ""
                            }>
                            <span class="task-text text-stone-700">${
                              task.text
                            }</span>
                        </div>
                        <button class="delete-btn text-stone-400 hover:text-red-500 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    `;
      taskList.appendChild(li);
    });

    updateFooter();
  };

  const updateFooter = () => {
    const activeTasksCount = tasks.filter((task) => !task.completed).length;
    taskCount.textContent = `${activeTasksCount} item${
      activeTasksCount !== 1 ? "s" : ""
    } left`;

    const completedTasksCount = tasks.length - activeTasksCount;
    clearCompletedBtn.style.visibility =
      completedTasksCount > 0 ? "visible" : "hidden";

    if (tasks.length > 0) {
      taskFooter.classList.remove("hidden");
    } else {
      taskFooter.classList.add("hidden");
    }
  };

  const addTask = (text) => {
    if (text.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  };

  const deleteTask = (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  };

  const updateFilterButtons = () => {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = "";
  });

  taskList.addEventListener("click", (e) => {
    const target = e.target;
    const parentLi = target.closest("li.task-item");
    if (!parentLi) return;

    const taskId = Number(parentLi.dataset.id);

    if (target.type === "checkbox") {
      toggleTask(taskId);
    } else if (target.closest(".delete-btn")) {
      deleteTask(taskId);
    }
  });

  filtersContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentFilter = e.target.dataset.filter;
      updateFilterButtons();
      renderTasks();
    }
  });

  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  });

  const setDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    currentDateEl.textContent = today.toLocaleDateString("en-US", options);
  };

  setDate();
  renderTasks();
  updateFilterButtons();
});
