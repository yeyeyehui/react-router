const Action = {
  Pop: "POP",
  Push: "PUSH",
};

const PopStateEventType = "popstate";

let action = Action.Pop;

/**
 * 创建哈希路由
 * @return {*} 返回路由跳转所有的方法和当前路由属性对象
 */
export function createHashHistory() {
  if (!window.location.hash) {
    window.location.hash = "/";
  }

  /**
   * 获取当前路由属性对象
   * @param {*} { pathname state }
   */
  function getHashLocation(window, globalHistory) {
    const pathname = window.location.hash.substr(1);
    const state = globalHistory.state || {};
    return { pathname, state: state };
  }

  // 对路由进行AOP，因为哈希有#所有需要进行特殊操作
  function createHashHref(to) {
    let url = window.location.href;
    
    let hashIndex = url.indexOf("#");
    
    let href = hashIndex == -1 ? url : url.slice(0, hashIndex);

    return href + "#" + to; // /user#/profile
  }

  // 返回路由跳转所有的方法和当前路由属性对象
  return getUrlBasedHistory(getHashLocation, createHashHref);
}

/**
 * 创建Browser路由
 * @return {*} 返回路由跳转所有的方法和当前路由属性对象
 */
export function createBrowserHistory() {
  /**
   * 获取当前路由属性对象
   * @param {*} { pathname state }
   */
  function getBrowserLocation(window, globalHistory) {
    const { pathname } = window.location;

    const state = globalHistory.state || {};

    return { pathname, state: state };
  }

  // 对路由进行AOP
  function createBrowserHref(to) {
    return to;
  }

  // 返回路由跳转所有的方法和当前路由属性对象
  return getUrlBasedHistory(getBrowserLocation, createBrowserHref);
}

/**
 * 获取
 * @param {*} getLocation 获取Location对象
 * @param {*} createHref 获取跳转的地址
 */
function getUrlBasedHistory(getLocation, createHref) {
  const globalHistory = window.history;

  let listener = null;

  /*  let index = getIndex();
    if(index === null){
        index=0;
        globalHistory.replaceState({
            usr:globalHistory.state,//usr  userState
            idx:index//在原来的状态基础上添加了一个索引0
        },'');
    } */
  /* function getIndex(){
        let state = globalHistory.state ||{idx:null}
        return state.idx;
    } */

  // 只有第一次初始化的时候才执行
  function handlePop() {
    // 修改当前跳转的方式
    action = Action.Pop;

    //const nextIndex = getIndex();//1
    //index = nextIndex;//把1赋给index
    // 更新当前新的路由对象
    if (listener) {
      listener({ location: history.location });
    }
  }

  function push(to, state) {
    // 修改当前跳转的方式
    action = Action.Push;
    
    // index = getIndex()+1;//1
    // 创建一个新的url地址
    const url = createHref(to);

    // 在放入新的路径状态的时候，对状态做一个封装或者说加强
    // index指的是当前的索引
    globalHistory.pushState(state, "", url);

    // 更新当前新的路由对象
    if (listener) {
      listener({ location: history.location });
    }
  }
  
  let history = {
    get index() {
      //return index;
    },

    get action() {
      return action;
    },
    
    get location() {
      return getLocation(window, globalHistory);
    },
    
    //history.push 会跳转路径
    push,
    
    // 监听调用浏览器的前进、后退以及执行history.forward、history.back、和history.go触发，因为这些操作有一个共性，即修改了历史堆栈的当前指针
    listen(fn) {
      window.addEventListener(PopStateEventType, handlePop);
      
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
      
        listener = null;
      };
    },
    
    // 前进后退
    go(n) {
      return globalHistory.go(n);
    },
  };

  // history对象挂载到window中
  window.his = history;

  return history;
}
