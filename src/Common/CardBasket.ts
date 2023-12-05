import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";

export class CardBasket extends Component {
  btnDel: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
    super(parrent, 'div', ["cardbasket"]);

    const divName = new Component(this.root, 'div', ["cardbasket__name"])
    new Component(divName.root, 'span', [], data.name);

    const divPrice = new Component(this.root, 'div', ["cardbasket__price"])

    new Component(divPrice.root, 'span', [], `${data.price}`);

    this.btnDel = new Component(divPrice.root, 'input', ["cardbasket__delete"], null, ["type", "value"], ["button", "+"]);
    this.btnDel.root.onclick = () => {
      this.delGoodFromBasket();
    }
  }
  delGoodFromBasket() {
    const user = this.services.authService.user;
    this.services.dbService.
      delGoodFromBasket(user, this.data)
      .then(() => {
        this.remove();
      })
      .catch(() => { });
  }
}