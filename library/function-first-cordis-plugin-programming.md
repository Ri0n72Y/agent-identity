# Function-first Style Cordis Plugin Programming

> **定位**：Cordis 插件开发的按需技术参考，不是运行时 Skill，也不是「禁止 class」的约束。优先控制隐式状态和不可追踪的副作用，同时保持 Cordis 原生的服务注入、生命周期与可组合性。以 [@deepseek-ai/cordis](https://github.com/deepseek-ai/deepseek-harness/tree/master/vendor/cordis) 和 [MindPPT](https://github.com/Ri0n72Y/dsh-mindppt) 的现有实现为依据；函数式内部组织原则是本文建议，不宣称为 Cordis 官方强制规范。

## 1. 目标：减少隐式性，而不是消灭对象

**Function-first = 显式数据 + 可组合函数 + 最小状态所有者 + 生命周期内的副作用。**

- 把可确定的解析、校验、派生数据和状态转换写成纯函数，尽量以 `input → output` 表达。
- 当状态确实要持续存在时，将其限定在一个清晰的所有者中，提供只读快照与受控的变更入口；避免多处私有字段相互驱动。
- 把 fetch、定时器、订阅、注册、文件写入等副作用置于插件的生命周期边界，依托 Cordis 现有 `ctx.effect()` 和内置注册的清理语义。
- 用 `inject` 声明必需能力，通过服务接口组合功能；避免靠继承树和可覆盖的父类方法传递业务行为。
- **不按语法判断纯度**：闭包里的 `let` 可以与类的 `private` 一样隐蔽；`class` 也完全可以只是一个薄薄的 Cordis 服务适配器。

不追求零状态、零副作用或无条件事件溯源：真实的 I/O 和运行时状态不可避免，问题在于**谁能修改它、何时修改、如何解释和撤销**。

## 2. Cordis 的真实约定

Cordis 原生接受 **函数、`{ apply }` 对象和 Class 插件**。官方 [第一个插件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/01-first-plugin.zh.md) 教程鼓励先使用函数；需要暴露具名服务时，官方 [Service 教程](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/03-services.zh.md) 以 `class Foo extends Service` 为惯用例子。

同时，源码中 `Service` 构造函数会调用 `ctx.reflect.provide(name, this, ...)`，而 `ctx.provide(name, value)` 自身也会把注册挂到当前 Fiber 的 effect 上。因此，**对外提供服务不强制继承 `Service`**；两种形式均受 Cordis 生命周期管理。

| 具体需求 | 优先方案 | 选择原因 |
| --- | --- | --- |
| 注册事件处理器、工具、扩展渲染器等 | 函数插件 `apply(ctx)` | 无须额外实例与状态 |
| 提供少量函数/可观察状态的具名服务 | 函数插件 + `ctx.provide` | 显式服务契约，减少对象机制 |
| 已有代码/框架使用 `Service`，或需要其类特性、惯用 API | `class … extends Service` | 保持 Cordis 兼容，不为了风格改写 |
| 类中出现大量私有可变字段与交叉调用 | 保留必要服务外壳，抽取纯计算或显式状态转换 | 减少隐式依赖，而不是盲目将 Class 转成闭包 |

*`ctx.provide()` 本身已是生命周期 effect，**不要仅为追踪它的注销又包装一层 `ctx.effect(() => ctx.provide(...))`**。*

## 3. 服务设计：功能契约与状态契约分开看

一个可被其他插件消费的服务，可以表现为公开函数接口与可观察的数据快照。业务真相属于数据插件，不属于 React 或其他消费者。

```ts
export type IdentityState =
  | { status: 'loading' | 'unknown' | 'error' }
  | { status: 'ready'; user: Readonly<{ id: string; name: string; avatarUrl?: string }> }

export interface UserIdentity {
  getSnapshot(): IdentityState
  subscribe(listener: () => void): () => void
}
```

- `getSnapshot()` 在状态未变时返回**同一个引用**；更新时发布**新快照**。
- `subscribe()` 返回取消订阅函数。公开快照应避免被消费方就地修改。
- `ready` 的语义由提供方确定；成功读取公开的 `user.json` 并不等于验证了用户登录身份。
- 服务可用（Cordis Fiber 已激活）与业务数据就绪（`status === 'ready'`）是两个不同维度。

### 函数插件示例：纯解析 + 一个状态单元 + 可撤销 fetch

```ts
import type { Context } from '@deepseek-ai/cordis'

type User = Readonly<{ id: string; name: string; avatarUrl?: string }>
type State =
  | { status: 'loading' | 'unknown' | 'error' }
  | { status: 'ready'; user: User }

interface IdentityService {
  getSnapshot(): State
  subscribe(listener: () => void): () => void
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    userIdentity: IdentityService
  }
}

// 纯函数：输入不合法则没有用户；不读写外部状态。
function parseUser(input: unknown): User | undefined {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return
  const data = input as Record<string, unknown>
  if (typeof data.id !== 'string' || !data.id.trim()) return
  if (typeof data.name !== 'string' || !data.name.trim()) return
  return {
    id: data.id,
    name: data.name,
    ...(typeof data.avatarUrl === 'string' ? { avatarUrl: data.avatarUrl } : {}),
  }
}

export function apply(ctx: Context): void {
  let snapshot: State = { status: 'loading' }
  const listeners = new Set<() => void>()
  const publish = (next: State) => {
    snapshot = next                         // 唯一的写入位置
    for (const listener of listeners) listener()
  }

  ctx.provide('userIdentity', {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  })

  ctx.effect(() => {
    const controller = new AbortController()
    void (async () => {
      try {
        const response = await fetch('/user.json', { signal: controller.signal })
        if (!response.ok) throw new Error('User fetch failed')
        const user = parseUser(await response.json())
        if (!controller.signal.aborted) {
          publish(user ? { status: 'ready', user } : { status: 'unknown' })
        }
      } catch {
        if (!controller.signal.aborted) publish({ status: 'error' })
      }
    })()
    return () => {
      controller.abort()                   // 卸载后禁止旧请求回写
      listeners.clear()                    // 释放订阅引用
    }
  }, 'user-identity: fetch')
}
```

这个示例仍有可变的 `snapshot` 和 `listeners`；它们是**服务运行所需、且只由插件实例拥有**的状态，而不是需要彻底消除的缺陷。纯度落在 `parseUser`，副作用落在 `ctx.effect`，状态写入收敛在 `publish`。当状态转换显著复杂时，再引入纯 `transition(state, event)`，不要为两三个简单状态强行搭建 Reducer/Event Sourcing 框架。

## 4. Class 仍然可以是最合适的 Cordis 接口

若项目已有 `Service` 约定，保留类与继承完全合理。可把类作为**薄服务外壳**，将计算、状态更新和依赖处理下沉到显式函数与小型模型：

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

export default class UserIdentityService extends Service {
  // createIdentityModel() 返回受控的快照/订阅接口及明确的写入操作。
  private readonly model = createIdentityModel()

  constructor(ctx: Context) {
    super(ctx, 'userIdentity')
    ctx.effect(() => startIdentityFetch(this.model), 'identity: fetch')
  }

  getSnapshot = () => this.model.getSnapshot()
  subscribe = (listener: () => void) => this.model.subscribe(listener)
}
```

这里的 `createIdentityModel` 与 `startIdentityFetch` 是说明职责边界的**示意函数，并非 Cordis API**。Class 必要时承担 Cordis 注册和兼容性，但并不必须自己拥有一连串可变字段。若独立模型只会给这个 Class 使用、拆出它反而增加跳转层次，可以直接保留类内一份小而明确的状态。

MindPPT 的 [Camera Service](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/plugins/camera/src/index.ts) 是真实的 `Service` 子类；其 `createCameraView` 已经抽离为独立的视图派生函数。另一方面，[LaTeX 插件](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/plugins/latex/src/index.ts) 仅通过函数插件、`inject` 与 `ctx.effect()` 注册可撤销能力。**两种形式共存**，才更贴近 Cordis/MindPPT 的实际实践。

## 5. 副作用与生命周期的边界

- `ctx.on(event, listener)`、`ctx.provide(...)`、`ctx.plugin(child)` 等 Cordis 原生注册已有自己的卸载语义；不要重复登记 cleanup。对于普通定时器、Fetch/AbortController、WebSocket 或非 Cordis 订阅，才显式提供 `ctx.effect()` disposer。
- 插件必须通过 `inject` 声明硬依赖；需要可选服务时用 `ctx.get(name)` 并判断是否存在。不要把外部插件实现捕获到模块级单例或跨生命周期的缓存中。
- 异步任务需要取消或**代际保护**：即使旧操作完成，也不能覆盖新实例/新请求的状态。取消订阅与停止请求是两种不同的清理责任。
- Fiber 的 `PENDING/ACTIVE` 是服务依赖状态，不是领域状态。重启插件意味着可能更换服务实例；调用方不要依赖旧实例的私有可变对象。
- 必须存在的顺序依赖应放入同一个异步 disposer 按序 `await`；不要默认多个独立异步 disposer 严格串行执行。

**可回溯性不是自动获得的。** 不可变快照使当前状态清晰；需要解释「为什么变成这样」时，可让变更入口接受具名事件，按实际需求记录 `event + version + source`。仅在确实需要重放时再持久化有序事件及版本化转换逻辑。插件日志、Cordis 的生命周期记录和业务事件日志并非同一种证据。

## 6. 评审时看数据流，不数 `class`

优先追问：一个结果能否由明确输入复现？一处状态能否找到唯一写入路径？哪些外部调用会修改它？所有长生命周期操作是否随 Fiber 撤销？依赖被替换后是否存在旧异步结果回写？服务对外暴露的是稳定契约，还是可以被任意修改的内部结构？

反面信号包括：多个 `private` 字段互相触发不透明的更新、带副作用的 getter、业务计算依赖随时可能改变的 `this.ctx`、模块级可变单例、跨插件运行时 import 实现，以及仅为隐藏状态而把 Class 换成多层闭包工厂。

**不要求**：所有函数纯化、所有服务改成工厂、每个状态机配 Reducer、强制事件溯源、框架内部对象一律禁止继承、为单个插件建立泛化模型层。把可检验性与理解成本作为判断依据。

## 来源与适用边界

- [Cordis：插件的三种形态](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/01-first-plugin.zh.md)、[Service 与 `inject`](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/03-services.zh.md)、[effect / Fiber 生命周期](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/02-lifecycle-and-effects.zh.md)
- [`Service` 的真实注册实现](https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/cordis/src/service.ts)、[`ctx.provide` 的 effect 实现](https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/cordis/src/reflect.ts)
- [MindPPT：独立运行时与插件拆分](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/README.md)、[Camera Service](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/plugins/camera/src/index.ts)、[LaTeX 插件](https://github.com/Ri0n72Y/dsh-mindppt/blob/main/plugins/latex/src/index.ts)
- 本文的示例是设计说明，**尚未作为独立项目执行 CI**。公开服务类型、运行时代码和构建依赖应以实际 Cordis 版本核验；本指南不修改已有 [React + Cordis Web 指南](./react-cordis.md)。
