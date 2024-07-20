import * as vscode from "vscode";
import { Timer } from "./timer";

export function activate(context: vscode.ExtensionContext) {
  const workDuration = 25 * 60; // 25分
  const shortBreakDuration = 5 * 60; // 5分
  const longBreakDuration = 15 * 60; // 15分
  const cyclesBeforeLongBreak = 4;

  const command = "pomo-mate.toggleTimer" as const;

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );

  const timer = new Timer(
    {
      workDuration,
      cyclesBeforeLongBreak,
      longBreakDuration,
      shortBreakDuration,
    },
    (state) => {
      vscode.window.showInformationMessage(
        // FIXME:
        `Pomodoro: ${state} 開始`,
      );
    },
    (text) => {
      statusBarItem.text = text;
      statusBarItem.show();
    },
  );

  statusBarItem.command = command;
  context.subscriptions.push(statusBarItem);

  const disposable = vscode.commands.registerCommand(
    command,
    () => {
      if (timer.getTimerState() === "Idle") {
        timer.start();
      } else {
        timer.stop();
      }
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
