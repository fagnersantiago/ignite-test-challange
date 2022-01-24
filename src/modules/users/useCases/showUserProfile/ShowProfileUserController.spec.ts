import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Show Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able show profiles", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "test@com.br",
      password: "teste",
    });

    const session = await request(app).post("/api/v1/sessions").send({
      email: "test@com.br",
      password: "teste",
    });

    const token = session.body.token;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(200);
  });
});
