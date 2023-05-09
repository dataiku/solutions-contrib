import path from "node:path";
import open from "open";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

open(path.resolve(__dirname, "../umd-test/umd-test.html"));
