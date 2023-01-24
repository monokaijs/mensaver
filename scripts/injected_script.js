function patch(moduleName, context, args, patchFunction, exported = "default") {
  if (args[0] === moduleName) {
    const orig = args[2];
    args[2] = function (a, b, c, d, e, f, g, h) {
      let res = orig.apply(context, arguments);
      for (let i = arguments.length - 1; i >= 0; i--) {
        if (arguments[i]?.[exported]) {
          const origFunction = arguments[i][exported];
          arguments[i][exported] = function () {
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
        patch('FriendingCometFriendRequestsCard.react', this, arguments, function (orgFunc, that, args) {
          const react = window.require('react');
          const originalComponent = orgFunc.bind(that)(...args);
          const props = args[0];
          return SmartCover("comet", originalComponent);
        });
        return __dOrig.apply(this, arguments);
      } catch (e) {
        console.log("Patching Error", e);
      }
    };
  }, set(val) {
    __dOrig = val;
  },
});

const SmartCover = (message, children) => {
  const react = window.require('react');
  return react.jsx('div', {
    className: 'smart-cover-outer',
    children: [
      children,
      react.jsx('div', {
        className: 'smart-cover',
        children: [
          react.jsx('div', {
            children: message
          }),
          react.jsx('button', {
            children: 'Ok'
          })
        ]
      })
    ]
  })
}
