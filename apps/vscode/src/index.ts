import { defineExtension, useCommand } from "reactive-vscode";
import { ProgressLocation, Uri, window } from "vscode";
import { config } from "./config";
import { commands } from "./generated/meta";
import { compressImage, getImageInfo, isImageFile } from "./image-processor";
import { formatSize, logger } from "./utils";

const { activate, deactivate } = defineExtension(() => {
	// Register the compress command
	useCommand(commands.compress, async (...args) => {
		try {
			logger.info(
				`Command 'compress' invoked. Arguments: ${JSON.stringify(args)}`,
			);

			let selectedFiles: Uri[] = [];

			// Handle context menu invocation
			if (args && args.length > 0) {
				// The args from a context menu are typically structured as:
				// args[0]: Uri of the item that was right-clicked
				// args[1]: An array of Uris for all selected items (including the one from args[0])
				const selectedUris =
					args.length > 1 && Array.isArray(args[1]) ? args[1] : [args[0]];

				// Filter out any non-Uri arguments and flatten the array
				selectedFiles = selectedUris.filter(
					(arg): arg is Uri => arg instanceof Uri,
				);
			}

			// Handle command palette invocation (or if no files are selected in the explorer)
			if (selectedFiles.length === 0) {
				const editor = window.activeTextEditor;
				if (editor) {
					selectedFiles = [editor.document.uri];
					logger.info(
						`Fallback to active editor. Document URI: ${editor.document.uri.fsPath}`,
					);
				} else {
					logger.info(`No active editor found.`);
				}
			}

			logger.info(
				`Processing files: ${selectedFiles.map((f) => f.fsPath).join(", ")}`,
			);

			if (selectedFiles.length === 0) {
				window.showWarningMessage(
					"Please select image files to compress or open an image file in the editor.",
				);
				return;
			}

			// Now your original logic can resume with the clean `selectedFiles` array.
			// The rest of your code from here should be correct.

			// Filter for image files
			const imageFiles = selectedFiles.filter((file) =>
				isImageFile(file.fsPath),
			);

			if (imageFiles.length === 0) {
				window.showWarningMessage("No image files found in selection");
				return;
			}

			logger.info(`Starting compression for ${imageFiles.length} image(s)`);

			// Show progress notification with better visibility
			await window.withProgress(
				{
					location: ProgressLocation.Notification,
					title: "Compressing Images",
					cancellable: true,
				},
				async (progress, token) => {
					const total = imageFiles.length;
					let completed = 0;
					let totalSavedBytes = 0;

					for (const file of imageFiles) {
						if (token.isCancellationRequested) {
							logger.info("Compression cancelled by user");
							return;
						}

						const fileName = file.fsPath.split("/").pop() || file.fsPath;
						progress.report({
							message: `Compressing ${fileName}...`,
							increment: 0,
						});

						try {
							const originalInfo = await getImageInfo(file.fsPath);
							// Ensure file.fsPath is a string before passing to compressImage
							const savedBytes = await compressImage(file.fsPath, {
								quality: config.quality,
								format: config.format,
							});

							if (savedBytes > 0) {
								totalSavedBytes += savedBytes;
								const compressionPercentage = Math.round(
									(savedBytes / originalInfo.size) * 100,
								);
								logger.info(
									`Compressed ${fileName}: saved ${savedBytes} bytes (${compressionPercentage}%)`,
								);
							}
						} catch (error) {
							logger.error(`Failed to compress ${fileName}:`, error);
							window.showErrorMessage(
								`Failed to compress ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}

						completed++;
						progress.report({
							increment: 100 / total,
							message: `${completed}/${total} completed`,
						});
					}

					// Show completion message
					if (totalSavedBytes > 0) {
						window.showInformationMessage(
							`Successfully compressed ${completed} image(s). Total space saved: ${formatSize(totalSavedBytes)}`,
						);
					} else {
						window.showInformationMessage(
							`Processed ${completed} image(s). No significant compression achieved.`,
						);
					}
				},
			);
		} catch (error) {
			logger.error("Error during compression:", error);
			window.showErrorMessage(
				`Error during compression: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	});

	// Register the interactive compress command
	useCommand(commands.compressInteractive, async (...args) => {
		try {
			logger.info(
				`Command 'compress-interactive' invoked. Arguments: ${JSON.stringify(args)}`,
			);

			let selectedFiles: Uri[] = [];

			// Handle context menu invocation
			if (args && args.length > 0) {
				const selectedUris =
					args.length > 1 && Array.isArray(args[1]) ? args[1] : [args[0]];

				selectedFiles = selectedUris.filter(
					(arg): arg is Uri => arg instanceof Uri,
				);
			}

			// Handle command palette invocation
			if (selectedFiles.length === 0) {
				const editor = window.activeTextEditor;
				if (editor) {
					selectedFiles = [editor.document.uri];
				}
			}

			if (selectedFiles.length === 0) {
				window.showWarningMessage(
					"Please select image files to compress or open an image file in the editor.",
				);
				return;
			}

			// Filter for image files
			const imageFiles = selectedFiles.filter((file) =>
				isImageFile(file.fsPath),
			);

			if (imageFiles.length === 0) {
				window.showWarningMessage("No image files found in selection");
				return;
			}

			// Show input dialog for max width
			const maxWidth = await window.showInputBox({
				prompt: "Enter maximum width (leave empty to keep original size)",
				placeHolder: "e.g., 2000",
				validateInput: (value) => {
					if (value === "") return null; // Allow empty for no resize
					const num = parseInt(value);
					if (isNaN(num) || num <= 0) {
						return "Please enter a valid positive number";
					}
					return null;
				},
			});

			if (maxWidth === undefined) {
				return; // User cancelled
			}

			// Show input dialog for quality
			const qualityInput = await window.showInputBox({
				prompt: "Enter compression quality (1-100)",
				placeHolder: "e.g., 85",
				value: config.quality.toString(),
				validateInput: (value) => {
					const num = parseInt(value);
					if (isNaN(num) || num < 1 || num > 100) {
						return "Please enter a number between 1 and 100";
					}
					return null;
				},
			});

			if (qualityInput === undefined) {
				return; // User cancelled
			}

			// Show format selection
			const formatOptions = [
				{ label: "Same as Source", value: "same-as-source" },
				{ label: "JPG", value: "jpg" },
				{ label: "PNG", value: "png" },
				{ label: "WebP", value: "webp" },
				{ label: "AVIF", value: "avif" },
			];

			const selectedFormat = await window.showQuickPick(formatOptions, {
				placeHolder: "Select output format",
				canPickMany: false,
			});

			if (!selectedFormat) {
				return; // User cancelled
			}

			const quality = parseInt(qualityInput);
			const maxWidthNum = maxWidth === "" ? undefined : parseInt(maxWidth);

			logger.info(
				`Starting interactive compression for ${imageFiles.length} image(s) with quality: ${quality}, maxWidth: ${maxWidthNum || "original"}, format: ${selectedFormat.value}`,
			);

			// Show progress notification
			await window.withProgress(
				{
					location: ProgressLocation.Notification,
					title: `Compressing Images (${selectedFormat.label})`,
					cancellable: true,
				},
				async (progress, token) => {
					const total = imageFiles.length;
					let completed = 0;
					let totalSavedBytes = 0;

					for (const file of imageFiles) {
						if (token.isCancellationRequested) {
							logger.info("Compression cancelled by user");
							return;
						}

						const fileName = file.fsPath.split("/").pop() || file.fsPath;
						progress.report({
							message: `Compressing ${fileName}...`,
							increment: 0,
						});

						try {
							const originalInfo = await getImageInfo(file.fsPath);
							const savedBytes = await compressImage(file.fsPath, {
								quality: quality,
								format: selectedFormat.value as
									| "same-as-source"
									| "jpg"
									| "png"
									| "webp"
									| "avif",
								maxWidth: maxWidthNum,
							});

							if (savedBytes > 0) {
								totalSavedBytes += savedBytes;
								const compressionPercentage = Math.round(
									(savedBytes / originalInfo.size) * 100,
								);
								logger.info(
									`Compressed ${fileName}: saved ${savedBytes} bytes (${compressionPercentage}%)`,
								);
							}
						} catch (error) {
							logger.error(`Failed to compress ${fileName}:`, error);
							window.showErrorMessage(
								`Failed to compress ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}

						completed++;
						progress.report({
							increment: 100 / total,
							message: `${completed}/${total} completed`,
						});
					}

					// Show completion message
					if (totalSavedBytes > 0) {
						window.showInformationMessage(
							`Successfully compressed ${completed} image(s). Total space saved: ${formatSize(totalSavedBytes)} (${Math.round((totalSavedBytes / total) * 100)}%)`,
						);
					} else {
						window.showInformationMessage(
							`Processed ${completed} image(s). No significant compression achieved.`,
						);
					}
				},
			);
		} catch (error) {
			logger.error("Error during interactive compression:", error);
			window.showErrorMessage(
				`Error during compression: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	});

	logger.info("Tiny Image extension activated");
});

export { activate, deactivate };
