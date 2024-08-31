import m from 'mithril';

// A generic loading icon
class LoadingIconComponent {
  view() {
    return m('svg[viewBox="0 0 320 320"].loading-icon', [
      m('path[d="M 40,160 A 80,80 0,0,0 280,160"]')
    ]);
  }
}

export default LoadingIconComponent;
