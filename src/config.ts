import store2 from "./store";
import { BaseConfig } from "./base-config";

const storage = store2.namespace("app");
const config = new BaseConfig({ storage });

export { config, storage };