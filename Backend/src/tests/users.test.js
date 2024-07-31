const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);

let tokenAdmin;
let tokenUser;

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);

  const admin = new User({
    username: "Bober",
    name: "Bober",
    surname: "Boberko",
    email: "bob@gmail.com",
    phone: "0971111111",
    passwordHash,
    role: "admin",
  });

  const user = new User({
    username: "anzhel",
    name: "Anzhel",
    surname: "Buldenko",
    email: "anzhel@gmail.com",
    phone: "0979910029",
    passwordHash,
    role: "client",
  });

  await admin.save();
  await user.save();

  const resAdmin = await api.post("/api/auth").send({
    identifier: "bob@gmail.com",
    password: "secret",
  });

  const resUser = await api.post("/api/auth").send({
    identifier: "anzhel@gmail.com",
    password: "secret",
  });

  tokenAdmin = resAdmin.body.token;
  tokenUser = resUser.body.token;
});

// describe("GET requests", () => {
//   test("GET /api/users returns users as json", async () => {
//     const response = await api
//       .get("/api/users")
//       .set("Authorization", `Bearer ${tokenAdmin}`)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);

//     expect(response.body).toHaveLength(2);
//     expect(response.body[0].username).toBe("Bober");
//   });

//   test("GET /api/users/:id succeeds with valid id (admin)", async () => {
//     const usersAtStart = await User.find({});
//     const userToView = usersAtStart[1];

//     const resultUser = await api
//       .get(`/api/users/${userToView._id}`)
//       .set("Authorization", `Bearer ${tokenAdmin}`)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);

//     expect(resultUser.body.username).toBe(userToView.username);
//   });

//   test("GET /api/users/:id succeeds with valid id (client)", async () => {
//     const usersAtStart = await User.find({});
//     const userToView = usersAtStart[1];

//     const resultUser = await api
//       .get(`/api/users/${userToView._id}`)
//       .set("Authorization", `Bearer ${tokenUser}`)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);

//     expect(resultUser.body.username).toBe(userToView.username);
//   });

//   test("GET /api/users/:id fails with valid id when client accessing admin data", async () => {
//     const usersAtStart = await User.find({});
//     const userToView = usersAtStart[0];

//     await api
//       .get(`/api/users/${userToView._id}`)
//       .set("Authorization", `Bearer ${tokenUser}`)
//       .expect(403);
//   });

//   test("GET /api/users/:id fails with status code 404 if user does not exist", async () => {
//     const validNonexistingId = await new mongoose.Types.ObjectId();

//     await api
//       .get(`/api/users/${validNonexistingId}`)
//       .set("Authorization", `Bearer ${tokenAdmin}`)
//       .expect(404);
//   });

//   test("GET /api/users/:id fails with status code 500 if id is invalid", async () => {
//     const invalidId = "12345";

//     await api
//       .get(`/api/users/${invalidId}`)
//       .set("Authorization", `Bearer ${tokenAdmin}`)
//       .expect(500);
//   });
// });

describe("PUT requests", () => {
  test("PUT /api/users/:id updates a user", async () => {
    const usersAtStart = await User.find({});
    const userToUpdate = usersAtStart[1];

    const updatedData = {
      name: "UpdatedName",
    };

    await api
      .put(`/api/users/${userToUpdate._id}`)
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(updatedData)
      .expect(200);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd[1].name).toBe(updatedData.name);
  });

  test("PUT /api/users/:id fails with status code 401 if unauthorized", async () => {
    const usersAtStart = await User.find({});
    const userToUpdate = usersAtStart[1];

    const updatedData = {
      name: "UpdatedName",
    };

    await api
      .put(`/api/users/${userToUpdate._id}`)
      .send(updatedData)
      .expect(401);
  });

  test("PUT /api/users/:id fails with status code 403 if accessed by other user", async () => {
    const usersAtStart = await User.find({});
    const userToUpdate = usersAtStart[1];

    const updatedData = {
      name: "UpdatedName",
    };

    await api
      .put(`/api/users/${userToUpdate._id}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(updatedData)
      .expect(403);
  });
});

// describe("DELETE requests", () => {
//   test("DELETE /api/users/:id deletes a user", async () => {
//     const usersAtStart = await User.find({});
//     const userToDelete = usersAtStart[0];

//     await api
//       .delete(`/api/users/${userToDelete._id}`)
//       .set("Authorization", `Bearer ${token}`)
//       .expect(204);

//     const usersAtEnd = await User.find({});
//     expect(usersAtEnd).toHaveLength(usersAtStart.length - 1);
//   });

//   // test("DELETE /api/users/:id fails with status code 403 if unauthorized", async () => {
//   //   const usersAtStart = await User.find({});
//   //   const userToDelete = usersAtStart[0];

//   //   await api.delete(`/api/users/${userToDelete._id}`).expect(403);
//   // });
// });

// describe("PATCH requests", () => {
//   // test("PATCH /api/users deletes multiple users", async () => {
//   //   const usersAtStart = await User.find({});
//   //   const userIds = usersAtStart.map((user) => user._id);

//   //   await api
//   //     .patch("/api/users")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({ ids: userIds, action: "delete" })
//   //     .expect(204);

//   //   const usersAtEnd = await User.find({});
//   //   expect(usersAtEnd).toHaveLength(0);
//   // });

//   test("PATCH /api/users fails with status code 401 if unauthorized", async () => {
//     const usersAtStart = await User.find({});
//     const userIds = usersAtStart.map((user) => user._id);

//     await api
//       .patch("/api/users")
//       .send({ ids: userIds, action: "delete" })
//       .expect(401);
//   });
// });

afterAll(async () => {
  await mongoose.connection.close();
});
