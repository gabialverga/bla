import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChampionsService } from '../champions.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  champions = [];
  busca;
  patch;
  checkFinish = [];
  result = [];
  lanes = [
    { name: 'Meio', id: 'middle' },
    { name: 'Topo', id: 'top' },
    { name: 'Selva', id: 'jungle' },
    { name: 'Atirador', id: 'bottom' },
    { name: 'Suporte', id: 'support' }
  ];

  constructor(private champService: ChampionsService) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    this.busca = this.champService.getBusca();
    this.champions = this.champService.getChamps();
    this.champService.getPatch().then((resp: any) => {
      this.patch = resp.version;
      console.log(this.busca);
      for (let i = 0; i < this.busca.champs.length; i++) {
        console.log(this.busca.champs[i]);
        this.checkFinish.push(false);
        this.result.push({});
        this.champService.getDataChampion(this.patch, this.busca.champs[i].champion, this.busca.champs[i].lane, this.busca.queue, this.busca.region, 15)
          .then((resp: any) => {
            this.result[i] = resp;
            this.checkFinish[i] = true;
          });
      }
      console.log(this.checkFinish);
    });
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  getChampName(id) {
    for (let champ in this.champions) {
      if (this.champions[champ].id == id) {
        return this.champions[champ].name;
      }
    }
  }

  getChampIcon(id) {
    for (let champ in this.champions) {
      if (this.champions[champ].id == id) {
        return "https://cdn.op.lol/v/" + this.patch + "/img/championtiles/" + this.champions[champ].icon;
      }
    }
  }

  getLaneName(id) {
    for (let lane in this.lanes) {
      if (this.lanes[lane].id == id) {
        return this.lanes[lane].name;
      }
    }
  }

  checkAllOk() {
    let ok = true;
    this.checkFinish.forEach(e => ok = (ok && e));
    if (this.checkFinish.length < this.busca.champs.length || !ok) return false;
    else {
      return true;
    }
  }
}
