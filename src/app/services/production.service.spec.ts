import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ProductionService } from "./production.service";

describe("ProductionService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it("should be created", () => {
    const service: ProductionService = TestBed.get(ProductionService);
    expect(service).toBeTruthy();
  });
});
