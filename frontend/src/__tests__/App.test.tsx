import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "../App";
import { vi } from "vitest";

vi.mock("axios");

describe("Todo App", () => {
  it("renders the heading", () => {
    render(<App />);
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  it("fetches and displays todos", async () => {
    const mockTodos = [
      { id: 1, text: "Test Todo 1", completed: false },
      { id: 2, text: "Test Todo 2", completed: true }
    ];

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValueOnce({ data: mockTodos });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });
  it("adds a new todo", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 3, text: "New Todo", completed: false } });
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Add a new todo"), {
      target: { value: "New Todo" }
    });
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });

  it("toggles a todo's completion status", async () => {
    const mockTodo = { id: 1, text: "Test Todo", completed: false };
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValueOnce({ data: [mockTodo] });
    mockedAxios.put.mockResolvedValueOnce({ data: { ...mockTodo, completed: true } });

    render(<App />);
    await waitFor(() => screen.getByText("Test Todo"));

    fireEvent.click(screen.getByText("Test Todo"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("http://localhost:5000/api/todos/1");
    });
  });

  it("deletes a todo", async () => {
    const mockTodo = { id: 1, text: "Test Todo", completed: false };
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValueOnce({ data: [mockTodo] });
    mockedAxios.delete.mockResolvedValueOnce({});

    render(<App />);
    await waitFor(() => screen.getByText("Test Todo"));

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Test Todo")).not.toBeInTheDocument();
    });
  });
});
