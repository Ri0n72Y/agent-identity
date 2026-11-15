---
name: function-first-coding
description: 开发或审查 JavaScript/TypeScript 普通业务模块、HTTP API 与数据转换时使用；关注具名函数、静态 API 对象、状态所有权及隐式实例依赖。React 组件职责另由 react-component-coding / react-component-review 处理。
---

# Function-first coding

在**新建或正在重构的普通业务代码**中，默认用具名函数和静态普通对象明确对外 API，减少无必要的实例生命周期与隐藏状态。检查实际输入、调用方和已有契约；不要仅为了统一语法改写稳定代码或框架对象。

## 函数与模块

- 超过一行的业务操作先写具名 `function` / `async function`，最后用属性简写集中导出 `export const api = { members, addMember }`；一行辅助逻辑和局部回调可内联。
- 默认使用模块级 `const` API 对象，函数通过参数表达输入和必要依赖。不要为函数目录建立 HTTP Service Class、`new` 实例或无意义的 Manager/Repository 转发层；不动态覆盖或重新赋值已导出的 API 方法。
- 依赖 TypeScript 推断，只为实际公共契约或难以推断的边界加类型；不惯例性添加 `Readonly`、`DeepReadonly`、`as const` 或 `Object.freeze`。`const` 保证绑定稳定，不保证内部数据不可变。
- 确有多配置或隔离测试需求时，可传入普通函数依赖，或用函数工厂返回普通对象；避免为单一模块凭空引入工厂。已有有价值的状态封装、框架要求的 Class 不因本 Skill 机械重写。

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

示例只表达代码组织方式；实际端点、输入验证、凭证与错误契约以所在项目为准。

## 对象、状态与副作用

- 局部新建的数组/对象允许直接赋值、`push`、循环和计算。不要意外修改调用方仍持有的输入；如需更新共享数据，明确状态所有者和写入路径，必要时先复制再修改。
- 服务端数据按业务语义更新：可按请求重新获取，也可由明确的拥有者维护分页、合并或缓存；避免可被多个调用方随意改变的模块级状态。
- 请求、存储和订阅留在可辨识的函数或真实生命周期边界。浏览器宿主 API 应保留正确调用接收者：直接 `fetch(input, init)` / `globalThis.fetch(input, init)`；不要把未绑定的宿主方法当作实例方法调用。测试依赖可注入普通函数。
- 保留既有请求取消、错误处理和项目认证/授权契约；不以改动代码风格为由改变业务行为。React props/State 的更新与组件职责使用 [React component coding](../react-component-coding/SKILL.md)；Cordis 等框架生命周期参见 [Function-first Cordis guide](../../../library/function-first-cordis-plugin-programming.md)。

## 编码与审查的完成条件

沿调用路径检查 API 公开入口、数据所有权和副作用：是否有实际需要的 Class/工厂，是否存在未解释的共享修改、宿主 API 接收者错误或重构引起的契约变化。只有能指出具体影响或违反已明确项目约定时才要求修正；局部可变、必要类型及框架 Class 本身不构成问题。

验证与改动风险匹配的实际行为；Mock 结果不等于真实浏览器/网络验收。需要专门的测试方法时参考 [Dependency risk testing](../dependency-risk-testing/SKILL.md)。React 组件的独立审查仍使用 [React component review](../react-component-review/SKILL.md)。未验证部分明确标注。
