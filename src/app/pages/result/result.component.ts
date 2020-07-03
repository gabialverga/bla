import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChampionsService } from '../champions.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { merge } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  numberChamp = 15;
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
        this.champService.getDataChampion(this.patch, this.busca.champs[i].champion, this.busca.champs[i].lane, this.busca.queue, this.busca.region, this.numberChamp)
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

  download() {
    console.log(this.result);
    let data = [];
    let merges = [];

    for (let i = 0; i < this.numberChamp + 3; i++) data.push([]);

    for (let i = 0; i < (this.result.length * 2); i+=2) {
      let c1 = i, c2 = i + 1;
      merges.push({ s: { r: 0, c: c1 }, e: { r: 0, c: c2 } });
      merges.push({ s: { r: 1, c: c1 }, e: { r: 1, c: c2 } });
    }

    console.log(merges);

    this.result.forEach(r => {
      merges.push();
      data[0].push(this.getChampName(r.cid));
      data[0].push('');
      data[1].push(r.lane);
      data[1].push('');
      data[2].push('Forte');
      data[2].push('Fraco');
      for (let j = 0; j < this.numberChamp; j++) {
        data[j + 3].push(this.getChampName(r.strong[j][0]) + " ( " + r.strong[j][1] + "% )");
        data[j + 3].push(this.getChampName(r.weak[j][0]) + " ( " + r.weak[j][1] + "% )");
      }
    });
    this.exportAsExcelFile(data, 'champions', merges);
  }


  public exportAsExcelFile(json, excelFileName, merges): void {
    var ws = XLSX.utils.aoa_to_sheet(json);
    ws['!merges'] = merges;
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    let excelBuffer = new Blob([wbout], { type: "application/octet-stream" })
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

}
