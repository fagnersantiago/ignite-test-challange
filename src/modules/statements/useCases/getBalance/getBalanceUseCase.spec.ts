import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUsecase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

const IS_BALANCE = 0;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUsecase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it("Should be able to list all statements", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "126456",
    });

    await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "depósito",
    });

    await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "depósito",
    });

    const { balance } = await getBalanceUsecase.execute({
      user_id: user.id as string,
    });

    expect(balance).toBe(IS_BALANCE);
  });

  it("Should not be able get balance non-existent user", async () => {
    expect(async () => {
      await getBalanceUsecase.execute({
        user_id: "788",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
