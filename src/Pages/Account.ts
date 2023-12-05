import { Component } from "../Abstract/Component";
import { TDataHistory, TServices } from "../Abstract/Type";
import { CardHistory } from "../Common/CardHistory";
import { Graph } from "../Common/Graph";

export class Account extends Component {
  regButton: Component;
  outButton: Component;
  divRecord: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["account"]);

    new Component(this.root, 'h1', ["title__page"], "ЛИЧНЫЙ КАБИНЕТ")

    const divAccount = new Component(this.root, 'div', ["account__information"])

    new Component(divAccount.root, 'span', ["account__name"], services.authService.user?.displayName);

    const email = new Component(divAccount.root, 'div', ["account__email"])
    new Component(divAccount.root, 'span', [], "Электронная почта: ");
    new Component(divAccount.root, 'span', ["account__email-span"], services.authService.user?.email);

    const divStat = new Component(divAccount.root, 'div', ["divstat"])
    const record = new Component(divStat.root, 'div', ["divstat__record"])
    new Component(record.root, 'span', ["divstat__text"], "Записи")
    const spanCount = new Component(record.root, 'span', ["divstat__text"], `${0}`)

    const allSumma = new Component(divStat.root, 'div', ["divstat__allSumma"])
    new Component(allSumma.root, 'span', ["divstat__text"], "Общая сумма, руб.")
    const spanSumma = new Component(allSumma.root, 'span', ["divstat__num"], `${0}`)

    services.dbService.addListener('changeStat', (count, summa) => {
      spanCount.root.innerHTML = `${count}`;
      spanSumma.root.innerHTML = `${summa}`
    })

    const divHistory = new Component(divAccount.root, 'div', ["account__history"]);
    new Component(divHistory.root, 'span', ["history__description"], "История записей")

    this.divRecord = new Component(divHistory.root, 'div', ["history__record"]);
    const user = services.authService.user;
    services.dbService.calcCountDocsHistory(user);

    services.dbService.getAllHistory(user).then((historys) => {
      this.putHistoryOnPage(this.divRecord, historys);
    });

    services.dbService.addListener('addInHistory', (history) => {
      this.putHistoryOnPage(this.divRecord, [history as TDataHistory]);
    });


    const divGraph = new Component(divAccount.root, "div", ["stat__graph"]);
    const graph = new Graph(divGraph.root);

    services.dbService.getAllHistory(user).then((historys) => {
      graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
      graph.graphik.update();
    });
    services.dbService.addListener('addInHistory', () => {
      const user = services.authService.user;
      services.dbService.getAllHistory(user).then((historys) => {
        graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
        graph.graphik.update();
      });
    });



    this.regButton = new Component(divAccount.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Войти в аккаунт"]);
    this.regButton.root.onclick = () => {
      this.services.authService.authWidthGoogle();
      console.log('lol');
    }

    this.outButton = new Component(divAccount.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Выйти из личного кабинета"]);
    this.outButton.root.onclick = () => {
      this.services.authService.outFromGoogle();
    }

    if (user) {
      this.toggleButton(true);
      // window.location.reload();
    } else {
      this.toggleButton(false);
    }
    this.services.authService.addListener('userAuth', (isAuthUser) => {
      if (isAuthUser) {
        this.toggleButton(true)
      } else {
        this.toggleButton(false)
      }
    })
  }
  toggleButton(isAuthUser: boolean): void {
    if (isAuthUser) {
      this.regButton.remove();
      this.outButton.render();
    } else {
      this.regButton.render();
      this.outButton.remove();
    }
  }
  putHistoryOnPage(teg: Component, historys: TDataHistory[]) {
    historys.forEach((history) => {
      new CardHistory(teg.root, this.services, history);
    });
  }
}