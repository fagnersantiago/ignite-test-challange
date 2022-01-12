import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfile: ShowUserProfileUseCase;
let showUserInMemory: InMemoryUsersRepository;

describe("Show user Profile", () => {
  beforeEach(() => {
    showUserInMemory = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(showUserInMemory);
  });

  it("Should be able to list user", async () => {
    const user = {
      name: "John Doe",
      email: "john@email.com",
      password: "password",
    };

    const userCreated = await showUserInMemory.create(user);

    const response = await showUserProfile.execute(userCreated.id as string);

    expect(response).toBe(userCreated);
  });

  it("Should not be able to user non-existents", () => {
    expect(async () => {
      await showUserProfile.execute("invalid user");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
