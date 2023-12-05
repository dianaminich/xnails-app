import { Component } from "../Abstract/Component";
import { TCriteria, TGood, TServices } from "../Abstract/Type";
import { CardGood } from "../Common/CardGood";

export class Catalog extends Component {
  criteria: TCriteria = {
    type: 'all',
    price: 'up'
  }
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["catalog"]);

    new Component(this.root, 'h1', ["title__page"], "Каталог услуг")

    const divCrit = new Component(this.root, 'div', ["catalog__criteria"]);
    const divBtn = new Component(divCrit.root, 'div', ["catalog__buttons"]);
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-type"], ["button", "Все услуги", "all"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-type"], ["button", "Маникюр", "маникюр"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-type"], ["button", "Педикюр", "педикюр"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-type"], ["button", "Уход. процедуры", "уходовые процедуры"])
    const divSort = new Component(divCrit.root, 'div', ["catalog__sort"]);
    new Component(divSort.root, 'span', [], 'Сортировать товары по цене:');
    const btnSort = new Component(divSort.root, 'input', ["catalog-sort"], null, ["type", "value", "data-price"], ["button", "", "up"]);

    Array.from(divBtn.root.children).forEach((el) => {
      if ((el as HTMLElement).dataset.type === this.criteria.type) {
        (el as HTMLElement).classList.add("active")
      } else {
        (el as HTMLElement).classList.remove("active")
      }
    })
    divBtn.root.onclick = (event) => {
      const param = (event.target as HTMLInputElement).dataset;
      if (!param.type) return;
      if (param.type) {
        this.criteria.type = param.type;
        Array.from(divBtn.root.children).forEach((el) => {
          if ((el as HTMLElement).dataset.type === this.criteria.type) {
            (el as HTMLElement).classList.add("active")
          } else {
            (el as HTMLElement).classList.remove("active")
          }
        })
      }
      if (param.type == 'all') {
        divManicure.render();
        divPedicure.render();
        divCare.render();
        button.remove();
        button.render();
      } else if (param.type == 'маникюр') {
        divManicure.render();
        divPedicure.remove();
        divCare.remove();
        button.remove();
        button.render();
      } else if (param.type == 'педикюр') {
        divManicure.remove();
        divPedicure.render();
        divCare.remove();
        button.remove();
        button.render();
      } else {
        divManicure.remove();
        divPedicure.remove();
        divCare.render();
        button.remove();
        button.render();
      }
    }
    btnSort.root.onclick = (event) => {
      const param = (event.target as HTMLElement).dataset;
      if (!param.price) return;
      if (param.price) this.criteria.price = param.price;


      services.dbService.getAllGoods(this.criteria).then((goods) => {
        divGoodManicure.root.innerHTML = '';
        this.putGoodOnPageManicure(divGoodManicure, goods);
        divGoodCover.root.innerHTML = '';
        this.putGoodOnPageCover(divGoodCover, goods);
        divGoodPedicure.root.innerHTML = '';
        this.putGoodOnPagePedicure(divGoodPedicure, goods);
        divGoodCare.root.innerHTML = '';
        this.putGoodOnPageCare(divGoodCare, goods);
      });

      if (param.price === 'up') {
        param.price = 'down';
      } else {
        param.price = 'up';
      }
    }

    const divManicure = new Component(this.root, 'div', ["catalog__manicure"]);
    new Component(divManicure.root, 'span', ["title__section"], 'Маникюр');
    const divGoodManicure = new Component(divManicure.root, 'div', ["catalog__section"]);
    services.dbService.getAllGoods(this.criteria).then((goods) => {
      divGoodManicure.root.innerHTML = '';
      this.putGoodOnPageManicure(divGoodManicure, goods);
    });
    const divGoodCover = new Component(divManicure.root, 'div', ["catalog__section"]);
    services.dbService.getAllGoods(this.criteria).then((goods) => {
      divGoodCover.root.innerHTML = '';
      this.putGoodOnPageCover(divGoodCover, goods);
    });

    const divPedicure = new Component(this.root, 'div', ["catalog__pedicure"]);
    new Component(divPedicure.root, 'span', ["title__section"], 'Педикюр');
    const divGoodPedicure = new Component(divPedicure.root, 'div', ["catalog__section"]);
    services.dbService.getAllGoods(this.criteria).then((goods) => {
      divGoodPedicure.root.innerHTML = '';
      this.putGoodOnPagePedicure(divGoodPedicure, goods);
    });

    const divCare = new Component(this.root, 'div', ["catalog__care"]);
    new Component(divCare.root, 'span', ["title__section"], 'Уходовые процедуры');
    const divGoodCare = new Component(divCare.root, 'div', ["catalog__section"]);
    services.dbService.getAllGoods(this.criteria).then((goods) => {
      divGoodCare.root.innerHTML = '';
      this.putGoodOnPageCare(divGoodCare, goods);
    });

    const button = new Component(this.root, 'input', ["catalog__button"], null, ["type", "value"], ["button", "Записаться"]);
    button.root.onclick = () => {
      window.location.hash = '#basket'
    }

  }
  putGoodOnPageManicure(teg: Component, goods: TGood[]) {
    goods.forEach((product) => {
      if (product.type == 'маникюр') {
        new CardGood(teg.root, this.services, product)
      }
    })
  }
  putGoodOnPageCover(teg: Component, goods: TGood[]) {
    goods.forEach((product) => {
      if (product.type == 'покрытие') {
        new CardGood(teg.root, this.services, product);
      }
    })
  }
  putGoodOnPagePedicure(teg: Component, goods: TGood[]) {
    goods.forEach((product) => {
      if (product.type == 'педикюр') {
        new CardGood(teg.root, this.services, product);
      }
    })
  }
  putGoodOnPageCare(teg: Component, goods: TGood[]) {
    goods.forEach((product) => {
      if (product.type == 'уходовые процедуры') {
        new CardGood(teg.root, this.services, product);
      }
    })
  }
}