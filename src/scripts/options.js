import m from 'mithril';

class OptionsComponent {

  view() {
    return ('div.options-page', [
      m('header.options-header', [
        m('img.options-header-logo', {
          src: 'icons/icon-square.svg',
          alt: 'YouVersion Suggest'
        }),
        m('h1.options-page-title', 'YouVersion Suggest Options')
      ])
    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
