import request from "supertest";
import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";

let connection: Connection;

describe("Create User ", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@email.com.br",
      password: "teste",
    });

    expect(user.status).toBe(201);
  });

  it("Should not be able to create a existents user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@email.com.br",
      password: "teste",
    });

    expect(user.statusCode).toBe(400);
  });
});
