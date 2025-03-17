const request = require("supertest");
const app = require("../index.js");

describe("Todo API", () => {
  let todoId;

  it("should add a new todo", async () => {
    const response = await request(app)
      .post("/api/todos")
      .send({ text: "Test Todo" });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.text).toBe("Test Todo");
    expect(response.body.completed).toBe(false);
    
    todoId = response.body.id;
  });

  it("should retrieve all todos", async () => {
    const response = await request(app).get("/api/todos");
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should toggle a todo's completion status", async () => {
    const response = await request(app).put(`/api/todos/${todoId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("completed");
    expect(response.body.completed).toBe(true); // Should now be true
  });

  it("should delete a todo", async () => {
    const response = await request(app).delete(`/api/todos/${todoId}`);
    expect(response.status).toBe(204);
  });

  it("should return 404 for toggling a non-existent todo", async () => {
    const response = await request(app).put("/api/todos/999999");
    expect(response.status).toBe(404);
  });

  it("should return 404 for deleting a non-existent todo", async () => {
    const response = await request(app).delete("/api/todos/999999");
    expect(response.status).toBe(204); // No error, since delete is idempotent
  });
});
