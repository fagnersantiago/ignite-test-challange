import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Stament Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list statment by id", async () => {
    await request(app).post("/api/v1/users").send({
      name: "john doe",
      email: "email@email.com.br",
      password: "teste",
    });

    const session = await request(app).post("/api/v1/sessions").send({
      email: "email@email.com.br",
      password: "teste",
    });
    const token = session.body.token;
    //gerar um depósito
    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        user_id: "1223",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "depósito",
      });

    const stament_id = deposit.body.id;

    const response = await request(app)
      .get(`/api/v1/statements/${stament_id}`)
      .set({
        Authorization: ` Bearer ${token}`,
      });
    expect(response.body).toHaveProperty("id");
  });
});
