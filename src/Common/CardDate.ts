import { User } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TDate, TServices } from "../Abstract/Type";

export class CardDate extends Component {
  divDate: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TDate) {
    super(parrent, 'div', ["cardDate"]);

    this.divDate = new Component(this.root, 'div', ["carddate"]);

    new Component(this.divDate.root, 'span', ["carddate__name"], "Дата: ");
    new Component(this.divDate.root, 'span', ["carddate__time"], `${data.date.toDate().toLocaleDateString('ru')}`);
    new Component(this.divDate.root, 'span', ["carddate__time"], `${data.date.toDate().toLocaleTimeString('ru')}`);

    this.divDate.root.onclick = () => {
      const user = services.authService.user;
      this.addDateInBasket(user, data);
      (this.divDate.root as HTMLElement).classList.add('carddate__active');
    }
    services.dbService.addListener('dateInBasket', (date) => {
      const index = services.dbService.dataUser?.basket.filter(el => el.time === data.date);
      if (!index) return;
      if ((index?.length) > 0) {
        (this.divDate.root as HTMLElement).classList.add('carddate__active');
      } else {
        (this.divDate.root as HTMLElement).classList.remove('carddate__active');
      }
    })
  }
  addDateInBasket(user: User | null, data: TDate) {
    this.services.dbService.addDateInBasket(user, data)
  }

}