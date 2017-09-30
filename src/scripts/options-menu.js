import autoBind from 'auto-bind';
import m from 'mithril';

// An options menu for choosing an option
class OptionsMenuComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  view() {
    return m('div.options-menu-container', [
      m('select', {
        id: this.id
      }, this.options.map((option) => {
        return m('option', {
          value: option.id,
          selected: option.id === this.preferences[this.preferenceKey]
        }, option.name);
      })),
      m('svg[viewBox="0 0 16 16"].options-menu-arrow', m('path', {
        d: 'M 2,6 L 8,12 L 14,6'
      }))
    ]);
  }

}

export default OptionsMenuComponent;
