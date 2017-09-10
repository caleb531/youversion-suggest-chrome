import m from 'mithril';

class AppComponent {

  view() {
    return m('div.app', [
      m('header.app-header', [
        m('h1.app-title', 'YouVersion Suggest'),
        m('input[type=text].search-input', {
          placeholder: 'Type a book, chapter, verse, or keyword'
        })
      ])
    ]);
  }

}

export default AppComponent;
