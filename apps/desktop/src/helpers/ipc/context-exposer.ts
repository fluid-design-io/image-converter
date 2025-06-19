import { exposeThemeContext } from "./theme/theme-context";
import { exposeImageContext } from "./image/image-context";

export default function exposeContexts() {
  exposeThemeContext();
  exposeImageContext();
}
