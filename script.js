const newTodoInput = document.getElementById('newTodo');
const addTodoButton = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

function addTodo() {
  const todoText = newTodoInput.value.trim();
  if (todoText !== '') {
    const newTodoItem = document.createElement('li');
    newTodoItem.textContent = todoText;
    newTodoItem.addEventListener('click', toggleComplete);
    todoList.appendChild(newTodoItem);
    newTodoInput.value = '';
    saveTodoList();
  }
}

function toggleComplete(event) {
  event.target.classList.toggle('completed');
  saveTodoList();
}

function saveTodoList() {
  const todos = Array.from(todoList.children).map(li => li.textContent);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodoList() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach(todo => {
      const newTodoItem = document.createElement('li');
      newTodoItem.textContent = todo;
      newTodoItem.addEventListener('click', toggleComplete);
      todoList.appendChild(newTodoItem);
    });
  }
}

addTodoButton.addEventListener('click', addTodo);
loadTodoList();
