import { Box, List, ListItem, ThemeIcon } from "@mantine/core";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import { useState } from "react";
import useSWR from "swr";
import "./App.css";
import AddTodo from "./components/AddTodo";

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const endpoint = "http://localhost:4000";

const fetcher = async (url: string) => {
  const r = await fetch(`${endpoint}/${url}`);
  const data = await r.json();
  return data;
};

function App() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  const todoDone = async (id: number) => {
    const r = await fetch(`${endpoint}/api/todos/${id}/done`, {
      method: "PATCH",
    });
    const data = await r.json();

    mutate(data);
  };

  return (
    <div className="App">
      <Box
        sx={(theme) => ({
          padding: "2rem",
          width: "100%",
          maxWidth: "40rem",
          margin: "0 auto",
        })}
      >
        <List spacing="xs" size="sm" mb={12} center>
          {data?.map((todo) => (
            <ListItem
              onClick={() => todoDone(todo.id)}
              key={`todo__${todo.id}`}
              icon={
                todo.done ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
            </ListItem>
          ))}
        </List>

        <AddTodo mutate={mutate} />
      </Box>
    </div>
  );
}

export default App;
