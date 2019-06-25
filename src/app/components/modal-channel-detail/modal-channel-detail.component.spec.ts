import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { of } from "rxjs";

import { IChannel } from "../../models/channel";
import { OnlineState, PingStatus } from "../../models/network-overview-item";
import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { ModalChannelDetailComponent } from "./modal-channel-detail.component";

import { NetworkOverviewService } from "../../services/network-overview.service";

describe("ModalChannelDetailComponent", () => {
  let component: ModalChannelDetailComponent;
  let fixture: ComponentFixture<ModalChannelDetailComponent>;

  const testChannel: IChannel = {
    Id: 1,
    Name: "Test channel",
    ShortName: "Test channel",
    Converter: "",
    DataSource: "",
    Online: OnlineState.Offline,
    PingStatus: PingStatus.Offline
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalChannelDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({})
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {
              "";
            }
          }
        },
        MockVesselServiceProvider,
        NgbActiveModal,
        NgbModal,
        NetworkOverviewService
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChannelDetailComponent);
    component = fixture.componentInstance;
    component.data = testChannel;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
