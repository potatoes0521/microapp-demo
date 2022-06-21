/*
 * @LastEditors: 
 * @Description: 命令执行方法
 * @Date: 2021-10-20 17:05:10
 * @LastEditTime: 2021-10-30 12:06:18
 * @Author: 
 */
import { spawn, exec } from "child_process";
import util from "util";
import { green } from "./log";
import { resolve } from "path";

const projRoot = resolve(__dirname, "..", "..");

const execPromise = util.promisify(exec);

export const execute = async (command) => {
  const { error, stdout, stderr } = await execPromise(command);
  if (error) {
    return Promise.reject(error);
  }
  return { stdout, stderr };
};

export const run = async (command, cwd = projRoot) =>
  new Promise((resolve, reject) => {
    const args = command.split(" ");
    const cmd = args.shift();

    green(`run: ${cmd} ${args.join(" ")}`);
    const app = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    const onProcessExit = () => app.kill("SIGHUP");

    app.on("close", (code) => {
      process.removeListener("exit", onProcessExit);

      if (code === 0) resolve();
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        );
    });
    process.on("exit", onProcessExit);
  });
