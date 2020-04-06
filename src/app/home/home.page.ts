import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  ngOnInit(): void {
    this.getData().subscribe((res) => {
      const response = JSON.parse(JSON.stringify(res));
      const data = response.data;
      this.confirmedCases = data.summary.total;
      this.recovered = data.summary.discharged;
      this.deaths = data.summary.deaths;
    });
  }

  constructor(private http: HttpClient) {}

  confirmedCases: number;
  recovered: number;
  deaths: number;

  getData() {
    return this.http.get("https://api.rootnet.in/covid19-in/stats/latest");
  }

  doRefresh(event) {
    console.log("Refresh");
    this.getData().subscribe((res) => {
      const response = JSON.parse(JSON.stringify(res));
      const data = response.data;
      this.confirmedCases = data.summary.total;
      this.recovered = data.summary.discharged;
      this.deaths = data.summary.deaths;
      event.target.complete();
    });
  }
}
