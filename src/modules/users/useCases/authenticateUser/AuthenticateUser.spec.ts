import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authentication user", () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be authenticate user", async () => {
    const user = {
      name: "jonh Doe",
      email: "johnDoe@email",
      password: "1254c23",
    };

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authencitate user incorrectly email", async () => {
    expect(async () => {
      const user = {
        name: "jonh Doe",
        email: "johnDoe@email",
        password: "senhasupersecreta123",
      };
      await authenticateUserUseCase.execute({
        email: "wrong email",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authencitate user incorrectly password", async () => {
    expect(async () => {
      const user = {
        name: "jonh Doe",
        email: "johnDoe@email",
        password: "senhasupersecreta123",
      };
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
