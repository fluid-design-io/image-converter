import { addImageEventListeners } from "./image/image-listeners";
import { addThemeEventListeners } from "./theme/theme-listeners";

export default function registerListeners() {
  addThemeEventListeners();
  addImageEventListeners();
}
