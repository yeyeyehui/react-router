//如果路径有*这个通配符，分数减2
const splatPenalty = -2;
const indexRouteValue = 2;
//匹配路径参数正则
const paramRegexp = /^:\w+$/;
const dynamicSegmentValue = 3;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const isSplat = (s) => s === "*";
/**
 * 计算每个路径对应的分数
 * @param {*} path
 * @param {*} index
 */
function computeScore(path, index) {
  //path  /user/list   /user/*/list
  //先用/进行分隔路径
  const segments = path.split("/"); //['',user,list]  score=26
  //初始分数就是片段数组的长度
  let initialScope = segments.length; //3
  if (segments.some(isSplat)) {
    initialScope += splatPenalty; //splatPenalty=-2 1
  }
  if (typeof index !== undefined) {
    initialScope += indexRouteValue; //indexRouteValue=2 5
  } //[''=1,user=10,list=10] 21+5=26
  return segments
    .filter((s) => !isSplat(s))
    .reduce((score, segment) => {
      let currentScore = 0;
      if (paramRegexp.test(segment)) {
        currentScore += dynamicSegmentValue; //3
      } else {
        if (segment === "") {
          currentScore += emptySegmentValue; //1
        } else {
          currentScore += staticSegmentValue; //10
        }
      }
      score += currentScore;
      return score;
    }, initialScope); //5
}

/**
 * 获取路由匹配的结果
 * @param {*} routes 路由配置数组[{path,element}]
 * @param {*} location {pathname}
 */
export function matchRoutes(routes, location) {
  const { pathname } = location;

  let branches = flattenRoutes(routes);

  console.log("====================================");
  console.log(branches);
  console.log("====================================");

  rankRouteBranches(branches);

  let matches = null;

  for (let i = 0; matches === null && i < branches.length; i++) {
    matches = matchRouteBranch(branches[i], pathname);
  }

  return matches;
}

/**
 * 打平所有的分支
 * @param {*} routes 路由配置数组
 * @param {*} branches 最后返回的分支数组
 * @param {*} parentsMeta 父meta数组
 * @param {*} parentPath 父路径
 * @returns
 */
function flattenRoutes(
  routes,
  branches = [],
  parentsMeta = [],
  parentPath = ""
) {
  function flattenRoute(route, index) {
    let meta = {
      relativePath: route.path, //此route或者说此meta的相对路径
      route, //此meta对应的路由信息path element
      childrenIndex: index, //此route在父亲中的位置,只不过后面可以用计算排名
    };

    let routePath = joinPaths([parentPath, meta.relativePath]); //  /user/list

    // 存储当前路由信息
    const routesMeta = [...parentsMeta, meta];

    // 有子路由进行递归处理
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, routePath);
    }

    // 存储到打平数组中
    branches.push({
      path: routePath,
      routesMeta,
      score: computeScore(routePath, route.index),
    });
  }

  routes.forEach((route, index) => {
    flattenRoute(route, index);
  });

  return branches;
}

function rankRouteBranches(branches) {
  branches.sort((a, b) => {
    return b.score !== a.score
      ? b.score - a.score
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex)
        );
  });
}
/**
 * a={path:'/user/add',routesMeta:[{childrenIndex:1},{childrenIndex:1}]}
 * b={path:'/user/list',routesMeta:[{childrenIndex:1},{childrenIndex:0}]}
 *
 * a=[1,2,4,1]
 * b=[1,2,4,0]
 *
 * c
 * d 分数，也不是兄弟
 */

function compareIndexes(a, b) {
  let sibling =
    a.length === b.length && a.slice(0, -1).every((n, i) => n == b[i]);
  return sibling ? a[a.length - 1] - b[a.length - 1] : 0;
}

export function matchRouteBranch(branch, pathname) {
  //pathname     /user/list
  //routesMeta=[/userMeta,listMeta]
  let { routesMeta } = branch;
  //已经匹配过路径名
  let matchedPathname = "/";
  let matchedParams = {};
  let matches = [];
  for (let i = 0; i < routesMeta.length; i++) {
    //取出当前的meta
    const meta = routesMeta[i];
    //判断是否是最后一个meta
    const end = i === routesMeta.length - 1;
    //获取剩下的要匹配的路径名
    const remainingPathname =
      matchedPathname === "/"
        ? pathname
        : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({ path: meta.relativePath, end }, remainingPathname);
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    //计算已经匹配好的路径名 TODO
    matchedPathname = joinPaths([matchedPathname, match.pathname]);
    //放入配置的结果对象
    matches.push({
      params: matchedParams, //路径参数对象
      route, //路由对象{path,element}
      pathname: matchedPathname, //到此为止匹配的路径 /user/add
    });
  }
  return matches;
}


/**
 * 使用 joinPaths 函数将父路径与当前相对路径组合，生成完整路径
 * @param {*} paths [父路径，当前相对路径]
 * @returns 返回完成的拼接好的父路径与当前相对路径组合
 */
function joinPaths(paths) {
  //['/user/','/add']=>/user///add=>/user/add
  return paths.join("/").replace(/\/\/+/g, "/");
}

export function matchPath({ path, end }, pathname) {
  const [matcher, paramNames] = compilePath(path, end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let captureGroups = match.slice(1); //100
  let params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = captureGroups[index];
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
  };
}

function compilePath(path, end = true) {
  let paramNames = [];
  // /:name => /([^\\/]+)
  let regexpSource =
    "^" +
    path
      .replace(/\/+$/, "") ///    /user/   /user// /user///
      .replace(/^\/*/, "/") // 把开头的0个或多个/变成一个/  /user,user=>//user=>/user
      .replace(/\/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "/([^\\/]+)";
      });
  if (path === "*") {
    paramNames.push("*");
    regexpSource += "(.*)$";
  }
  if (end) {
    regexpSource += "$";
  }
  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}
