import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChampionsService } from '../champions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit, OnDestroy {
  isCollapsed = true;

  champions = [];
  regions = [
    { name: 'Global', id: 'global' },
    { name: 'Brasil', id: 'br' },
    { name: 'Europa Nórdico e Oriental (EUNE)', id: 'eune' },
    { name: 'Oeste da Europa (EUW)', id: 'euw' },
    { name: 'Japão', id: 'jp' },
    { name: 'Coreia', id: 'kr' },
    { name: 'América do Norte', id: 'na' },
    { name: 'Oceânia', id: 'oce' },
    { name: 'América do Norte Latina (LAN)', id: 'lan' },
    { name: 'América do Sul (LAS)', id: 'las' },
    { name: 'Turquia', id: 'tr' },
    { name: 'Russia', id: 'ru' }
  ];
  queues = [
    { name: 'Diamante +', id: 'diamond_plus' },
    { name: 'Mestre +', id: 'master_plus' },
    { name: 'Ouro +', id: 'gold_plus' },
    { name: 'Todas', id: 'all' },
    { name: 'Desafiante', id: 'challenger' },
    { name: 'Grão-Mestre', id: 'grandmaster' },
    { name: 'Mestre', id: 'master' },
    { name: 'Diamante', id: 'diamond' },
    { name: 'Platina', id: 'platinum' },
    { name: 'Ouro', id: 'gold' },
    { name: 'Prata', id: 'silver' },
    { name: 'Bronze', id: 'bronze' },
    { name: 'Ferro', id: 'iron' },
    { name: 'Não ranqueados', id: 'unranked' }
  ];
  lanes = [
    { name: 'Meio', id: 'middle' },
    { name: 'Topo', id: 'top' },
    { name: 'Selva', id: 'jungle' },
    { name: 'Atirador', id: 'bottom' },
    { name: 'Suporte', id: 'support' }
  ];
  busca = {
    region: 'kr',
    queue: 'diamond_plus',
    champs: []
  }
  addChamp = {
    champion: '1',
    lane: 'middle'
  };

  constructor(private champService: ChampionsService,
              private router: Router) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    this.champions = this.champService.getChamps();
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  selectRegion(region) {
    region = region.split(': ')[1];
    this.busca.region = region;
  }

  selectQueue(queue) {
    queue = queue.split(': ')[1];
    this.busca.queue = queue;
  }

  selectChamp(champ) {
    champ = champ.split(': ')[1];
    this.addChamp.champion = champ;
  }

  selectLane(lane) {
    lane = lane.split(': ')[1];
    this.addChamp.lane = lane;
  }

  addChampList() {
    console.log(this.addChamp);
    this.busca.champs.push({
      champion: this.addChamp.champion,
      lane: this.addChamp.lane
    });
    console.log(this.busca);
  }

  removeChampList(id) {
    this.busca.champs.splice(id,1);
  }

  getChampName(id) {
    for (let champ in this.champions) {
      if (this.champions[champ].id == id) {
        return this.champions[champ].name;
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

  goBusca() {
    this.champService.setBusca(this.busca);
    this.router.navigate(['/result']);
  }
}
