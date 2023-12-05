import { Component } from "../Abstract/Component";
import { TDataHistory, TServices } from "../Abstract/Type";

export class CardHistory extends Component {
  constructor(parrent: HTMLElement, private services: TServices, private data: TDataHistory) {
    super(parrent, 'div', ["cardhistory"]);

    const divDate = new Component(this.root, 'div', ["history__date"]);

    // data.basket.forEach(el => {
    // new Component(this.root, 'span', [], `${el.time.toDate().toLocaleDateString('ru')}`)
    // new Component(this.root, 'span', [], `${el.time.toDate().toLocaleTimeString('ru')}`);
    new Component(divDate.root, 'span', [], `Дата: ${data.basket[0].time.toDate().toLocaleDateString('ru')}`)
    new Component(divDate.root, 'span', [], `Время: ${data.basket[0].time.toDate().toLocaleTimeString('ru')}`);

    // })

    const divNames = new Component(this.root, 'div', []);
    data.basket.forEach(el => {
      const divName = new Component(divNames.root, 'div', ["history__order"]);
      new Component(divName.root, 'span', [], el.name);
      new Component(divName.root, 'span', [], `${el.price} руб.`);
    });

    const divSumm = new Component(this.root, 'div', ["history__sale"]);
    new Component(divSumm.root, 'span', [], `Скидка: ${data.dataBasket.percent} %`)
    new Component(divSumm.root, 'span', [], `Итого: ${data.dataBasket.allSumma} руб.`)
  }
}