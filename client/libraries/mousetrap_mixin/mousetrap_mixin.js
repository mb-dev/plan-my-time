export default class MousetrapMixin {
  constructor() {
    this.mousetrapBindings = [];
  }
  bindShortcut(key, callback) {
      Mousetrap.bind(key, callback);

      this.mousetrapBindings.push(key);
  }
  unbindShortcut(key) {
      var index = this.mousetrapBindings.indexOf(key);

      if (index > -1) {
          this.mousetrapBindings.splice(index, 1);
      }

      Mousetrap.unbind(binding);
  }
  unbindAllShortcuts() {
      if (this.mousetrapBindings.length < 1) {
          return;
      }

      this.mousetrapBindings.forEach(function (binding) {
          Mousetrap.unbind(binding);
      });
  }
}
