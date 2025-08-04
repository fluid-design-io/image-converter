import { defineExtension, useCommand } from "reactive-vscode";
import { ProgressLocation, Uri, window } from "vscode";
import { config } from "./config";
import { commands } from "./generated/meta";
import {
	type CompressionOptions,
	compressImage,
	isImageFile,
} from "./image-processor";
import { formatSize, logger } from "./utils";

const { activate, deactivate } = defineExtension(() => {
	const getSelectedImageFiles = (args: any[]): Uri[] => {
		// Command is now only available from context menu, so args are guaranteed.
		const uris =
			args.length > 1 && Array.isArray(args[1]) ? args[1] : [args[0]];
		const selectedFiles = uris.filter(
			(arg): arg is Uri => arg instanceof Uri,
		);

		const imageFiles = selectedFiles.filter((file) => isImageFile(file.fsPath));

		if (imageFiles.length === 0) {
			window.showWarningMessage("No supported image files found in selection.");
			return [];
		}
		return imageFiles;
	};

	const compressFiles = async (
		imageFiles: Uri[],
		options: CompressionOptions,
		title: string,
	) => {
		// (The rest of this function remains unchanged)
		await window.withProgress(
			{
				location: ProgressLocation.Notification,
				title,
				cancellable: true,
			},
			async (progress, token) => {
				let totalSavedBytes = 0;
				const total = imageFiles.length;

				const compressionPromises = imageFiles.map(
					async (file) => {
						if (token.isCancellationRequested) return;

						const fileName = file.fsPath.split("/").pop() || file.fsPath;
						progress.report({ message: `Compressing ${fileName}...` });

						try {
							const result = await compressImage(file.fsPath, options);
							if (result.savedBytes > 0) {
								totalSavedBytes += result.savedBytes;
							}
						} catch (error) {
							logger.error(`Failed to compress ${fileName}:`, error);
							window.showErrorMessage(
								`Failed to compress ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
							);
						} finally {
							progress.report({ increment: 100 / total });
						}
					},
				);

				await Promise.all(compressionPromises);

				if (token.isCancellationRequested) {
					window.showInformationMessage("Compression cancelled.");
					return;
				}

				if (totalSavedBytes > 0) {
					window.showInformationMessage(
						`Successfully compressed ${total} image(s). Total space saved: ${formatSize(totalSavedBytes)}.`,
					);
				} else {
					window.showInformationMessage(
						"No significant compression achieved for the selected images.",
					);
				}
			},
		);
	};

	useCommand(commands.compress, async (...args) => {
		const imageFiles = getSelectedImageFiles(args);
		if (imageFiles.length === 0) return;

		const options: CompressionOptions = {
			quality: config.quality,
			format: config.format,
		};
		await compressFiles(imageFiles, options, "Compressing Images");
	});

	useCommand(commands.compressInteractive, async (...args) => {
		const imageFiles = getSelectedImageFiles(args);
		if (imageFiles.length === 0) return;

		const maxWidth = await window.showInputBox({
			prompt: "Enter maximum width (optional)",
			placeHolder: "e.g., 1920",
			validateInput: (v) => (v && !/^\d+$/.test(v) ? "Must be a number" : null),
		});
		if (maxWidth === undefined) return;

		const quality = await window.showInputBox({
			prompt: "Enter quality (1-100)",
			value: String(config.quality),
			validateInput: (v) =>
				!/^\d+$/.test(v) || +v < 1 || +v > 100
					? "Must be a number between 1-100"
					: null,
		});
		if (!quality) return;

		const format = await window.showQuickPick(
			[
				{ label: "Same as Source", value: "same-as-source" },
				{ label: "JPG", value: "jpg" },
				{ label: "PNG", value: "png" },
				{ label: "WebP", value: "webp" },
				{ label: "AVIF", value: "avif" },
			],
			{ placeHolder: "Select output format" },
		);
		if (!format) return;

		const options: CompressionOptions = {
			quality: parseInt(quality),
			format: format.value as CompressionOptions["format"],
			maxWidth: maxWidth ? parseInt(maxWidth) : undefined,
		};

		await compressFiles(
			imageFiles,
			options,
			`Compressing to ${format.label}`,
		);
	});

	logger.info("Tiny Image extension activated");
});

export { activate, deactivate };