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

console.log('works');

const getProfileGender = (userId) => {
  console.log('get-profile-gender', userId);
  return new Promise((resolve, reject) => {
    getUserMetaInfo(userId).then(data => {
      if (data && data.node && data.node['comet_hovercard_renderer'] && data.node['comet_hovercard_renderer'].user) {
        const user = data.node['comet_hovercard_renderer'].user;
        const primaryActions = user['primaryActions'] || [];
        const friendAction = primaryActions.find(x => x['__typename'] === 'ProfileActionFriendRequest');
        const profileAction = friendAction?.client_handler?.profile_action;
        const profileOwner = profileAction?.restrictable_profile_owner;
        console.log('profile-owner', profileOwner);
        if (profileOwner) {
          resolve(profileOwner.gender);
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  });
}

let __dOrig = window.__d;
Object.defineProperty(window, "__d", {
  get() {
    return function () {
      try {
        patch('FriendingCometFriendRequestsCard.react', this, arguments, function (orgFunc, that, args) {
          console.log('FriendingCometFriendRequestsCard.react');
          const react = window.require('react');
          const originalComponent = orgFunc.bind(that)(...args);
          const props = args[0];
          const user = props.user;
          const [showCover, setShowCover] = react.useState(false);
          const [gender, setGender] = react.useState('');
          react.useEffect(() => {
            getProfileGender(user.id).then(g => {
              setGender(g);
            });
          }, []);
          return SmartCover(gender, originalComponent);
        });
        patch('FriendingCometPYMKCard.react', this, arguments, function (orgFunc, that, args) {
          const react = window.require('react');
          const originalComponent = orgFunc.bind(that)(...args);
          const props = args[0];
          const user = props.user;
          const [gender, setGender] = react.useState('');
          react.useEffect(() => {
            getProfileGender(user.id).then(g => {
              setGender(g);
            });
          }, []);
          return SmartCover(gender, originalComponent);
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

const SmartCover = (gender, children) => {
  const react = window.require('react');
  const [cover, setCover] = react.useState(true);
  if (gender === 'MALE') return children;
  return react.jsx('div', {
    className: 'smart-cover-outer',
    children: [
      children,
      cover ? react.jsx('div', {
        className: 'smart-cover',
        children: [
          react.jsx('div', {
            className: 'message',
            children: 'CẢNH BÁO!!! Đây là gái, có người yêu rồi thì đừng dại bấm vào'
          }),
          react.jsx('button', {
            children: 'Kệ tao',
            onClick: () => {
              setCover(false);
            }
          })
        ]
      }) : null,
    ]
  })
}

const getUserMetaInfo = async (uid) => {
  const response = await graphQl('6090218654334102', {
    "actionBarRenderLocation": "WWW_COMET_HOVERCARD",
    "context": "DEFAULT",
    "entityID": uid,
    "includeTdaInfo": false,
    "scale": 1,
    "__relay_internal__pv__GlobalPanelEnabledrelayprovider": false,
    "__relay_internal__pv__CometGlobalPanelEMCopresencerelayprovider": false
  }).then(r => r.json());
  return response.data;
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
