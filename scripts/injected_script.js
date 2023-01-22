function patch(moduleName, that, args, patchFunction, patchKey = "default") {
  if (args[0] === moduleName) {
    const orig = args[2];
    args[2] = function (a, b, c, d, e, f, g, h) {
      let res = orig.apply(that, arguments);
      for (let i = arguments.length - 1; i >= 0; i--) {
        if (arguments[i]?.[patchKey]) {
          const origFunction = arguments[i][patchKey];
          arguments[i][patchKey] = function () {
            return patchFunction(origFunction, this, arguments);
          };
          break;
        }
      }
      return res;
    };
  }
}

let __dOrig = window.__d;
Object.defineProperty(window, "__d", {
  get() {
    return function () {
      try {
        const doPatch = () => {
          patch('VideoPlayerRelay.react', this, arguments, function (orgFunc, that, args) {
            const react = window.require('react');
            const [loading, setLoading] = react.useState(false);
            const originalComponent = orgFunc.bind(that)(...args);
            return originalComponent;
          });
        };
        doPatch();
        return __dOrig.apply(this, arguments);
      } catch (e) {
        console.log("error", e);
      }
    };
  }, set(val) {
    __dOrig = val;
  },
});

console.log('Injected Script');
