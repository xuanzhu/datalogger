import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { IDataRequest } from "../models/data-request";
import { DataRequestService } from "./data-request.service";
import { MockVesselServiceProvider } from "./vessel.service.spec";

describe("DataRequestService", () => {
  const testJobRequestA: IDataRequest = {
    TimeStart: "1990-12-10 00:00:00",
    TimeEnd: "1990-12-11 00:00:00"
  } as IDataRequest;

  const testJobRequestB: IDataRequest = {
    TimeStart: "1990-12-10 00:00:00",
    TimeEnd: "1990-12-11 00:00:00"
  } as IDataRequest;

  const testJobRequestC: IDataRequest = {
    TimeStart: "1990-12-10 00:00:00",
    TimeEnd: "1990-12-12 00:00:00"
  } as IDataRequest;

  const testJobRequestsSame: IDataRequest[] = [
    testJobRequestA,
    testJobRequestB
  ];

  const testJobRequestsNotSame: IDataRequest[] = [
    testJobRequestA,
    testJobRequestB,
    testJobRequestC
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataRequestService, MockVesselServiceProvider],
      imports: [HttpClientTestingModule]
    });
  });

  it("should be created", inject(
    [DataRequestService],
    (service: DataRequestService) => {
      expect(service).toBeTruthy();
    }
  ));

  it("should be true when all the jobs' requests are the same", inject(
    [DataRequestService],
    (service: DataRequestService) => {
      const isListEqual = service.isListEqual(testJobRequestsSame);
      expect(isListEqual).toBe(true);
    }
  ));

  it("should be false when all the jobs' requests are not the same", inject(
    [DataRequestService],
    (service: DataRequestService) => {
      const isListEqual = service.isListEqual(testJobRequestsNotSame);
      expect(isListEqual).toBe(false);
    }
  ));

  it("should be true when two jobs' requests are the same", inject(
    [DataRequestService],
    (service: DataRequestService) => {
      const isEqual = service.isEqual(testJobRequestA, testJobRequestB);
      expect(isEqual).toBe(true);
    }
  ));

  it("should be true when two jobs' requests are not the same", inject(
    [DataRequestService],
    (service: DataRequestService) => {
      const isEqual = service.isEqual(testJobRequestA, testJobRequestC);
      expect(isEqual).toBe(false);
    }
  ));
});
