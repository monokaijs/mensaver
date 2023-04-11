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
  return new Promise((resolve, reject) => {
    getUserMetaInfo(userId).then(data => {
      if (data && data.node && data.node['comet_hovercard_renderer'] && data.node['comet_hovercard_renderer'].user) {
        const user = data.node['comet_hovercard_renderer'].user;
        const primaryActions = user['primaryActions'] || [];
        const friendAction = primaryActions.find(x => x['__typename'] === 'ProfileActionFriendRequest');
        const profileAction = friendAction?.client_handler?.profile_action;
        const profileOwner = profileAction?.restrictable_profile_owner;
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
        patch('CometFeedStory.react', this, arguments, function (orgFunc, that, args) {
          const react = window.require('react');
          const originalComponent = orgFunc.bind(that)(...args);
          const [gender, setGender] = react.useState('');
          const props = args[0];
          const storyId = props?.story.id;
          let authorId;
          react.useEffect(() => {
            if (!storyId) return;
            (async () => {
              const decodedStoryId = atob(storyId);
              console.log('decoded', decodedStoryId);
              if (decodedStoryId.startsWith('S:_I') && !decodedStoryId.includes('/')) {
                authorId = decodedStoryId.replace('S:_I', '').split(':')[0];
              } else {
                const account = await getPostAuthor(storyId);
                authorId = account.id;
              }
              const userGender = await getProfileGender(authorId);
              console.log('gender', userGender);
              setGender(userGender);
            })();
          }, []);
          return SmartCover(gender, originalComponent, true);
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

const SmartCover = (gender, children, isPost = false) => {
  const react = window.require('react');
  const [cover, setCover] = react.useState(true);
  if (gender === 'MALE') return children;
  return react.jsx('div', {
    className: 'smart-cover-outer',
    children: [
      children,
      cover ? react.jsx('div', {
        className: isPost ? 'smart-cover post': 'smart-cover',
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

const getPostAuthor = async (storyId) => {
  const response = await graphQl('5874694995986171', {
    "UFI2CommentsProvider_commentsKey": "CometSinglePostRoute",
    "displayCommentsContextEnableComment": null,
    "displayCommentsContextIsAdPreview": null,
    "displayCommentsContextIsAggregatedShare": null,
    "displayCommentsContextIsStorySet": null,
    "displayCommentsFeedbackContext": null,
    "feedbackSource": 2,
    "feedLocation": "PERMALINK",
    "focusCommentID": null,
    "hasScenario": false,
    "privacySelectorRenderLocation": "COMET_STREAM",
    "renderLocation": "permalink",
    "scale": 1.5,
    "storyID": storyId,
    "useDefaultActor": false,
    "__relay_internal__pv__GroupsCometDelayCheckBlockedUsersrelayprovider": false,
    "__relay_internal__pv__IsWorkUserrelayprovider": false,
    "__relay_internal__pv__IsMergQAPollsrelayprovider": false,
    "__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider": false,
    "__relay_internal__pv__StoriesRingrelayprovider": false
  }).then(r => r.text());
  if (response && response.split('\n')[0]) {
    try {
      const storyData = JSON.parse(response.split('\n')[0]);
      const storyActors = storyData?.data?.node?.comet_sections?.content?.story?.actors || [];
      if (storyActors.length === 0) throw new Error("Failed to get actors");
      return storyActors[0];
    } catch (e) {
      throw new Error(e.message || "Failed to parse story information");
    }
  } else {
    throw new Error("Failed to parse");
  }
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

var __menSaverAppSettings = {};
var chromeMessageListeners = {};
window.document.addEventListener('chrome-message', e => {
  console.log(e);
  const event = e.detail;
  const action = event.action;
  if (chromeMessageListeners[action] && chromeMessageListeners[action].length) {
    for (let fn of chromeMessageListeners[action]) {
      if (fn && typeof fn === 'function') {
        fn(event);
      }
    }
  }
  if (action === 'set-settings') {
    __menSaverAppSettings = event.settings;
  }
});

function addChromeMessageListener(action, fn) {
  chromeMessageListeners[action] = chromeMessageListeners[action] ? [
    ...chromeMessageListeners[action],
    fn
  ] : [fn];
}
