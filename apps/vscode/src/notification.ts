import * as vscode from "vscode";

export function showDelayedNotification() {
  let notificationShown = false;
  let resolveProgress: (() => void) | null = null;

  const timeout = setTimeout(() => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Processing image...",
        cancellable: false,
      },
      (progress, token) => {
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

      if (notificationShown) {
        // Show a temporary success message
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Image processing complete.",
            cancellable: false,
          },
          (progress, token) => {
            return new Promise<void>((resolve) => {
              setTimeout(() => {
                resolve(); // This will close the notification after 2 seconds
              }, 2000); // Auto-dismiss after 2000 milliseconds
            });
          }
        );
      }
    },
  };
}
