---
name: function-first-coding
description: 在 JavaScript/TypeScript 业务模块、前端 HTTP API、数据处理或相关 PR 的编码与审查中使用。优先具名函数与静态 API 对象，检查状态所有权、类型冗余、原生 API 调用上下文和不必要的 Class；React 组件分层另见 react-component-coding / react-component-review。
---

# Function-first coding

使业务代码的**入口、数据流、状态所有者和副作用**容易从源码直接辨认。默认用具名函数、模块级普通对象和 TypeScript 推断组织 JavaScript/TypeScript 代码，避免仅为组织方法建立 Class 实例或工厂层。编码时应用本 Skill；审查时依据实际 diff、调用方与可观察行为核对，不凭语法偏好要求无关重构。

## 函数与 API 组织

- 承担多行实现的 API 方法或独立业务操作，先定义具名 `function` / `async function`，再在文件末尾以 `export const api = { members, addMember }` 等对象属性简写集中导出。简单的一行映射、谓词或局部回调可以内联。
- 默认使用**稳定的模块级 `const` 普通对象**作为 API 目录，函数通过参数接收数据及必要配置。避免 `class MemberService`、`new MemberService()`、`this.fetcher`、可覆盖实例方法或仅用来转发函数的 Repository/Manager/Service 层。
- 不为了声明“不可变”而惯例性添加 `Readonly<T>`、`DeepReadonly<T>`、`Object.freeze()`、`as const` 或重复类型。跨模块实体、输入、返回值和外部边界在类型推断不足以表达契约时使用明确类型；局部变量依赖 TypeScript 推断。
- 测试或多环境确实需要独立依赖时，可以将函数依赖作为参数传入，或使用**返回普通对象的函数工厂**；只在有实际多个生命周期/配置的需求时创建工厂。不要动态重新赋值已导出的 API 对象或其方法，也不要为了测试把 HTTP 客户端改成 Class。
- `const` 只固定变量绑定，不能保证对象深层不可变。这里的“稳定”指对外 API **引用与公开方法不被任意替换**，不要求对运行时业务对象执行冻结。

```ts
type Member = { id: string; name: string }

async function members(): Promise<Member[]> {
  const response = await fetch('/api/members')
  if (!response.ok) throw new Error('Failed to load members')
  return response.json()
}

async function addMember(member: Member) {
  const response = await fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  })
  if (!response.ok) throw new Error('Failed to add member')
  return response.json()
}

export const api = { members, addMember }
```

代码示意只展示模块组织；实际项目的 URL、授权、参数、错误模型与响应校验由对应契约决定。

## 可变性与状态所有权

- 局部新建的对象、数组、Map 允许赋值、`push`、`sort`、循环和临时计算；没有必要把局部算法拆成一串不可读的不可变拷贝。
- 函数不得**意外修改调用方仍在持有的对象**。需要返回更新结果时，可先复制输入，在本地修改副本，再返回。明确以可变容器作为参数的 API 是例外，需通过函数名称与契约表达。
- 长生命周期状态要有明确所有者和写入入口。Members 等远端事实根据请求回读；Issues 等分页列表可以维护、合并和去重。不要把所有远端数据都固化为模块级快照，也不要把所有数据都强制实时重取。
- React props 和当前 State 视为不可直接修改；状态更新经组件拥有的 setter/reducer 提交，必要时在更新函数内先复制。局部草稿、计算中间值可以修改。异步请求需要遵守取消或过期结果保护，避免旧响应覆盖新状态。
- 隐藏在闭包、模块级 `let`、Class 私有字段中的可变状态都要审查；换成函数语法不自动消除隐式共享状态或副作用。

```ts
function mergeIssues(current: Issue[], incoming: Issue[]) {
  const items = [...current]
  const indexById = new Map(items.map((issue, index) => [issue.id, index]))

  for (const issue of incoming) {
    const index = indexById.get(issue.id)
    if (index === undefined) {
      indexById.set(issue.id, items.length)
      items.push(issue)
    } else {
      items[index] = issue
    }
  }
  return items
}
```

## 副作用与浏览器原生 API

- 将 fetch、存储、订阅和写入集中在**可辨识的函数入口或其真实生命周期边界**；把校验、解析、排序和转换等确定性计算提取为可独立调用的函数。不要为每个函数额外建立 service / domain / repository 多层包装。
- 浏览器宿主方法要保持正确调用接收者：直接 `fetch(url, init)` 或 `globalThis.fetch(url, init)`；不得将未绑定的 `window.fetch` 保存为实例字段后使用 `this.fetcher(...)`。需要测试替身时注入普通函数，并使默认适配器以宿主方法形式执行。
- 保持现有 HTTP 契约、凭证策略、AbortSignal、缓存、重试、异常和安全校验；风格重构不能改变认证权限或用吞错掩盖调用错误。
- 需要生命周期的 Cordis `Service`、第三方框架对象、真正依赖实例身份/封装的状态模型可以使用 Class。先确认框架接口需要什么；**不因本 Skill 把已有合理的框架 Class 强行改为闭包工厂**。参考仓库 `library/function-first-cordis-plugin-programming.md`。

## 与 React Skill 的分工

当修改 JSX/TSX 组件时，同时遵循 [React component coding](../react-component-coding/SKILL.md)：有实际职责区分时，功能组件处理业务 Hook / 数据请求，私有 `*View` 通过 props 处理展示和局部视觉行为；简单组件不机械拆分。独立组件风格评审使用 [React component review](../react-component-review/SKILL.md)。本 Skill 管理函数式业务模块、HTTP API 和可变性规则，**不重复规定组件目录或 View 的导出边界**。

## Coder 与 Reviewer 的完成条件

编码时：查看调用方和数据所有权，选择最小函数/模块结构；保持公共 API 签名与既有行为。审查时沿实际变更核对：

1. 多行业务方法是否具名、公共接口是否一眼可见；是否存在可消除的 API Class/实例、转发层、动态重赋值或不必要的类型包装。
2. 输入数据、局部副本、远端事实、React State、模块级共享状态分别由谁拥有；哪条路径能修改它们；是否可能跨请求泄漏、重复请求或出现旧响应回写。
3. I/O、错误及取消是否保持真实契约，尤其检查浏览器宿主方法的接收者、权限边界和不允许匿名写入的路径。
4. 测试是否保护**行为边界与真实失效机制**，而非断言必须使用某种语法。原生 `fetch` receiver 风险应有能区分正确与错误绑定的测试；真实浏览器/远程服务未验证时明确写“未验证”。

仅报告可定位的违规及实际风险，给出最小修正；不要因为出现局部 `let`、`push`、类型注解或框架 Class 就直接判失败。需要补充测试策略时参考 [Dependency risk testing](../dependency-risk-testing/SKILL.md)。

## 参考

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) — 具名函数与尽量减少冗余类型。
- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) — 类型推断与结构类型。
- [React: Components and Hooks Must Be Pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure) 与 [Updating Objects in State](https://react.dev/learn/updating-objects-in-state) — 局部修改和 React 状态所有权。
- [Function-first Cordis Plugin Programming](../../../library/function-first-cordis-plugin-programming.md) — 框架服务例外与生命周期。
