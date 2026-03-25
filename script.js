const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filter = document.getElementById('filter');
const emptyState = document.getElementById('empty-state');
const clearDoneButton = document.getElementById('clear-done');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const selectedFilter = filter.value;
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === 'pending') return !task.done;
    if (selectedFilter === 'done') return task.done;
    return true;
  });

  emptyState.style.display = filteredTasks.length ? 'none' : 'block';

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : ''}`;

    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} aria-label="Concluir tarefa" />
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="secondary edit-btn">Editar</button>
        <button class="secondary delete-btn">Excluir</button>
      </div>
    `;

    const checkbox = li.querySelector('input');
    const editButton = li.querySelector('.edit-btn');
    const deleteButton = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    editButton.addEventListener('click', () => {
      const newText = prompt('Edite sua tarefa:', task.text);
      if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    done: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
});

filter.addEventListener('change', renderTasks);

clearDoneButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();
