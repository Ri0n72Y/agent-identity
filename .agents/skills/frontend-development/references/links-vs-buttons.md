# 导航链接与操作按钮（Links vs. Buttons）

> **适用场景**：网页、React/SPA 组件中看起来都像“按钮”的交互控件。核心原则来自 HTML 原生语义、W3C WAI-ARIA 与主流路由/组件库实践，而不是要求统一视觉外观。

## 原则：先确定意图，再选择元素

**导航到可寻址的页面、资源或文档片段 → 使用真实 `<a href>`，或最终渲染为它的路由 `<Link>`。执行命令、修改当前状态、提交数据、展开 UI → 使用 `<button>`。** 按钮样式和元素语义是两个独立维度。

| 场景 | 元素 | 原因 |
| --- | --- | --- |
| 用户详情、其他页面、锚点、面包屑、分页链接 | `<a href>` / 路由 `<Link>` | 有可复制、收藏、直接加载的目的地 |
| 外观像主要 CTA 的“查看详情” | 带按钮样式的 `<a href>` | 视觉突出不改变导航语义 |
| “Love you”反馈、点赞、打开弹窗、折叠菜单 | `<button type="button">` | 当前界面的操作，不是链接 |
| 表单提交 | `<button type="submit">` | 明确使用原生表单动作 |
| 输入筛选条件后更新 URL 查询参数 | 视实际行为选表单/控件 | **URL 变化本身并不足以证明应使用链接** |

一个实用判断：**用户右键“在新标签页打开”后，是否能进入一个有意义的目标页面？** 这比“点了之后 URL 是否变化”更准确。切换局部 UI 状态，即使把状态同步进查询参数，也不自动成为链接。

## 原生行为不是开发者额外补的功能

有 `href` 的链接提供浏览器原生的右键菜单、复制地址、中键/修饰键打开新标签页、键盘 Enter 激活及链接语义。按钮通常支持 Enter 和 Space，并具有不同的辅助技术语义。给 `div` 添加 `role="link"` 只改变语义声明，**不会**让浏览器自动实现真实链接的上下文菜单及导航行为。

```tsx
// 导航：应当允许用户决定是否在新标签页打开
<a href="/users/123" className="button">查看用户</a>

// 操作：不应伪装成导航
<button type="button" onClick={onLove}>Love you</button>

// SPA：优先使用路由库内置 Link，而不是按钮 + navigate()
import { Link } from 'react-router'
<Link to="/users/123" className="button">查看用户</Link>
```

React Router 的 Link 是增强后的 `<a href>`；Next.js 的 `<Link>` 也是在锚点上增加客户端导航与预取。普通左键走客户端路由，同时保留有意义的原生链接能力。**不要为了实现普通导航自行写 `onClick={() => navigate(...)}` 取代链接**，也不要无条件 `preventDefault()` 破坏修饰键点击。程序式导航仍适用于完成某个操作之后的跳转等非单纯链接场景。

## 容易造成回归的实现

```tsx
// 错：把动作包装成伪链接
<a href="#" onClick={deleteItem}>删除</a>

// 错：把普通页面导航变成命令
<button type="button" onClick={() => navigate('/users/123')}>
  查看用户
</button>

// 错：嵌套交互元素
<a href="/users/123"><button type="button">查看用户</button></a>
```

- `href="#"`、`javascript:void(0)`、缺失 `href` 的“伪链接”不能替代 `button`。真正的片段跳转（如 `href="#about"`）则是合法导航。
- 不要嵌套 `<a><button>...`、`<button><a>...` 或链接内再次放链接；让**最终 DOM**只有一个正确的交互元素。
- `<a role="button" href="...">` 可能覆盖原生 link 语义；除非有经过验证的特定交互模式，不要这样修饰导航链接。
- 不为了“支持新标签页”一律设置 `target="_blank"`；链接本来允许用户自行选择。确需默认新标签页时，说明预期行为并注意目标安全属性。
- `<a>` 没有原生 `disabled`。仅设置 `aria-disabled="true"` 不会阻止浏览器跳转；不可用时通常不要提供有效 `href`，应根据场景展示说明、占位或移除该操作。
- 非提交按钮明确写 `type="button"`，避免放进 `form` 后发生意外提交。

## 组件库注意：观察最终 DOM，而不是组件名字

Radix `asChild` 可将样式和行为合成到实际链接。shadcn/ui 的 **Base UI** 版本明确建议：如果希望链接像按钮，请使用 `buttonVariants()` 修饰真实 `<a>`，而不是用可能添加 `role="button"` 的 Button 包装链接。Radix 和 Base UI 的组件装配机制不同；**不能把所有版本的 `Button asChild` 和 `Button render={...}` 当成等价写法**。

```tsx
// 保留链接作为真实 DOM 元素，样式单独复用
<a href="/users/123" className={buttonVariants()}>
  查看用户
</a>
```

针对 `React Router` / `Next.js` 使用各自的 `Link` 时，同样应检查最终输出含真实 `href`、无意外 `role="button"`、没有额外的嵌套按钮。

## URL 与可恢复性

如果在 SPA 中宣称某个控件是导航，它的 URL 应足以在新标签页、刷新或粘贴到地址栏后恢复有意义的页面。目标不要只依赖原标签页的临时内存状态。静态部署还须确保深层路由的首次请求能正常进入应用（服务端 fallback 或采用适当的 hash 路由）。

当前页面所在的导航项可用 `aria-current="page"` 标识；不要和 Tab 控件的 `aria-selected` 混为一谈。

## 最小验收

针对受影响的导航控件，检查：最终 DOM 是带有效 `href` 的链接；普通点击可以导航；中键、Ctrl/Cmd 点击或右键菜单仍可进入新标签页；复制链接后能独立访问；键盘与可访问角色符合交互意图。操作按钮则确认类型、键盘操作和不发生意外页面跳转。无需为没有此类风险的组件建立重型通用测试设施。

## 社区依据与边界

**规范和官方实现：**

- [W3C WAI-ARIA Link Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/) / [Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [MDN：`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) / [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) / [创建链接及新标签页权衡](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links)
- [React Router Link](https://reactrouter.com/api/components/Link) / [Next.js Link](https://nextjs.org/docs/app/api-reference/components/link)
- [React Spectrum LinkButton](https://react-spectrum.adobe.com/LinkButton) / [React Spectrum 客户端路由](https://react-spectrum.adobe.com/v3/routing.html)
- [shadcn/ui Base UI Button：As Link](https://ui.shadcn.com/docs/components/base/button) / [Radix Composition](https://www.radix-ui.com/primitives/docs/guides/composition)
- [eslint-plugin-jsx-a11y：anchor-is-valid](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md)（可优先通过静态检查防止伪链接）

**社区反馈（作为问题实例而非规范）：**

- [r/webdev：button 与 anchor 的用法讨论](https://www.reddit.com/r/webdev/comments/v0kjwo/)
- [r/webdev：伪按钮破坏新标签页交互的抱怨](https://www.reddit.com/r/webdev/comments/1av6a50/)
- [shadcn/ui Base UI：Button 化导致链接角色丢失的 issue](https://github.com/shadcn-ui/ui/issues/11624)

观察和官方意见一致：开发者将浏览器导航退化为 JavaScript 点击事件，通常损失原生交互；但不同 UI 组件库的具体装配实现存在差异。**本参考优先约束 HTML 语义和最终行为，不固定某个框架 API。**
