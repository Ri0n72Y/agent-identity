# React + Cordis Web 插件开发指南

> **定位**：可复用的技术参考，不是自动加载的 Skill，也不是任何项目的强制约束。基于 [dsh-mindppt](https://github.com/Ri0n72Y/dsh-mindppt) 的独立 Cordis Runtime 实践，并参考 [DSH Web Client](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/web-client.md) 的 UI 装配边界。以下 `react-ui` 是我们的建议设计，并非 MindPPT 已提供的现成接口。

## 核心分工

**Cordis 是运行时，插件是功能单位，React 负责 UI，Vite 只负责网页开发与构建。**

| 层次 | 责任 | 不负责 |
| --- | --- | --- |
| Cordis | 服务发现、`inject` 依赖、插件激活/卸载与副作用清理 | React 渲染 |
| 数据插件 | fetch、领域状态、查询接口及变更通知 | JSX 和 DOM |
| UI 插件 | 消费 Cordis 服务，向 UI 服务贡献 React 组件 | 自建 React Root |
| `react-ui` 基础插件 | 提供 UI 注册服务和唯一的 React 组件树 | 业务数据 |
| Vite Playground | 网页入口、开发环境、插件模块交付 | 持有业务逻辑 |
| 未来 AI 消费者 | 通过受限能力目录查询当前服务/状态 | 无限制读取或执行整个 `ctx` |

Cordis 的 `Context` 是插件依赖容器，React 的 Context 是组件树内的数据传递机制；两者不应混为一谈。服务数据发生变化时，由 `getSnapshot/subscribe` 之类的可观察接口接入 React 的 `useSyncExternalStore`，再用 props 驱动展示组件。

## 推荐工作区

沿用 MindPPT 的 **`apps/* + plugins/*`**，而不是把 Cordis 插件放到 `apps/playground/src/plugins` 下：

```text
project/
├── apps/
│   └── playground/
│       ├── index.html
│       ├── vite.config.ts
│       ├── package.json
│       └── src/
│           ├── main.tsx       # 唯一浏览器/DOM 入口
│           └── runtime.ts     # Cordis 创建、插件组合及启停
├── plugins/
│   ├── react-ui/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts       # Cordis UI 服务
│   │       ├── registry.ts    # 最小组件注册表
│   │       └── App.tsx        # React UI 宿主
│   ├── user-identity/
│   │   ├── package.json
│   │   └── src/index.ts       # 纯获取与状态服务
│   └── user-card/
│       ├── package.json
│       └── src/
│           ├── index.tsx      # Cordis 组件注册
│           └── UserCard.tsx   # 功能组件 + 私有 View
├── package.json
└── pnpm-workspace.yaml
```

每个插件拥有自己的依赖声明和 Cordis 入口。服务提供方导出公共 **TypeScript 类型**；消费方可 `import type` 这些契约，但不应运行时导入提供方的实现。不要仅为一个类型提前创建独立 `contracts` 包。`react-ui` 是实际 UI 注册能力的所有者，因此当前不需要另设通用 Slots 平台。

## 最小贯通示例：Identity → Card

`user-identity` 只暴露用户状态及订阅契约，不依赖 React：

```ts
type IdentityState =
  | { status: 'loading' | 'unknown' | 'error' }
  | { status: 'ready'; user: { id: string; name: string; avatarUrl?: string } }

interface UserIdentity {
  getSnapshot(): IdentityState
  subscribe(listener: () => void): () => void
}
```

数据插件通过 Cordis 的 `Service` 或 `ctx.provide('userIdentity', service)` 提供服务；fetch、取消及状态发布属于该插件生命周期。无变化时 `getSnapshot()` 必须保持返回值引用稳定；数据变化时更新快照并通知订阅者。`ready` 代表已取得符合要求的用户记录；若数据来自公开 JSON，它**不等于**安全意义上的登录认证。

`user-card` 则声明服务依赖，并通过**我们定义的** `reactUI.register` 接口贡献 React 组件（此接口不是 Cordis 内置 API）：

```tsx
import type { Context } from '@deepseek-ai/cordis'
import { UserCard } from './UserCard'

export const inject = ['reactUI', 'userIdentity']

export function apply(ctx: Context) {
  const identity = ctx.userIdentity
  function UserCardEntry() {
    return <UserCard identity={identity} />
  }
  ctx.effect(() => ctx.reactUI.register('user-card', UserCardEntry))
}

export default { inject, apply }
```

`UserCard` 使用 `useSyncExternalStore(identity.subscribe, identity.getSnapshot)` 观察数据；同文件私有 `UserCardView` 接收数据和回调，仅在 `status === 'ready'` 且用户 ID 有效时渲染 **Love you** 按钮。头像加载失败不改变身份判定。按钮动作属于 UI 或独立业务能力，不应为了这个按钮污染纯 fetching 插件。

React Shell 持有唯一 `createRoot()`；普通插件既不调用 `getElementById()`，也不创建自己的 Root。只有 `main.tsx` 接触网页挂载节点。UI 注册返回注销函数，并由 Cordis `ctx.effect()` 回收；卸载卡片插件时只移除该组件，不重启整个 React 应用。

## 动态加载是两层机制

1. **代码交付**：Vite 的 `import()` / `import.meta.glob()` 按需下载构建时已纳入产物的插件。`import.meta.glob()` **不是**运行时安装未知插件。
2. **Cordis 生命周期**：将已加载模块交给 `ctx.plugin()`，保留 Fiber 以便 `fiber.dispose()`；`inject` 负责依赖可用性与随依赖变化的重新激活。**模块已下载 ≠ 插件已激活 ≠ 用户资料已就绪。**

MindPPT 的 [M9 LaTeX 插件](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/plugins/latex/src/index.ts) 已验证运行时启用/卸载：渲染能力注册在实际消费者 `mindpptCanvas` 上，插件 Fiber 卸载便撤销能力，并以通用回退继续呈现。其 [Playground Runtime](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/apps/playground/src/runtime.ts) 通过 `ctx.plugin()` 与 `fiber.dispose()` 管理这一过程；M9 **没有**实现运行时从远端安装新代码。

针对本例：`user-card` 依赖 `userIdentity` 和 `reactUI`；依赖尚不可用时应等待，而不是渲染伪用户。Identity 插件移除后，卡片注册应随依赖生命周期撤销；服务恢复后再激活。React Root 始终不变。

## 为 AI 预留的是可查询能力，不是第二套状态系统

未来的 AI 通过受限 Inspector 消费 Cordis 的**当前能力**。至少区分：

- **模块目录**：插件代码是否可获取/安装；
- **Cordis 状态**：服务或 Fiber 是否在运行；
- **领域状态**：例如 Identity 是 `loading`、`unknown` 还是 `ready`。

能力目录可逐级公开服务名称、说明、只读查询及明确授权的动作；不直接将完整 `ctx`、原始服务对象或任意插件执行权限暴露给 AI。JSDoc/AST 可以描述静态方法契约，但实际可用性必须以运行时为准。没有真实 AI 调用场景之前，不应建设通用 Inspector 平台。

## 边界与演进判断

- **现在需要**：独立 Cordis 服务、React UI 服务、单一 Root、可观察数据、插件启停和注销闭环。
- **有实际多区域扩展需求时**：再让 `reactUI.register(id, Component)` 演进为具名 Slot；不先复制 DSH 的完整 Slot 类型系统。
- **需要远端安装未知代码时**：再设计插件清单、版本/依赖、可信来源、代码隔离与权限；Cordis 注入机制本身**不是安全沙箱**。动态产物还必须共享兼容的 React / React DOM / Cordis 实例。
- **不引入**：DSH Host/Client Remote、Session、插件市场或双端构建，仅为模仿其目录形式而加入的抽象。

## 参考实现与契约

- [MindPPT README](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/README.md) · [架构约束及 M9](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/docs/roadmap.md) · [Playground 入口](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/apps/playground/src/main.tsx)
- [Cordis 服务与注入](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/03-services.zh.md) · [Cordis 注册表 API](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-api/registry.zh.md)
- [DSH Web Client Slots](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/slots.md)（可参考职责分离，不要求直接复用）
- [React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- 本仓库的 [React Component Coding](../.agents/skills/react-component-coding/SKILL.md) 与 [Review](../.agents/skills/react-component-review/SKILL.md) 约定组件内部风格；本指南讨论的是跨插件边界和入口，不替代二者。
