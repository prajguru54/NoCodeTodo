const newTodoInput = document.getElementById('newTodo');
const addTodoButton = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

function addTodo() {
  const todoText = newTodoInput.value.trim();
  if (todoText !== '') {
    const newTodoItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', deleteTodo);
    newTodoItem.textContent = todoText;
    newTodoItem.appendChild(deleteButton);
    newTodoItem.addEventListener('click', toggleComplete);
    todoList.appendChild(newTodoItem);
    newTodoInput.value = '';
    saveTodoList();
  }
}

function deleteTodo(event) {
  const todoItem = event.target.parentNode;
  todoList.removeChild(todoItem);
  saveTodoList();
}

function toggleComplete(event) {
  if (!event.target.classList.contains('delete-button')) { // Prevent toggling on button click
    event.target.classList.toggle('completed');
    saveTodoList();
  }
}

function saveTodoList() {
  const todos = Array.from(todoList.children).map(li => li.textContent.split('x')[0].trim()); //Updated to handle delete button text
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodoList() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach(todo => {
      const newTodoItem = document.createElement('li');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', deleteTodo);
      newTodoItem.textContent = todo;
      newTodoItem.appendChild(deleteButton);
      newTodoItem.addEventListener('click', toggleComplete);
      todoList.appendChild(newTodoItem);
    });
  }
}

addTodoButton.addEventListener('click', addTodo);
loadTodoList();
