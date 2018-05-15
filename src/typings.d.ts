/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var System: System;
interface System {
  import(request: string): Promise<any>;
}

declare module "*.json" {
    const value: any;
    export default value;
}
