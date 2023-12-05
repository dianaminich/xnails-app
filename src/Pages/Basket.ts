import { Component } from "../Abstract/Component";
import { TDataBasket, TDate, TGood, TServices } from "../Abstract/Type";
import { CardBasket } from "../Common/CardBasket";
import { CardDate } from "../Common/CardDate";

export class Basket extends Component {
  divGoodManicure: Component;
  divGoodPedicure: Component;
  divGoodCare: Component;
  divGoodCover: Component;
  spanSumma: Component;
  spanAllSumma: Component;
  spanPercent: Component;
  fullBasket: Component;
  nullBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["basket"])

    new Component(this.root, 'h1', ["title__page"], "Заказать услуги")

    services.dbService.calcDataBasket();
    let isBasketClear = false;
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }

    this.nullBasket = new Component(this.root, 'h1', ["nullbasket"], "Корзина пуста");

    this.fullBasket = new Component(this.root, 'div', ["fullbasket"]);
    this.toggleBasket(isBasketClear);

    const divDate = new Component(this.fullBasket.root, 'div', ["basket__div-date"]);
    services.dbService.getAllDates().then((dates) => {
      divDate.root.innerHTML = '';
      this.putDateOnPage(divDate, dates);
    });


    new Component(this.fullBasket.root, 'span', ["basket-span"], "Выберите желаемые услуги:")

    const divManicure = new Component(this.fullBasket.root, 'div', ["catalog__manicure"]);
    new Component(divManicure.root, 'span', ["title__section"], 'Маникюр');
    this.divGoodManicure = new Component(divManicure.root, 'div', ["basket__section"]);
    new Component(this.divGoodManicure.root, 'span', ["title__section__basket"], 'Тип маникюра:');

    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodsInBasketManicure(this.divGoodManicure, el);
      });
    };
    services.dbService.addListener('goodInBasket', (tovar) => {//при команде "bookInBasket"
      this.putGoodsInBasketManicure(this.divGoodManicure, tovar as TGood);
      this.toggleBasket(true);
    });

    this.divGoodCover = new Component(divManicure.root, 'div', ["basket__section"]);
    new Component(this.divGoodCover.root, 'span', ["title__section__basket"], 'Вид покрытия:');

    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodsInBasketCover(this.divGoodCover, el);
      });
    };
    services.dbService.addListener('goodInBasket', (tovar) => {//при команде "bookInBasket"
      this.putGoodsInBasketCover(this.divGoodCover, tovar as TGood);
      this.toggleBasket(true);
    });

    const divPedicure = new Component(this.fullBasket.root, 'div', ["catalog__pedicure"]);
    new Component(divPedicure.root, 'span', ["title__section"], 'Педикюр');
    this.divGoodPedicure = new Component(divPedicure.root, 'div', ["basket__section"]);
    new Component(this.divGoodPedicure.root, 'span', ["title__section__basket"], 'Вид педикюра:');

    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodsInBasketPedicure(this.divGoodPedicure, el);
      });
    };
    services.dbService.addListener('goodInBasket', (tovar) => {//при команде "bookInBasket"
      this.putGoodsInBasketPedicure(this.divGoodPedicure, tovar as TGood);
      this.toggleBasket(true);
    });

    const divCare = new Component(this.fullBasket.root, 'div', ["catalog__care"]);
    new Component(divCare.root, 'span', ["title__section"], 'Уходовые процедуры');
    this.divGoodCare = new Component(divCare.root, 'div', ["basket__section"]);

    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodsInBasketCare(this.divGoodCare, el);
      });
    };
    services.dbService.addListener('goodInBasket', (tovar) => {//при команде "bookInBasket"
      this.putGoodsInBasketCare(this.divGoodCare, tovar as TGood);
      this.toggleBasket(true);
    });

    const sale = new Component(this.fullBasket.root, 'p', ["basket__sale"], "Предоставляется скидка при записи на комплексы услуг:");
    new Component(sale.root, 'li', [], "маникюр+педикюр 5%");
    new Component(sale.root, 'li', [], "маникюр+педикюр+уход 7%");

    const total = new Component(this.fullBasket.root, 'div', ["total__basket-inner"]);
    this.spanSumma = new Component(total.root, 'span', ["basket-sum"], `Итого сумма, руб:        ${services.dbService.dataBasket.summa} руб`);
    this.spanPercent = new Component(total.root, 'span', ["basket-sum"], `Скидка, руб: ${services.dbService.dataBasket.summa * services.dbService.dataBasket.percent / 100} руб`);
    this.spanAllSumma = new Component(total.root, 'span', ["basket-sum"], `Итого сумма со скидкой, руб: ${services.dbService.dataBasket.allSumma} руб`);

    services.dbService.addListener('changeDataBasket', (dataBasket) => {//при изменении в корзине
      this.spanSumma.root.innerHTML = `Итого сумма: ${(dataBasket as TDataBasket).summa} руб`;
      this.spanPercent.root.innerHTML = `Скидка: ${((dataBasket as TDataBasket).summa * (dataBasket as TDataBasket).percent / 100)} руб`;
      this.spanAllSumma.root.innerHTML = `Итого сумма со скидкой: ${(dataBasket as TDataBasket).allSumma} руб`;
      let isBasketClear = false;
      if (services.dbService.dataUser) {
        if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
      }
      this.toggleBasket(isBasketClear);
    });

    const divOplata = new Component(this.fullBasket.root, 'input', ["basket__oplata"], null, ["type", "value"], ["button", "Оформить запись"])
    divOplata.root.onclick = () => {
      const user = services.authService.user;
      services.dbService.addBasketInHistory(user);
    };

    services.dbService.addListener("clearBasket", () => {//очистить корзину
      this.fullBasket.root.innerHTML = '';
      this.toggleBasket(false);
    });
  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.nullBasket.remove();
      this.fullBasket.render();
    } else {
      this.nullBasket.render();
      this.fullBasket.remove();
    }
  }
  putDateOnPage(teg: Component, dates: TDate[]) {
    dates.forEach((time) => {
      new CardDate(teg.root, this.services, time);
    })
  }
  putGoodsInBasketManicure(teg: Component, goods: TGood) {
    if (goods.type == 'маникюр') {
      new CardBasket(teg.root, this.services, goods);
    }

  }
  putGoodsInBasketCover(teg: Component, goods: TGood) {
    if (goods.type == 'покрытие') {
      new CardBasket(teg.root, this.services, goods);
    }
  }
  putGoodsInBasketPedicure(teg: Component, goods: TGood) {
    if (goods.type == 'педикюр') {
      new CardBasket(teg.root, this.services, goods);
    }
  }
  putGoodsInBasketCare(teg: Component, goods: TGood) {
    if (goods.type == 'уходовые процедуры') {
      new CardBasket(teg.root, this.services, goods);
    }

  }
}