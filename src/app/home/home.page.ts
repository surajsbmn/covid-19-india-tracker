import { Component, OnInit, ViewChild } from "@angular/core";
import { CovidApiService } from "../covid-api.service";
import { ToastController } from "@ionic/angular";
import { Chart } from "chart.js";
import { mapToMapExpression } from "@angular/compiler/src/render3/util";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  confirmedCases: number;
  recovered: number;
  deaths: number;
  lastUpdated: Date;
  stateData: any[] = [];

  bars: any;
  colorArray: any;

  @ViewChild("barChart", { static: false }) barChart;

  constructor(
    private covidApiService: CovidApiService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.covidApiService.getLatestData().subscribe(
      (res) => {
        this.updateData(res);
      },
      (err) => {
        this.presentErrorToast();
        console.log(err);
      }
    );
  }

  ionViewDidEnter() {
    // this.createBarChart();
  }

  updateData(res) {
    const response = JSON.parse(JSON.stringify(res));
    const data = response.data;
    this.confirmedCases = data.summary.total;
    this.recovered = data.summary.discharged;
    this.deaths = data.summary.deaths;
    this.lastUpdated = new Date(response.lastRefreshed);

    const regionalData: any[] = data.regional;
    this.stateData = [];
    for (let i = 0; i < regionalData.length; i++) {
      this.stateData.push({
        state: regionalData[i].loc,
        totalConfirmed: regionalData[i].totalConfirmed,
      });
    }
    this.stateData.sort((a, b) => {
      return b.totalConfirmed - a.totalConfirmed;
    });
    console.log(this.stateData);
    this.createBarChart();
  }

  doRefresh(event) {
    console.log("Refresh");
    this.covidApiService.getLatestData().subscribe(
      (res) => {
        this.updateData(res);
        event.target.complete();
      },
      (err) => {
        this.presentErrorToast();
        console.log(err);
        event.target.complete();
      }
    );
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: "Connection Error! Please try refreshing.",
      duration: 2000,
    });
    toast.present();
  }

  createBarChart() {
    let states = [];
    let totalConfirmed = [];
    for (let i = 0; i < 10; i++) {
      states.push(this.stateData[i].state);
      totalConfirmed.push(this.stateData[i].totalConfirmed);
    }
    console.log

    this.bars = new Chart(this.barChart.nativeElement, {
      type: "horizontalBar",
      data: {
        labels: states, // State names
        datasets: [
          {
            label: "Total Confirmed Cases",
            data: totalConfirmed,
             backgroundColor: "rgb(247, 136, 62)", // array should have same number of elements as number of dataset
             borderColor: "rgb(247, 136, 62)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
