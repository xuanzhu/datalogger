import { TestBed } from "@angular/core/testing";

import {
  FavoriteParameterService,
  IFavoriteParameter
} from "./favorite-parameter.service";

export class MockFavoriteParameterService extends FavoriteParameterService {
  public getFavoriteParameters(): IFavoriteParameter[] {
    return [];
  }
}

describe("FavoriteParameterService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: FavoriteParameterService = TestBed.get(
      FavoriteParameterService
    );
    expect(service).toBeTruthy();
  });
});
