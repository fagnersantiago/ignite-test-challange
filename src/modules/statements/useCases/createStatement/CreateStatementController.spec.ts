import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be create a new deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John doe",
      email: "email@test.com",
      password: "123456",
    });

    const session = await request(app).post("/api/v1/sessions").send({
      email: "email@test.com",
      password: "123456",
    });

    const token = session.body.token;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: ` Bearer ${token}`,
      })
      .send({
        user_id: "1223",
        type: OperationType.DEPOSIT,
        amount: 150,
        description: "poupança",
      });

    expect(response.statusCode).toBe(201);
  });

  it("Should be able to create withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John doe",
      email: "email@test.com",
      password: "123456",
    });

    const sessionToken = await request(app).post("/api/v1/sessions").send({
      email: "email@test.com",
      password: "123456",
    });

    const tokens = sessionToken.body.token;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: ` Bearer ${tokens}`,
      })
      .send({
        user_id: "1223",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "withdraw test",
      });

    expect(response.statusCode).toBe(201);
  });
});
