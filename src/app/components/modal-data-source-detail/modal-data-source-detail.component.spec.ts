import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IDataSource } from "../../models/data-source";
import { OnlineState } from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { ModalDataSourceDetailComponent } from "./modal-data-source-detail.component";

describe("ModalDataSourceDetailComponent", () => {
  let component: ModalDataSourceDetailComponent;
  let fixture: ComponentFixture<ModalDataSourceDetailComponent>;

  const testDataSource: IDataSource = {
    Id: 1,
    Name: "Test data source",
    ShortName: "Test data source",
    Online: OnlineState.Online
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDataSourceDetailComponent],
      providers: [NgbActiveModal, NgbModal, NetworkOverviewService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDataSourceDetailComponent);
    component = fixture.componentInstance;
    component.data = testDataSource;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
