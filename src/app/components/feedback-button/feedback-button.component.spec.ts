/* tslint:disable:no-bitwise */
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RoutingState } from "../../utilities/routing-state";
import { FeedbackButtonComponent } from "./feedback-button.component";

class MockRoutingState {
  public getHistory = () => this.generateNRandomStrings(20, 100);

  private generateRandomString = (length: number) =>
    [...Array(length)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join("");

  private generateNRandomStrings = (items: number, length: number) =>
    [...Array(items)].map(() => this.generateRandomString(length));
}

describe("FeedbackButtonComponent", () => {
  let component: FeedbackButtonComponent;
  let fixture: ComponentFixture<FeedbackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackButtonComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: RoutingState, useClass: MockRoutingState }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not generate URLs above 1950 chars", () => {
    expect(component.getMailUrl().length).toBeLessThan(1950);
  });
});
