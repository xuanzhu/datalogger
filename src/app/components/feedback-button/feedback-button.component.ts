import { Component } from "@angular/core";

import { ApiService } from "../../services/api.service";
import { RoutingState } from "../../utilities/routing-state";

@Component({
  selector: "feedback-button",
  templateUrl: "./feedback-button.component.html",
  styleUrls: ["./feedback-button.component.css"]
})
export class FeedbackButtonComponent {
  constructor(
    private routingState: RoutingState,
    private apiService: ApiService
  ) {}

  public getMailUrl(): string {
    let historyMax = 20;
    let url: string = this.determineMailUrl(historyMax);

    while (url.length > 1950 && historyMax > 0) {
      historyMax = historyMax - 1;
      url = this.determineMailUrl(historyMax);
    }

    return url;
  }

  private determineMailUrl(historyMax: number): string {
    const mailTo = "datalogger@allseas.com";
    const mailSubject = "Datalogger Next feedback";
    const mailBody = `

--- Please don't change anything under this line ---

User agent: ${navigator.userAgent}
URL: ${location.href}
History:
${this.getRoutingHistory(historyMax)}

API_BASE: ${this.apiService.getUrl()}
IS_RUNNING_ON_VESSEL: ${window.IS_RUNNING_ON_VESSEL}
VESSEL: ${window.VESSEL}
`;
    const urlComponents = [
      `mailto:${mailTo}`,
      `subject=${encodeURIComponent(mailSubject)}`,
      `body=${encodeURIComponent(mailBody)}`
    ];

    return urlComponents.join("&");
  }

  private getRoutingHistory(historyMax: number): string {
    let history = this.routingState.getHistory();

    if (history.length > historyMax) {
      history = history.slice(-historyMax);
      history.unshift("[truncated]");
    }

    return history.map(route => `- "${route}"`).join("\r\n");
  }
}
