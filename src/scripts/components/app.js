import m from 'mithril';

// The front-end application UI
class AppComponent {

  view(vnode) {
    const state = vnode.state;
    return m('div.app', [
      m('header.app-header', [
        m('h1.app-title', 'YouVersion Suggest'),
        m('input[type=text].search-input', {
          placeholder: 'Type a book, chapter, verse, or keyword'
        })
      ]),
      m('div.search-results', [
        // Search results from the reference filter (e.g. 1co13.3-7)
        state.filterResults ?
        m('ul.filter-results', [
          state.filterResults.map((result) => {
            return m('li.result.filter-result', [
              m('div.result-title', result.title),
              m('div.result-subtitle', result.subtitle)
            ]);
          })
        ]) : null
      ])
    ]);
  }

}

export default AppComponent;
