import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IConverter } from "../../models/converter";
import { OnlineState } from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { ModalConverterDetailComponent } from "./modal-converter-detail.component";

describe("ModalConverterDetailComponent", () => {
  let component: ModalConverterDetailComponent;
  let fixture: ComponentFixture<ModalConverterDetailComponent>;

  const testCoverter: IConverter = {
    Id: 1,
    Name: "Test converter",
    ShortName: "Test converter",
    Online: OnlineState.Online
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConverterDetailComponent],
      providers: [NgbActiveModal, NgbModal, NetworkOverviewService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConverterDetailComponent);
    component = fixture.componentInstance;
    component.data = testCoverter;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
