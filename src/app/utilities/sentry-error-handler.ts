import { ErrorHandler } from "@angular/core";
import * as Sentry from "@sentry/browser";

import { environment } from "../../environments/environment";

export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    if (environment.production) {
      Sentry.init({ dsn: window.SENTRY_DSN });
    }
  }

  public handleError(error: any): void {
    if (environment.production) {
      Sentry.captureException(error);
    }

    throw error;
  }
}
