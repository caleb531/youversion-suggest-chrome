import OptionsFieldComponent from './options-field.jsx';
import SwitchComponent from './switch.jsx';

class BooleanFieldComponent {
  view({ attrs }) {
    return (
      <OptionsFieldComponent
        id={attrs.id}
        label={attrs.label}
        control={
          <SwitchComponent
            id={attrs.id}
            checked={attrs.preferences[attrs.id]}
            onchange={attrs.onchange}
          />
        }
      />
    );
  }
}

export default BooleanFieldComponent;
