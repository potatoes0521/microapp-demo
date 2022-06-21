/*
 * @LastEditors: 
 * @Description: 依赖更新脚本
 * @Date: 2021-10-30 12:02:29
 * @LastEditTime: 2021-11-01 15:20:41
 * @Author: 
 */
import { yellow } from "./utils/log";
import { run, execute } from "./utils/process";
const { prompt } = require("enquirer");

(async () => {
  const { yes } = await prompt({
    type: "confirm",
    name: "yes",
    message: `当前进行的操作是选中并自动更新依赖版本，按回车键继续！`,
  });

  if (!yes) return;

  const { stdout } = await execute(`pnpm list`);
  let sourceArr = stdout.split("\n");

  const { type } = await prompt({
    type: "select",
    name: "type",
    message: "请选择要更新的依赖类型(依赖/开发时依赖)",
    choices: ["Dependencies", "DevDependencies"],
  });

  let start, end;

  if (type === "Dependencies") {
    start = sourceArr.findIndex((v) => v === "dependencies:");
    end = sourceArr.findIndex((v) => v === "devDependencies:");
  }
  if (type === "DevDependencies") {
    start = sourceArr.findIndex((v) => v === "devDependencies:");
    end = sourceArr.length;
  }

  sourceArr = sourceArr.slice(start + 1, end - 1);
  sourceArr = sourceArr.map((v) => {
    let arr = v.split(" ");
    return { name: arr.join("@v"), value: arr[0] };
  });

  let { pkgArr } = await prompt({
    type: "multiselect",
    name: "pkgArr",
    limit: 7,
    choices: sourceArr,
    message:
      "请从当前已安装依赖中选择要更新的包(按空格选中、可多选，回车键确定)",
  });

  let cmd = "pnpm up";

  if (pkgArr.length <= 0) return yellow("你没有更新任何包！");

  pkgArr = pkgArr.map((v) => {
    cmd = cmd + " " + sourceArr.filter((j) => j.name === v)[0].value;
  });

  await run(cmd);
})();
