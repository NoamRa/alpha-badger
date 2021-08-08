import Koa from "koa";
import serve from "koa-static";
import path from "path";

const CLIENT_PATH = path.join(__dirname, "..", "client");

export const app = new Koa();

app.use(async function logger(ctx, next) {
  await next();
  console.log(`${ctx.method} ${ctx.url}`);
});

app.use(serve(CLIENT_PATH));

app.listen(3000);
