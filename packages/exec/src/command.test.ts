import { beforeAll, describe, expect, test } from "@jest/globals";
import { Command } from "./command";
import { newHook, testCheckRunResult } from "./helper.test";
import { OutputResult } from "./output";
import { RunResult } from "./run";

describe("constructs a new command", () => {
  let command: Command;
  test("should not throws an error", () => {
    expect(() => {
      command = new Command("node", "--no-addons", "--no-deprecation");
    }).not.toThrow();
  });

  describe("checks the properties", () => {
    test("the command should be equals", () => {
      expect(command.command).toEqual("node");
    });
    test("the arguments should be equal", () => {
      expect(command.args).toEqual(["--no-addons", "--no-deprecation"]);
    });
  });

  const runs = new Map([
    ["", (...args: string[]) => command.run(...args)],
    [" silently", (...args: string[]) => command.runSilently(...args)],
  ]);
  for (const [title, run] of runs) {
    describe(`runs the command${title}`, () => {
      let prom: Promise<RunResult>;
      test("should be resolved", () => {
        prom = run("-e", "console.log('some log')");
        return expect(prom).resolves.toBeTruthy();
      });
      describe("checks the result", () => {
        const res = newHook<RunResult>();
        beforeAll(async () => (res.data = await prom));
        testCheckRunResult({ res, shouldBeOk: true });
      });
    });
  }

  const outputs = new Map([
    ["", (...args: string[]) => command.output(...args)],
    [" silently", (...args: string[]) => command.outputSilently(...args)],
  ]);
  for (const [title, output] of outputs) {
    describe(`runs the command${title} and gets the output`, () => {
      let prom: Promise<OutputResult>;
      test("should be resolved", () => {
        prom = output("-e", "console.log('some log')");
        return expect(prom).resolves.toBeTruthy();
      });
      describe("checks the result", () => {
        const res = newHook<OutputResult>();
        beforeAll(async () => (res.data = await prom));
        testCheckRunResult({ res, shouldBeOk: true });
        test("the output should be correct", () => {
          expect(res.data!.output).toBe("some log\n");
        });
      });
    });
  }
});
