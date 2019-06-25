import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { NetworkOverviewService } from "./network-overview.service";

describe("NetworkOverviewService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkOverviewService],
      imports: [HttpClientTestingModule]
    });
  });

  it("should be created", inject(
    [NetworkOverviewService],
    (service: NetworkOverviewService) => {
      expect(service).toBeTruthy();
    }
  ));
});
