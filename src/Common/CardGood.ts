import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";

export class CardGood extends Component {
  btnBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
    super(parrent, 'div', ["cardgood"]);

    new Component(this.root, 'img', [], null, ["src", "alt"], [data.url, data.name]);
    new Component(this.root, 'span', ["cardgood__name"], data.name);
    const divPrice = new Component(this.root, 'div', ["cardgood__basket"]);
    this.btnBasket = new Component(divPrice.root, 'input', ["card__basket"], null, ["value", "type"], ["", "button"]);
    new Component(divPrice.root, 'span', ["card__price"], `${data.price.toString()} руб.`);

    if (services.dbService.dataUser) {
      const index = services.dbService.dataUser.basket.findIndex((el) => el.id === data.id);
      if (index >= 0) {
        (this.btnBasket.root as HTMLElement).classList.add('hidden')
      }
    }

    this.btnBasket.root.onclick = () => {
      const isProductExtins = this.services.dbService.dataUser?.basket.some(item => item.type === data.type)
      if (isProductExtins) {
        console.log('товар уже есть')
      } else {

        this.addGoodInBasket();
        (this.btnBasket.root as HTMLElement).classList.add('hidden');
      }
    }

    services.dbService.addListener('delGoodFromBasket', (idGood) => {
      if (idGood === data.id) {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      }
    })
  }

  addGoodInBasket() {
    const user = this.services.authService.user;
    this.services.dbService.addGoodInBasket(user, this.data)
      .catch(() => {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      });
  }
}