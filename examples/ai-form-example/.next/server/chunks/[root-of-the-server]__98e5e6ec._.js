module.exports = [
"[project]/examples/ai-form-example/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/examples/ai-form-example/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$openai$40$2$2e$0$2e$64_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+openai@2.0.64_zod@4.1.12/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$2d$ai$2d$sdk$40$1$2e$1$2e$9_$40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$r_33hphprhob62dzty3jpsbnolpm$2f$node_modules$2f40$assistant$2d$ui$2f$react$2d$ai$2d$sdk$2f$dist$2f$frontendTools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react-ai-sdk@1.1.9_@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+r_33hphprhob62dzty3jpsbnolpm/node_modules/@assistant-ui/react-ai-sdk/dist/frontendTools.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$89_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.89_zod@4.1.12/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
const maxDuration = 30;
async function POST(req) {
    const { messages, system, tools } = await req.json();
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$89_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
        model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$openai$40$2$2e$0$2e$64_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openai"])("gpt-4o"),
        messages: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$89_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToModelMessages"])(messages),
        system,
        tools: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$2d$ai$2d$sdk$40$1$2e$1$2e$9_$40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$r_33hphprhob62dzty3jpsbnolpm$2f$node_modules$2f40$assistant$2d$ui$2f$react$2d$ai$2d$sdk$2f$dist$2f$frontendTools$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["frontendTools"])(tools)
        }
    });
    return result.toUIMessageStreamResponse();
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__98e5e6ec._.js.map