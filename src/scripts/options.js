import m from 'mithril';

class OptionsComponent {

  view() {
    return ('div.options', [
      m('h1', 'YouVersion Suggest Options')
    ]);
  }

}

m.mount(document.getElementById('main'), OptionsComponent);
