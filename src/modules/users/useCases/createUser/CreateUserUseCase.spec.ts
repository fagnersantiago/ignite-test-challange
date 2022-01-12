import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let createUserInMemory: InMemoryUsersRepository;

describe("Create User ", () => {
  beforeEach(async () => {
    createUserInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(createUserInMemory);
  });

  it("Should be able to create a new user", async () => {
    // Criar o usuário
    const user = {
      name: "john doe",
      email: "johndoe@email.com",
      password: "123456",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const userCreated = await createUserInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user if already exists ", async () => {
    // Criar o usuário
    expect(async () => {
      const user = {
        name: "john doe",
        email: "johndoe@email.com",
        password: "123456",
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
