const BACKEND_PORT = 8003; // Define the backend port as a constant
const newTodoInput = document.getElementById("newTodo");
const addTodoButton = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");

async function addTodo() {
    const todoText = newTodoInput.value.trim();
    if (todoText !== "") {
        try {
            const response = await fetch(
                `http://localhost:${BACKEND_PORT}/todos/`,
                {
                    // Use the constant here
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: todoText }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newTodo = await response.json();
            console.log(`Rendered from Add`);
            renderTodo(newTodo);
            newTodoInput.value = "";
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(
            `http://localhost:${BACKEND_PORT}/todos/${id}`,
            {
                // Use the constant here
                method: "DELETE",
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Delete Todo Response: ${await response.json()}`);
        const todoItem = document.getElementById(`todo-${id}`);
        todoList.removeChild(todoItem);
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

async function editTodo(id) {
    const todoItem = document.getElementById(`todo-${id}`);
    const todoText = todoItem.querySelector(".todo-text").textContent;
    const newText = prompt("Edit todo:", todoText);
    if (newText !== null && newText.trim() !== "") {
        try {
            const response = await fetch(
                `http://localhost:${BACKEND_PORT}/todos/${id}`,
                {
                    // Use the constant here
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: newText }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`Todo Updated`);
            todoItem.querySelector(".todo-text").textContent = newText;
        } catch (error) {
            console.error("Error editing todo:", error);
        }
    }
}

async function toggleComplete(id) {
    try {
        const todoItem = document.getElementById(`todo-${id}`);
        const isCompleted = todoItem.classList.contains("completed");
        const response = await fetch(
            `http://localhost:${BACKEND_PORT}/todos/${id}`,
            {
                // Use the constant here
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: !isCompleted }),
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        todoItem.classList.toggle("completed");
    } catch (error) {
        console.error("Error toggling complete:", error);
    }
}

async function loadTodoList() {
    try {
        const response = await fetch(`http://localhost:${BACKEND_PORT}/todos/`); // Use the constant here
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const todos = await response.json();
        console.log(`Rendered from List`);
        todos.forEach(renderTodo);
    } catch (error) {
        console.error("Error loading todos:", error);
    }
}

function renderTodo(todo) {
    const newTodoItem = document.createElement("li");
    newTodoItem.id = `todo-${todo.id}`;
    newTodoItem.classList.add("todo-item");
    if (todo.completed) {
        newTodoItem.classList.add("completed");
    }
    newTodoItem.innerHTML = `
            <span class="todo-text">${todo.text}</span> 
            <button class="delete-button" onclick="deleteTodo(${todo.id})">x</button> 
            <button class="edit-button" onclick="editTodo(${todo.id})">✏️</button>
            `;
    // newTodoItem.addEventListener("click", () => toggleComplete(todo.id));
    todoList.appendChild(newTodoItem);
}

addTodoButton.addEventListener("click", addTodo);
loadTodoList();
