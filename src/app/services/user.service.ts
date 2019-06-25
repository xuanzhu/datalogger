import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { IUser } from "../models/user";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private currentUser$: Observable<IUser>;

  constructor(private http: HttpClient, private apiService: ApiService) {}

  public getCurrentUser(): Observable<IUser> {
    if (!this.currentUser$) {
      const apiUrl = this.apiService.getUrl();
      const url = `${apiUrl}api/v1/Users/Current`;

      this.currentUser$ = this.http.get<IUser>(url).pipe(shareReplay(1));
    }

    return this.currentUser$;
  }
}
