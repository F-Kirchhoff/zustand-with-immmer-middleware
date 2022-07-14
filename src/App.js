import { useState } from "react";
import produce from "immer";
import create from "zustand";
import "./App.css";

const withImmer = (config) => (set, get, api) => {
  const update = (callback) => {
    set(produce(callback));
  };
  return config(update, get, api);
};

const useStore = create(
  withImmer((update) => {
    return {
      todos: [],
      addTodo: (text) =>
        update((draft) => {
          const newTodo = {
            id: Math.floor(Math.random() * 2 ** 128).toString(36),
            text,
            done: false,
          };
          console.log(newTodo.id);
          draft.todos.push(newTodo);
        }),
      removeTodo: (id) =>
        update((draft) => {
          const index = draft.todos.findIndex((todo) => todo.id === id);
          draft.todos.splice(index, 1);
        }),
      toggleTodo: (id) =>
        update((draft) => {
          const selectedTodo = draft.todos.find((todo) => todo.id === id);
          selectedTodo.done = !selectedTodo.done;
        }),
    };
  })
);

function App() {
  const [text, setText] = useState("");
  const todos = useStore((state) => state.todos);
  const addTodo = useStore((state) => state.addTodo);
  const removeTodo = useStore((state) => state.removeTodo);
  const toggleTodo = useStore((state) => state.toggleTodo);
  return (
    <div className="App">
      <h1>Another Todo</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addTodo(text);
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button>Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
