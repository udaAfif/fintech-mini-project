import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request = require("supertest");
import { AppModule } from "../app.module";
import {
  connectMongoMemory,
  clearDatabase,
  closeDatabase,
} from "../test-utils/mongo-memory.server";

jest.mock("../payments/payments.service", () => ({
  PaymentsService: jest.fn().mockImplementation(() => ({
    chargeExternal: jest.fn().mockResolvedValue({
      success: true,
      transactionId: "mock-tx-123",
    }),
  })),
}));

describe("TransactionsController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connectMongoMemory();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 100000);

  afterEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDatabase();
    if (app) {
      await app.close();
    }
  });

  it("POST /transactions -> should create a transaction and call mock payment gateway", async () => {
    const customerRes = await request(app.getHttpServer())
      .post("/customers")
      .send({ name: "Alice", email: "alice@example.com" })
      .expect(201);

    const customerId = customerRes.body._id;

    const txRes = await request(app.getHttpServer())
      .post("/transactions")
      .send({ customerId, amount: 500, type: "debit" })
      .expect(201);

    expect(txRes.body).toHaveProperty("_id");
    expect(txRes.body.amount).toBe(500);
    expect(txRes.body.type).toBe("debit");
    expect(txRes.body.customer).toBe(customerId);
  });
});
