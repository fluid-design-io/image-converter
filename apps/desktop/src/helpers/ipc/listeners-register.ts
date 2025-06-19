import { addThemeEventListeners } from "./theme/theme-listeners";
import { addImageEventListeners } from "./image/image-listeners";

export default function registerListeners() {
  addThemeEventListeners();
  addImageEventListeners();
}
