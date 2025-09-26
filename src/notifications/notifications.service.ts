import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class NotificationsService {
  async sendNotification(userId: string, payload: any) {
    try {
      const url =
        process.env.NOTIFICATION_URL ||
        "https://webhook.site/49f0255b-e2b7-46e8-b360-df3b48611b27";

      const { data } = await axios.post(
        url,
        {
          userId,
          message: `Transaction update: ${JSON.stringify(payload)}`,
        },
        {
          timeout: 30000,
        }
      );

      return data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        "Notification service error: " + String(err?.message || err)
      );
    }
  }
}
