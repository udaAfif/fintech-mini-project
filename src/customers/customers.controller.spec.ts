import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request = require("supertest");
import { AppModule } from "../app.module";
import {
  connectMongoMemory,
  clearDatabase,
  closeDatabase,
} from "../test-utils/mongo-memory.server";

describe("CustomersController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connectMongoMemory();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    if (app) {
      await app.close();
    }
  });

  it("POST /customers -> should create a new customer", async () => {
    const res = await request(app.getHttpServer())
      .post("/customers")
      .send({ name: "John Doe", email: "john@example.com" })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("John Doe");
    expect(res.body.email).toBe("john@example.com");
  });

  it("GET /customers/:id -> should return customer by id", async () => {
    const createRes = await request(app.getHttpServer())
      .post("/customers")
      .send({ name: "Jane Doe", email: "jane@example.com" })
      .expect(201);

    const customerId = createRes.body._id;

    const getRes = await request(app.getHttpServer())
      .get(`/customers/${customerId}`)
      .expect(200);

    expect(getRes.body._id).toBe(customerId);
    expect(getRes.body.name).toBe("Jane Doe");
  });
});
