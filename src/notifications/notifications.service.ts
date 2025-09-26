import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class NotificationsService {
  async sendNotification(userId: string, payload: any) {
    try {
      const url =
        process.env.NOTIFICATION_URL ||
        "https://webhook.site/5dfcf653-d1b0-4a60-93d5-735538aaf892";

      const { data } = await axios.post(
        url,
        {
          userId,
          message: `Transaction update: ${JSON.stringify(payload)}`,
        },
        {
          timeout: 10000,
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
