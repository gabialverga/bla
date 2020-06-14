import { Injectable } from '@angular/core';
import championsID from '../../assets/champions.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  // private dataSource = new BehaviorSubject<string>(null);
  // data = this.dataSource.asObservable();

  private champs = null;
  private busca = {
    region: 'kr',
    queue: 'diamond_plus',
    champs: []
  }

  constructor(private httpClient: HttpClient) { }

  getChamps() {
    return this.champs;
  }

  setChamps(l) {
    this.champs = championsID;
  }

  getBusca() {
    return this.busca;
  }

  setBusca(busca) {
    this.busca = busca;
  }

  getPatch() {
    return new Promise((resolve, reject) => {
      this.httpClient.get('https://cdn.op.lol/v/current/json/core.json').subscribe((result: any) => {
        resolve(result);
      }, (error: any) => {
        reject(error);
      });
    });
  }


  getDataChampion(patch, cid, lane, tier, region, qnt) {
    console.log('https://api.op.lol/champion/2/?patch=' + patch + '&cid=' + cid + '&lane=' + lane + '&tier=' + tier + '&queue=ranked&region=' + region);
    return new Promise((resolve, reject) => {
      this.httpClient.get('https://api.op.lol/champion/2/?patch=' + patch + '&cid=' + cid + '&lane=' + lane + '&tier=' + tier + '&queue=ranked&region=' + region)
        .subscribe((result: any) => {
          let laneOrder = 'enemy_' + lane;
          let dt = result.display[laneOrder];
          let winRate = parseFloat(result.display.winRate);
          let pick = result.display.pick;

          let x = dt.map((row) => [
            row[0],
            ((row[2] / row[1]) * 100).toFixed(2),
            ((row[2] / row[1]) * 100 + row[3] - 100).toFixed(2),
            ((row[1] / pick) * 100).toFixed(2),
            row[1].toLocaleString(),
            ((row[2] / row[1]) * 100 - (winRate / (row[3] + winRate) * 100)).toFixed(2)])

          let n = x.filter(row => parseFloat(row[3]) >= 0.5)

          let championData = {
            cid: cid,
            lane: lane,
            strong: n.sort((a, b) => {
              if (parseFloat(b[1]) == parseFloat(a[1])) {
                return parseFloat(b[4]) - parseFloat(a[4])
              } else {
                return parseFloat(b[1]) - parseFloat(a[1])
              }
            }).slice(0, qnt),
            weak: n.sort((a, b) => {
              if (parseFloat(b[1]) == parseFloat(a[1])) {
                return parseFloat(b[4]) - parseFloat(a[4])
              } else {
                return parseFloat(a[1]) - parseFloat(b[1])
              }
            }).slice(0, qnt)
          }

          resolve(championData);
        }, (error: any) => {
          reject(error);
        });
    });
  }
}
