import * as moment from "moment";

export interface IProductionEvent {
  ProductionParameterId: number;
  StationId?: number;
  Name: string;
  Timestamp: moment.Moment;
  Duration?: number;
  Value?: string;
}
