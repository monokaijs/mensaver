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
        patch('FriendingCometPYMKCard.react', this, arguments, function (orgFunc, that, args) {
          const react = window.require('react');
          const originalComponent = orgFunc.bind(that)(...args);
          const props = args[0];
          return SmartCover("Cảnh báo, người giới tính NAM này có trong danh sách bạn bè của Sếp bạn. Bạn có CHẮC CHẮN muốn thêm người này vào danh sách bạn bè?", originalComponent);
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
  const [cover, setCover] = react.useState(true);
  return react.jsx('div', {
    className: 'smart-cover-outer',
    children: [
      children,
      cover ? react.jsx('div', {
        className: 'smart-cover',
        children: [
          react.jsx('div', {
            className: 'message',
            children: message
          }),
          react.jsx('button', {
            children: 'Tiếp tục',
            onClick: () => {
              setCover(false);
            }
          })
        ]
      }) : null,
    ]
  })
}

const getUserMetaInfo = (uid) => {
  return graphQl('6090218654334102', {
    "actionBarRenderLocation": "WWW_COMET_HOVERCARD",
    "context": "DEFAULT",
    "entityID": "100089470155547",
    "includeTdaInfo": false,
    "scale": 1,
    "__relay_internal__pv__GlobalPanelEnabledrelayprovider": false,
    "__relay_internal__pv__CometGlobalPanelEMCopresencerelayprovider": false
  })
}

const getMutualFriends = (uid) => {
  return graphQl('4851781861605295', {
    "count": 10,
    "ordering": ["importance"],
    "userIDs": [uid]
  })
}

const graphQl = (docId, variables) => {
  const serialize = function (obj, prefix) {
    let str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  return fetch('https://www.facebook.com/api/graphql/', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: serialize({
      doc_id: docId,
      variables: JSON.stringify(variables),
      fb_dtsg: window.require('DTSGInitialData').token,
      server_timestamps: true,
    }),
  });
}
