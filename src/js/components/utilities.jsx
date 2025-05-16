const url = "https://playground.4geeks.com/todo";
const username = "jAlejandroGM";

export const getTodos = async () => {
    try {
        const response = await fetch(`${url}/users/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.todos;
        }
        return [];
    } catch (error) {
        console.error("Error getting todos:", error);
        return [];
    }
};

export const createTodo = async (task) => {
    try {
        const response = await fetch(`${url}/todos/${username}`, {
            method: "POST",
            body: JSON.stringify({ label: task, done: false }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            return await getTodos();
        }
        return null;
    } catch (error) {
        console.error("Error creating todos list:", error);
        return null;
    }
};

export const deleteTodo = async (todoId) => {
    try {
        const response = await fetch(`${url}/todos/${todoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            return await getTodos();
        }
        return null;
    } catch (error) {
        console.error("Error deleting todo:", error);
        return null;
    }
};

export const deleteAllTodos = async () => {
    try {
        const currentTodos = await getTodos();
        await Promise.all(
            currentTodos.map(todo =>
                fetch(`${url}/todos/${todo.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            )
        );
        return await getTodos();
    } catch (error) {
        console.error("Error deleting all todos:", error);
        return null;
    }
};