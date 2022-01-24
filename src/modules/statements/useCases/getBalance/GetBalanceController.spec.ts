import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let connection: Connection;
describe("Get Balence", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be list balance", async () => {
    //criar usuário
    await request(app).post("/api/v1/users").send({
      name: "john doe",
      email: "email@email.com.br",
      password: "teste",
    });
    //criar sessão para gerar o token
    const session = await request(app).post("/api/v1/sessions").send({
      email: "email@email.com.br",
      password: "teste",
    });
    //pegar o token
    const token = session.body.token;
    //gerar um depósito
    await request(app)
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

    //obter o balence
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: ` Bearer ${token}`,
      });
    expect(response.body.balance).toBe(100);
  });
});
