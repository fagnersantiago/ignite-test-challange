import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("authenticate", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "John@test.com.br",
      password: "12385",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "John@test.com.br",
      password: "12385",
    });

    expect(response.body).toHaveProperty("token");
  });
});
