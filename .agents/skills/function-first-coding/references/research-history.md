# Function-first coding — decision record

> 2026-11-15。历史与推导资料，**不在普通编码任务中默认加载**。本记录解释本 Skill 的来源和局限；当前任务、项目规范及更新后的实证优先。

## 问题与观察

- 在 LabourChain 的真实浏览器截图中，Repo Home、Members/Register、Config 等页面报告 `Failed to execute 'fetch' on 'Window': Illegal invocation`。相关入口和需求见 [hackathon-platform #76](https://github.com/Ri0n72Y/hackathon-platform/issues/76) 与 [#51](https://github.com/Ri0n72Y/hackathon-platform/issues/51)。
- 与此同时，合并 [PR #75](https://github.com/Ri0n72Y/hackathon-platform/pull/75#issuecomment-6894361156) 后的 Vercel HTTP 复测表明，六项服务端 GET 在没有 GitHub OAuth 会话时正常返回真实业务数据。**服务端 GET 成功不能证明浏览器 UI 正常**。
- [Repo Home HTTP Service 源码](https://github.com/Ri0n72Y/hackathon-platform/blob/46b1798f26f08561d247842c986fede54c32073d/plugins/repo-home/src/service.ts) 使用 `constructor(private readonly fetcher: typeof fetch = fetch)`，再经 `this.fetcher(...)` 调用。脱离宿主接收者调用原生函数**可能**触发该异常，是可验证的根因假设；本记录不宣称已在真实浏览器完成归因实验。
- 实际维护者反馈：多行操作优先独立具名函数，最后导出 `const api = { members, addMember }`；避免普通 HTTP 客户端的 Class、实例注入和动态方法重赋值；不为了不可变性惯例性添加 `Readonly` 等包装。此为**明确的编码偏好**，尚无跨项目结果证明任何 Class 都造成问题。

## 备选与取舍

| 方案 | 判断 |
| --- | --- |
| 保留 HTTP Class，仅对 `fetch` 做 `bind` | 可处理接收者问题，但继续保留项目目前不希望用于普通 HTTP API 的实例结构 |
| 使用独立函数 + 模块级静态 `api` 对象 | 选作新建普通 API 的默认写法：入口直观、少一个实例生命周期；是否提升质量仍需实践检验 |
| 对所有调用创建函数工厂 | 多环境和隔离测试时有价值；一般模块会增加层次 |
| 对所有对象使用 `Readonly` / 冻结 | 能提供额外的类型或运行时保护，但在本偏好中不应作为强制模板；数据所有权与 React 状态规则仍要遵守 |
| 全面移除 Class | 拒绝：Cordis 与其他框架可能要求实例身份或生命周期，参考 [function-first Cordis guide](../../../../library/function-first-cordis-plugin-programming.md) |

## 社区依据与适用边界

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) 支持有意义的具名函数、避免冗余类型；**不能据此声称社区统一规定** `export const api = { ... }` 或全面禁用 Class。
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) 支持使用类型推断。
- [React Rules](https://react.dev/reference/rules/components-and-hooks-must-be-pure)、[Updating Objects in State](https://react.dev/learn/updating-objects-in-state) 区分局部修改与 React State 修改。它们不要求任意普通 JavaScript 对象都冻结。
- [agent-identity skill-authoring](../../skill-authoring/SKILL.md) 要求只保留能实质改善重复任务的指令，项目硬约束由项目持有，并对缺少证据的规则保持可修订。

## 尚未验证与复核条件

- 待在真实浏览器复现接收者故障，比较正确调用形式与错误形式，不能仅凭 HTTP 成功认定 UI 修复。
- 待在一项普通 HTTP API 重构和一项合理保留框架 Class 的真实审查中验证：该 Skill 是否降低隐式状态、改进可读性、是否产生机械禁用 Class 的误报。
- 若实践显示静态 API 对象无法满足明确的多实例生命周期或可测试性需求，应放宽相关默认；若新规则引入大量样板或没有可观察收益，应删除而非继续累加条款。

历史证据是可复查的决策线索，不能替代当下对源码、契约和运行结果的核查。
