import * as vscode from "vscode";

/**
 * Displays a progress notification if the task takes more than 500 ms.
 * The user sees "Processing image..." and, upon completion, a success message.
 */
export function showDelayedNotification() {
  let notificationShown = false;
  let resolveProgress: (() => void) | null = null;

  // Show progress if it takes more than 500ms
  const timeout = setTimeout(() => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Processing image...",
        cancellable: false,
      },
      () => {
        return new Promise<void>((resolve) => {
          resolveProgress = resolve;
          notificationShown = true;
        });
      }
    );
  }, 500);

  return {
    done: () => {
      clearTimeout(timeout);
      if (notificationShown && resolveProgress) {
        resolveProgress();
      }

      // Show a short success message after the progress bar
      if (notificationShown) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Image processing complete.",
            cancellable: false,
          },
          () => {
            return new Promise<void>((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          }
        );
      }
    },
  };
}
