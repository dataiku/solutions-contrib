import { createTestRoute } from "./testRoutesUtils";
import { testViews } from "../precompiled/localPrecompiledData";

export default testViews.map(component => createTestRoute(component));