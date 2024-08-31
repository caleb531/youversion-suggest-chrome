import m from 'mithril';

class OptionsFieldComponent {
  oninit({ attrs }) {
    Object.assign(this, attrs);
  }

  view({ attrs }) {
    return m(`div.options-field.option-container-${attrs.id}`, [
      m('.options-cell', m('label', { for: attrs.id }, attrs.label)),
      m('.options-cell', attrs.control)
    ]);
  }
}

export default OptionsFieldComponent;
