import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";



export class Header extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "header", ["header"]);

    const logotip = new Component(this.root, 'a', ["header__logo"], null, ["href"], ["#"]);
    new Component(logotip.root, 'img', null, null, ["src", "alt"], ["./assets/logo.svg", "logotip"]);

    //Вот же ж блеан, не получается менять их тогда, когда нужно. Я злюся

    const icons = new Component(this.root, 'div', ["header__icons"]);
    const catalog = new Component(icons.root, 'input', ["catalogBlack"], null, ["type", "value"], ["button", ""]);
    catalog.root.onclick = () => {
      window.location.hash = '#catalog';
      (catalog.root as HTMLElement).classList.remove('catalogBlack');
      (catalog.root as HTMLElement).classList.add('catalogWhite');
      (basket.root as HTMLElement).classList.add('basketBlack');
      (basket.root as HTMLElement).classList.remove('basketWhite');
      (account.root as HTMLElement).classList.add('accountBlack');
      (account.root as HTMLElement).classList.remove('accountWhite');
    }
    const basket = new Component(icons.root, 'input', ["basketBlack"], null, ["type", "value"], ["button", ""]);
    basket.root.onclick = () => {
      window.location.hash = '#basket';
      (catalog.root as HTMLElement).classList.add('catalogBlack');
      (catalog.root as HTMLElement).classList.remove('catalogWhite');
      (basket.root as HTMLElement).classList.remove('basketBlack');
      (basket.root as HTMLElement).classList.add('basketWhite');
      (account.root as HTMLElement).classList.add('accountBlack');
      (account.root as HTMLElement).classList.remove('accountWhite');
    }
    const account = new Component(icons.root, 'input', ["accountBlack"], null, ["type", "value"], ["button", ""]);
    account.root.onclick = () => {
      window.location.hash = '#account';
      (catalog.root as HTMLElement).classList.add('catalogBlack');
      (catalog.root as HTMLElement).classList.remove('catalogWhite');
      (basket.root as HTMLElement).classList.add('basketBlack');
      (basket.root as HTMLElement).classList.remove('basketWhite');
      (account.root as HTMLElement).classList.remove('accountBlack');
      (account.root as HTMLElement).classList.add('accountWhite');
    }

  }
}