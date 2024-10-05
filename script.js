const newTodoInput = document.getElementById('newTodo');
const addTodoButton = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

function addTodo() {
  const todoText = newTodoInput.value.trim();
  if (todoText !== '') {
    const newTodoItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', deleteTodo);

    editButton.textContent = '✏️'; // Pencil icon
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', editTodo); // Add event listener for edit

    newTodoItem.textContent = todoText;
    newTodoItem.appendChild(editButton);
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

function editTodo(event) {
  const todoItem = event.target.parentNode;
  const todoText = todoItem.textContent.replace('x', '').replace('✏️', '').trim();
  const newText = prompt("Edit todo:", todoText);
  if (newText !== null && newText.trim() !== "") {
    todoItem.textContent = newText;
    saveTodoList();
  }
}


function toggleComplete(event) {
  if (!event.target.classList.contains('delete-button') && !event.target.classList.contains('edit-button')) {
    event.target.classList.toggle('completed');
    saveTodoList();
  }
}

function saveTodoList() {
  const todos = Array.from(todoList.children).map(li => li.textContent.replace('x', '').replace('✏️', '').trim());
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodoList() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach(todo => {
      const newTodoItem = document.createElement('li');
      const deleteButton = document.createElement('button');
      const editButton = document.createElement('button');

      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', deleteTodo);

      editButton.textContent = '✏️';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', editTodo);

      newTodoItem.textContent = todo;
      newTodoItem.appendChild(editButton);
      newTodoItem.appendChild(deleteButton);
      newTodoItem.addEventListener('click', toggleComplete);
      todoList.appendChild(newTodoItem);
    });
  }
}

addTodoButton.addEventListener('click', addTodo);
loadTodoList();
