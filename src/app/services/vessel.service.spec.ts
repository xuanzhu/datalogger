import { TestBed } from "@angular/core/testing";

import { VesselService } from "./vessel.service";

export class MockVesselService extends VesselService {
  constructor() {
    super();

    this.initVessel();
  }

  public initVessel(): void {
    super.initVessel("PSC", false);
  }
}

// tslint:disable-next-line
export const MockVesselServiceProvider = {
  provide: VesselService,
  useClass: MockVesselService
};

describe("VesselService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: VesselService = TestBed.get(VesselService);
    expect(service).toBeTruthy();
  });
});
