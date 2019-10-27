declare module "franc-min" {
  interface Options {
    minLength?: number;
    only?: string[];
    ignore?: string[];
  }

  export function franc(text: string, options?: Options): string;

  export namespace franc {
    function all(text: string, options?: Options): [string, number][];
  }

  export default franc;
}
