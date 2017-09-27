import m from 'mithril';

class OptionsComponent {

  view() {
    return m('div.options-page');
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
