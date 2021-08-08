import Koa from "koa";
import type { DefaultContext } from "koa";

export const app = new Koa();

app.use(async (ctx: DefaultContext) => {
  ctx.body = "Hello World";
});

app.listen(3001);