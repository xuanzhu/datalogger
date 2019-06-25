import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { DataloggerService } from "./datalogger.service";
import { MockVesselServiceProvider } from "./vessel.service.spec";

describe("DataloggerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataloggerService, MockVesselServiceProvider],
      imports: [HttpClientTestingModule]
    });
  });

  it("should be created", inject(
    [DataloggerService],
    (service: DataloggerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
