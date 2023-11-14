import React from "react";

import { LocationContext, NavigatorContext, RouteContext } from "./context";

import { matchRoutes } from "../../router";

/**
 * 通过react context获取location路由数据对象
 */
export function useLocation() {
  const { location } = React.useContext(LocationContext);

  return location;
}

/**
 * 这是一个自定义hooks
 * 用当前的路径和routes里面的path进行匹配，如果匹配上就渲染对应的element
 */
export function useRoutes(routes) {
  const location = useLocation();

  const { pathname } = location; // / /user /profile
  
  const matches = matchRoutes(routes, { pathname });
  
  if (matches) {
    return renderMatches(matches);
  }
}

function renderMatches(renderMatches) {
  //matches = [{route:{element:User}},{route:{element:UserList}}]
  let result = renderMatches.reduceRight((outlet, match, index) => {
    const matches = renderMatches.slice(0, index + 1);
    return (
      <RouteContext.Provider value={{ outlet, matches }}>
        {match.route.element}
      </RouteContext.Provider>
    ); //UserList
  }, null);
  return result;
}

export function useOutlet() {
  const value = React.useContext(RouteContext);
  return value.outlet;
}

/**
 * 跳转push方法
 */
export function useNavigate() {
  const { navigator } = React.useContext(NavigatorContext); //history

  let navigate = React.useCallback(
    (to, state) => {
      navigator.push(to, state);
    },
    [navigator]
  );

  return navigate;
}

/**
 * 获取Params参数
 */
export function useParams() {
  const { matches } = React.useContext(RouteContext);

  const routeMatch = matches[matches.length - 1];

  return routeMatch ? routeMatch.params : {};
}

/**
url = /1/zhufeng/16
<Route path="/:id" element={User}> match params {id:1}
    <Route path="/:name" element={UserName}>params {id:1,name:'zhufeng'}
        <Route path="/:age" element={UserNameAge}>params= {id:1,name:'zhufeng',age:16}

        </Route>
    </Route>
</Route>
 */
