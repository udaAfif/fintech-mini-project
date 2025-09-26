import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class PaymentsService {
  async chargeExternal(amount: number, cardInfo: any, idempotencyKey?: string) {
    try {
      const url =
        process.env.PAYMENT_GATEWAY_URL ||
        "https://jsonplaceholder.typicode.com/posts";

      const { data } = await axios.post(
        url,
        { amount, card: cardInfo },
        {
          headers: {
            ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
          },
          timeout: 10000,
        }
      );
      return data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        "Payment gateway error: " + String(err?.message || err)
      );
    }
  }
}
