import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class MainPage extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["mainpage"])

    const button = new Component(this.root, 'input', ["mainpage-btn"], null, ["type", "value"], ["button", "Каталог"]);
    button.root.onclick = () => {
      window.location.hash = "#catalog";
    }

    new Component(this.root, 'img', [], null, ['src', "alt"], ['./assets/Photo.png', "photo"]);
    new Component(this.root, 'p', ["mainpage__description"], "Xnails - студия маникюра в Бресте.")

    const slogan = new Component(this.root, 'div', [])
    new Component(slogan.root, 'span', ["mainpage__slogan"], "Мы знаем всё о ")
    new Component(slogan.root, 'span', ["mainpage__slogan-bold"], "красивом ")
    new Component(slogan.root, 'span', ["mainpage__slogan"], "и ")
    new Component(slogan.root, 'span', ["mainpage__slogan-bold"], "качественном ")
    new Component(slogan.root, 'span', ["mainpage__slogan"], "покрытии.")
  }
}