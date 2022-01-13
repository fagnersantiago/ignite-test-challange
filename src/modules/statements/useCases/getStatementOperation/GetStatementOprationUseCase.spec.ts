import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: IUsersRepository;
let statements: IStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Get Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statements = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statements
    );
  });
  it("Should be able to list statment by id", async () => {
    const user = await usersRepository.create({
      name: "jhon doe",
      email: "email@com",
      password: "123456",
    });

    const statementResponse = await statements.create({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "depósito",
    });

    const statement = statementResponse.id as string;

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement,
    });
    expect(response).toHaveProperty("id");
  });

  it("Should not be get statement non-existents user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "1524645",
        statement_id: "112313",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
