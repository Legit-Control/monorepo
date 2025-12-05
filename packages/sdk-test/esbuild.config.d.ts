export function build(): Promise<void>;
export namespace buildConfig {
    let entryPoints: string[];
    let bundle: boolean;
    let platform: string;
    let target: string;
    let format: string;
    let outExtension: {
        '.js': string;
    };
    let external: string[];
    let sourcemap: boolean;
    let minify: boolean;
    let keepNames: boolean;
    namespace banner {
        let js: string;
    }
}
//# sourceMappingURL=esbuild.config.d.ts.map