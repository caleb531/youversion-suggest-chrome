import m from 'mithril';

// An options menu for choosing an option
class OptionsMenuComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
  }

  view({attrs}) {
    return m('div.options-menu-container', [
      m('select', {
        id: attrs.id,
        onchange: attrs.onchange
      }, attrs.options.map((option) => {
        return m('option', {
          value: option.id,
          selected: option.id === attrs.value
        }, option.name);
      })),
      m('svg[viewBox="0 0 16 16"].options-menu-arrow', m('path', {
        d: 'M 2,6 L 8,12 L 14,6'
      }))
    ]);
  }

}

export default OptionsMenuComponent;
