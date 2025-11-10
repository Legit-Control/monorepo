module.exports = [
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/useActionBarFloatStatus.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HideAndFloatStatus",
    ()=>HideAndFloatStatus,
    "useActionBarFloatStatus",
    ()=>useActionBarFloatStatus
]);
// src/primitives/actionBar/useActionBarFloatStatus.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var HideAndFloatStatus = /* @__PURE__ */ ((HideAndFloatStatus2)=>{
    HideAndFloatStatus2["Hidden"] = "hidden";
    HideAndFloatStatus2["Floating"] = "floating";
    HideAndFloatStatus2["Normal"] = "normal";
    return HideAndFloatStatus2;
})(HideAndFloatStatus || {});
var useActionBarFloatStatus = ({ hideWhenRunning, autohide, autohideFloat })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread, message })=>{
        if (hideWhenRunning && thread.isRunning) return "hidden" /* Hidden */ ;
        const autohideEnabled = autohide === "always" || autohide === "not-last" && !message.isLast;
        if (!autohideEnabled) return "normal" /* Normal */ ;
        if (!message.isHovering) return "hidden" /* Hidden */ ;
        if (autohideFloat === "always" || autohideFloat === "single-branch" && message.branchCount <= 1) return "floating" /* Floating */ ;
        return "normal" /* Normal */ ;
    });
};
;
 //# sourceMappingURL=useActionBarFloatStatus.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveRoot",
    ()=>ActionBarPrimitiveRoot
]);
// src/primitives/actionBar/ActionBarRoot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$useActionBarFloatStatus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/useActionBarFloatStatus.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
var ActionBarPrimitiveRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref)=>{
    const hideAndfloatStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$useActionBarFloatStatus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionBarFloatStatus"])({
        hideWhenRunning,
        autohide,
        autohideFloat
    });
    if (hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$useActionBarFloatStatus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Hidden) return null;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$useActionBarFloatStatus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Floating ? {
            "data-floating": "true"
        } : null,
        ...rest,
        ref
    });
});
ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";
;
 //# sourceMappingURL=ActionBarRoot.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarCopy.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveCopy",
    ()=>ActionBarPrimitiveCopy
]);
// src/primitives/actionBar/ActionBarCopy.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var useActionBarPrimitiveCopy = ({ copiedDuration = 3e3 } = {})=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const hasCopyableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>{
        return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some((c)=>c.type === "text" && c.text.length > 0);
    });
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>composer.isEditing);
    const composerValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>composer.text);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const valueToCopy = isEditing ? composerValue : api.message().getCopyText();
        if (!valueToCopy) return;
        navigator.clipboard.writeText(valueToCopy).then(()=>{
            api.message().setIsCopied(true);
            setTimeout(()=>api.message().setIsCopied(false), copiedDuration);
        });
    }, [
        api,
        isEditing,
        composerValue,
        copiedDuration
    ]);
    if (!hasCopyableContent) return null;
    return callback;
};
var ActionBarPrimitiveCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ copiedDuration, onClick, disabled, ...props }, forwardedRef)=>{
    const isCopied = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.isCopied);
    const callback = useActionBarPrimitiveCopy({
        copiedDuration
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isCopied ? {
            "data-copied": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    });
});
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";
;
 //# sourceMappingURL=ActionBarCopy.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/createActionButton.tsx
__turbopack_context__.s([
    "createActionButton",
    ()=>createActionButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
var createActionButton = (displayName, useActionButton, forwardProps = [])=>{
    const ActionButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardedRef)=>{
        const forwardedProps = {};
        const primitiveProps = {};
        Object.keys(props).forEach((key)=>{
            if (forwardProps.includes(key)) {
                forwardedProps[key] = props[key];
            } else {
                primitiveProps[key] = props[key];
            }
        });
        const callback = useActionButton(forwardedProps) ?? void 0;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
            type: "button",
            ...primitiveProps,
            ref: forwardedRef,
            disabled: primitiveProps.disabled || !callback,
            onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(primitiveProps.onClick, callback)
        });
    });
    ActionButton.displayName = displayName;
    return ActionButton;
};
;
 //# sourceMappingURL=createActionButton.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarReload.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveReload",
    ()=>ActionBarPrimitiveReload
]);
// src/primitives/actionBar/ActionBarReload.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useActionBarReload = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.thread.isRunning || s.thread.isDisabled || s.message.role !== "assistant");
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().reload();
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var ActionBarPrimitiveReload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Reload", useActionBarReload);
;
 //# sourceMappingURL=ActionBarReload.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarEdit.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveEdit",
    ()=>ActionBarPrimitiveEdit
]);
// src/primitives/actionBar/ActionBarEdit.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useActionBarEdit = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>composer.isEditing);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.composer().beginEdit();
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var ActionBarPrimitiveEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Edit", useActionBarEdit);
;
 //# sourceMappingURL=ActionBarEdit.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarSpeak.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveSpeak",
    ()=>ActionBarPrimitiveSpeak
]);
// src/primitives/actionBar/ActionBarSpeak.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useActionBarSpeak = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        api.message().speak();
    }, [
        api
    ]);
    const hasSpeakableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>{
        return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some((c)=>c.type === "text" && c.text.length > 0);
    });
    if (!hasSpeakableContent) return null;
    return callback;
};
var ActionBarPrimitiveSpeak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Speak", useActionBarSpeak);
;
 //# sourceMappingURL=ActionBarSpeak.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarStopSpeaking.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveStopSpeaking",
    ()=>ActionBarPrimitiveStopSpeaking
]);
// src/primitives/actionBar/ActionBarStopSpeaking.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
var useActionBarStopSpeaking = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const isSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.speech != null);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().stopSpeaking();
    }, [
        api
    ]);
    if (!isSpeaking) return null;
    return callback;
};
var ActionBarPrimitiveStopSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const callback = useActionBarStopSpeaking();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEscapeKeydown"])((e)=>{
        if (callback) {
            e.preventDefault();
            callback();
        }
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        disabled: !callback,
        ...props,
        ref,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, ()=>{
            callback?.();
        })
    });
});
ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";
;
 //# sourceMappingURL=ActionBarStopSpeaking.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackPositive.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackPositive",
    ()=>ActionBarPrimitiveFeedbackPositive
]);
// src/primitives/actionBar/ActionBarFeedbackPositive.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
var useActionBarFeedbackPositive = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().submitFeedback({
            type: "positive"
        });
    }, [
        api
    ]);
    return callback;
};
var ActionBarPrimitiveFeedbackPositive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onClick, disabled, ...props }, forwardedRef)=>{
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.message.metadata.submittedFeedback?.type === "positive");
    const callback = useActionBarFeedbackPositive();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    });
});
ActionBarPrimitiveFeedbackPositive.displayName = "ActionBarPrimitive.FeedbackPositive";
;
 //# sourceMappingURL=ActionBarFeedbackPositive.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackNegative.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackNegative",
    ()=>ActionBarPrimitiveFeedbackNegative
]);
// src/primitives/actionBar/ActionBarFeedbackNegative.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var useActionBarFeedbackNegative = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().submitFeedback({
            type: "negative"
        });
    }, [
        api
    ]);
    return callback;
};
var ActionBarPrimitiveFeedbackNegative = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onClick, disabled, ...props }, forwardedRef)=>{
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.message.metadata.submittedFeedback?.type === "negative");
    const callback = useActionBarFeedbackNegative();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    });
});
ActionBarPrimitiveFeedbackNegative.displayName = "ActionBarPrimitive.FeedbackNegative";
;
 //# sourceMappingURL=ActionBarFeedbackNegative.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/primitives/actionBar/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarCopy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarCopy.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarReload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarReload.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarEdit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarEdit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarSpeak$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarSpeak.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarStopSpeaking$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarStopSpeaking.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackPositive$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackPositive.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackNegative$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackNegative.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarCopy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveCopy"],
    "Edit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarEdit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveEdit"],
    "FeedbackNegative",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackNegative$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackNegative"],
    "FeedbackPositive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackPositive$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackPositive"],
    "Reload",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarReload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveReload"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveRoot"],
    "Speak",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarSpeak$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveSpeak"],
    "StopSpeaking",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarStopSpeaking$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveStopSpeaking"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarCopy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarCopy.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarReload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarReload.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarEdit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarEdit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarSpeak$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarSpeak.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarStopSpeaking$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarStopSpeaking.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackPositive$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackPositive.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$ActionBarFeedbackNegative$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackNegative.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/index.js [app-ssr] (ecmascript) <export * as ActionBarPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$actionBar$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/actionBar/index.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNext",
    ()=>BranchPickerPrimitiveNext
]);
// src/primitives/branchPicker/BranchPickerNext.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useBranchPickerNext = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread, message })=>{
        if (message.branchNumber >= message.branchCount) return true;
        if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
            return true;
        }
        return false;
    });
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().switchToBranch({
            position: "next"
        });
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var BranchPickerPrimitiveNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Next", useBranchPickerNext);
;
 //# sourceMappingURL=BranchPickerNext.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerPrevious.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitivePrevious",
    ()=>BranchPickerPrimitivePrevious
]);
// src/primitives/branchPicker/BranchPickerPrevious.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useBranchPickerPrevious = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread, message })=>{
        if (message.branchNumber <= 1) return true;
        if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
            return true;
        }
        return false;
    });
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.message().switchToBranch({
            position: "previous"
        });
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var BranchPickerPrimitivePrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Previous", useBranchPickerPrevious);
;
 //# sourceMappingURL=BranchPickerPrevious.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerCount.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveCount",
    ()=>BranchPickerPrimitiveCount
]);
// src/primitives/branchPicker/BranchPickerCount.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
var useBranchPickerCount = ()=>{
    const branchCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.branchCount);
    return branchCount;
};
var BranchPickerPrimitiveCount = ()=>{
    const branchCount = useBranchPickerCount();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchCount
    });
};
BranchPickerPrimitiveCount.displayName = "BranchPickerPrimitive.Count";
;
 //# sourceMappingURL=BranchPickerCount.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNumber.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNumber",
    ()=>BranchPickerPrimitiveNumber
]);
// src/primitives/branchPicker/BranchPickerNumber.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
var useBranchPickerNumber = ()=>{
    const branchNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.branchNumber);
    return branchNumber;
};
var BranchPickerPrimitiveNumber = ()=>{
    const branchNumber = useBranchPickerNumber();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchNumber
    });
};
BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
;
 //# sourceMappingURL=BranchPickerNumber.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveIf",
    ()=>MessagePrimitiveIf
]);
// src/primitives/message/MessageIf.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var useMessageIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>{
        const { role, attachments, parts, branchCount, isLast, speech, isCopied, isHovering } = message;
        if (props.hasBranches === true && branchCount < 2) return false;
        if (props.user && role !== "user") return false;
        if (props.assistant && role !== "assistant") return false;
        if (props.system && role !== "system") return false;
        if (props.lastOrHover === true && !isHovering && !isLast) return false;
        if (props.last !== void 0 && props.last !== isLast) return false;
        if (props.copied === true && !isCopied) return false;
        if (props.copied === false && isCopied) return false;
        if (props.speaking === true && speech == null) return false;
        if (props.speaking === false && speech != null) return false;
        if (props.hasAttachments === true && (role !== "user" || !attachments?.length)) return false;
        if (props.hasAttachments === false && role === "user" && !!attachments?.length) return false;
        if (props.hasContent === true && parts.length === 0) return false;
        if (props.hasContent === false && parts.length > 0) return false;
        if (props.submittedFeedback !== void 0 && (message.metadata.submittedFeedback?.type ?? null) !== props.submittedFeedback) return false;
        return true;
    });
};
var MessagePrimitiveIf = ({ children, ...query })=>{
    const result = useMessageIf(query);
    return result ? children : null;
};
MessagePrimitiveIf.displayName = "MessagePrimitive.If";
;
 //# sourceMappingURL=MessageIf.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript) <export MessagePrimitiveIf as If>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerRoot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveRoot",
    ()=>BranchPickerPrimitiveRoot
]);
// src/primitives/branchPicker/BranchPickerRoot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript) <export MessagePrimitiveIf as If>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
var BranchPickerPrimitiveRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ hideWhenSingleBranch, ...rest }, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__["If"], {
        hasBranches: hideWhenSingleBranch ? true : void 0,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
            ...rest,
            ref
        })
    });
});
BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";
;
 //# sourceMappingURL=BranchPickerRoot.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/primitives/branchPicker/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerPrevious$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerPrevious.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerCount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerCount.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNumber.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerRoot.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Count",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerCount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveCount"],
    "Next",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNext"],
    "Number",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNumber"],
    "Previous",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerPrevious$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitivePrevious"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerPrevious$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerPrevious.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerCount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerCount.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNumber.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$BranchPickerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerRoot.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/index.js [app-ssr] (ecmascript) <export * as BranchPickerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$branchPicker$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/branchPicker/index.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerSend.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveSend",
    ()=>ComposerPrimitiveSend,
    "useComposerSend",
    ()=>useComposerSend
]);
// src/primitives/composer/ComposerSend.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useComposerSend = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.thread.isRunning || !s.composer.isEditing || s.composer.isEmpty);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.composer().send();
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var ComposerPrimitiveSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Send", useComposerSend);
;
 //# sourceMappingURL=ComposerSend.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerRoot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveRoot",
    ()=>ComposerPrimitiveRoot
]);
// src/primitives/composer/ComposerRoot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerSend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerSend.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
var ComposerPrimitiveRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onSubmit, ...rest }, forwardedRef)=>{
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerSend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposerSend"])();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!send) return;
        send();
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].form, {
        ...rest,
        ref: forwardedRef,
        onSubmit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onSubmit, handleSubmit)
    });
});
ComposerPrimitiveRoot.displayName = "ComposerPrimitive.Root";
;
 //# sourceMappingURL=ComposerRoot.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useOnScrollToBottom.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnScrollToBottom",
    ()=>useOnScrollToBottom
]);
// src/utils/hooks/useOnScrollToBottom.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useOnScrollToBottom = (callback)=>{
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const onScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((vp)=>vp.onScrollToBottom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return onScrollToBottom(callbackRef);
    }, [
        onScrollToBottom,
        callbackRef
    ]);
};
;
 //# sourceMappingURL=useOnScrollToBottom.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInput.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveInput",
    ()=>ComposerPrimitiveInput
]);
// src/primitives/composer/ComposerInput.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-textarea-autosize@8.5.9_@types+react@19.2.2_react@19.2.0/node_modules/react-textarea-autosize/dist/react-textarea-autosize.development.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useOnScrollToBottom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
var ComposerPrimitiveInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ autoFocus = false, asChild, disabled: disabledProp, onChange, onKeyDown, onPaste, submitOnEnter = true, cancelOnEscape = true, unstable_focusOnRunStart = true, unstable_focusOnScrollToBottom = true, unstable_focusOnThreadSwitched = true, addAttachmentOnPaste = true, ...rest }, forwardedRef)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>{
        if (!composer.isEditing) return "";
        return composer.text;
    });
    const Component = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    const isDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread })=>thread.isDisabled) || disabledProp;
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, textareaRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEscapeKeydown"])((e)=>{
        if (!cancelOnEscape) return;
        const composer = api.composer();
        if (composer.getState().canCancel) {
            composer.cancel();
            e.preventDefault();
        }
    });
    const handleKeyPress = (e)=>{
        if (isDisabled || !submitOnEnter) return;
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter" && e.shiftKey === false) {
            const isRunning = api.thread().getState().isRunning;
            if (!isRunning) {
                e.preventDefault();
                textareaRef.current?.closest("form")?.requestSubmit();
            }
        }
    };
    const handlePaste = async (e)=>{
        if (!addAttachmentOnPaste) return;
        const threadCapabilities = api.thread().getState().capabilities;
        const files = Array.from(e.clipboardData?.files || []);
        if (threadCapabilities.attachments && files.length > 0) {
            try {
                e.preventDefault();
                await Promise.all(files.map((file)=>api.composer().addAttachment(file)));
            } catch (error) {
                console.error("Error adding attachment:", error);
            }
        }
    };
    const autoFocusEnabled = autoFocus && !isDisabled;
    const focus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const textarea = textareaRef.current;
        if (!textarea || !autoFocusEnabled) return;
        textarea.focus({
            preventScroll: true
        });
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, [
        autoFocusEnabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>focus(), [
        focus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])(()=>{
        if (api.composer().getState().type === "thread" && unstable_focusOnScrollToBottom) {
            focus();
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (api.composer().getState().type !== "thread" || !unstable_focusOnRunStart) return void 0;
        return api.on("thread.run-start", focus);
    }, [
        unstable_focusOnRunStart,
        focus,
        api
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (api.composer().getState().type !== "thread" || !unstable_focusOnThreadSwitched) return void 0;
        return api.on("thread-list-item.switched-to", focus);
    }, [
        unstable_focusOnThreadSwitched,
        focus,
        api
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
        name: "input",
        value,
        ...rest,
        ref,
        disabled: isDisabled,
        onChange: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onChange, (e)=>{
            if (!api.composer().getState().isEditing) return;
            api.composer().setText(e.target.value);
            api.flushSync();
        }),
        onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onKeyDown, handleKeyPress),
        onPaste: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onPaste, handlePaste)
    });
});
ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
;
 //# sourceMappingURL=ComposerInput.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerCancel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveCancel",
    ()=>ComposerPrimitiveCancel
]);
// src/primitives/composer/ComposerCancel.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useComposerCancel = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>!composer.canCancel);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        api.composer().cancel();
    }, [
        api
    ]);
    if (disabled) return null;
    return callback;
};
var ComposerPrimitiveCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Cancel", useComposerCancel);
;
 //# sourceMappingURL=ComposerCancel.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAddAttachment.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAddAttachment",
    ()=>ComposerPrimitiveAddAttachment
]);
// src/primitives/composer/ComposerAddAttachment.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useComposerAddAttachment = ({ multiple = true } = {})=>{
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>!composer.isEditing);
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple;
        input.hidden = true;
        const attachmentAccept = api.composer().getState().attachmentAccept;
        if (attachmentAccept !== "*") {
            input.accept = attachmentAccept;
        }
        document.body.appendChild(input);
        input.onchange = (e)=>{
            const fileList = e.target.files;
            if (!fileList) return;
            for (const file of fileList){
                api.composer().addAttachment(file);
            }
            document.body.removeChild(input);
        };
        input.oncancel = ()=>{
            if (!input.files || input.files.length === 0) {
                document.body.removeChild(input);
            }
        };
        input.click();
    }, [
        api,
        multiple
    ]);
    if (disabled) return null;
    return callback;
};
var ComposerPrimitiveAddAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.AddAttachment", useComposerAddAttachment, [
    "multiple"
]);
;
 //# sourceMappingURL=ComposerAddAttachment.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/AttachmentByIndexProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerAttachmentByIndexProvider",
    ()=>ComposerAttachmentByIndexProvider,
    "MessageAttachmentByIndexProvider",
    ()=>MessageAttachmentByIndexProvider
]);
// src/context/providers/AttachmentByIndexProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/derived-scopes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var MessageAttachmentByIndexProvider = ({ index, children })=>{
    const baseApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useExtendedAssistantApi"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: ()=>baseApi.message().attachment({
                    index
                })
        })
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantProvider"], {
        api,
        children
    });
};
var ComposerAttachmentByIndexProvider = ({ index, children })=>{
    const baseApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useExtendedAssistantApi"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "composer",
            query: {
                type: "index",
                index
            },
            get: ()=>baseApi.composer().attachment({
                    index
                })
        })
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantProvider"], {
        api,
        children
    });
};
;
 //# sourceMappingURL=AttachmentByIndexProvider.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAttachments.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAttachmentByIndex",
    ()=>ComposerPrimitiveAttachmentByIndex,
    "ComposerPrimitiveAttachments",
    ()=>ComposerPrimitiveAttachments
]);
// src/primitives/composer/ComposerAttachments.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$AttachmentByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/AttachmentByIndexProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var getComponent = (components, attachment)=>{
    const type = attachment.type;
    switch(type){
        case "image":
            return components?.Image ?? components?.Attachment;
        case "document":
            return components?.Document ?? components?.Attachment;
        case "file":
            return components?.File ?? components?.Attachment;
        default:
            const _exhaustiveCheck = type;
            throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
};
var AttachmentComponent = ({ components })=>{
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ attachment: attachment2 })=>attachment2);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {});
};
var ComposerPrimitiveAttachmentByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$AttachmentByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerAttachmentByIndexProvider"], {
        index,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(AttachmentComponent, {
            components
        })
    });
}, (prev, next)=>prev.index === next.index && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment);
ComposerPrimitiveAttachmentByIndex.displayName = "ComposerPrimitive.AttachmentByIndex";
var ComposerPrimitiveAttachments = ({ components })=>{
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.composer.attachments.length);
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: attachmentsCount
        }, (_, index)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ComposerPrimitiveAttachmentByIndex, {
                index,
                components
            }, index));
    }, [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";
;
 //# sourceMappingURL=ComposerAttachments.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerIf.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveIf",
    ()=>ComposerPrimitiveIf
]);
// src/primitives/composer/ComposerIf.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var useComposerIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ composer })=>{
        if (props.editing === true && !composer.isEditing) return false;
        if (props.editing === false && composer.isEditing) return false;
        return true;
    });
};
var ComposerPrimitiveIf = ({ children, ...query })=>{
    const result = useComposerIf(query);
    return result ? children : null;
};
ComposerPrimitiveIf.displayName = "ComposerPrimitive.If";
;
 //# sourceMappingURL=ComposerIf.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/primitives/composer/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerInput$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInput.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerSend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerSend.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerCancel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerCancel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAddAttachment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAddAttachment.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAttachments.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerIf.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddAttachment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAddAttachment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAddAttachment"],
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachmentByIndex"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachments"],
    "Cancel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerCancel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveCancel"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveIf"],
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerInput$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveInput"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveRoot"],
    "Send",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerSend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveSend"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerInput$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInput.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerSend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerSend.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerCancel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerCancel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAddAttachment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAddAttachment.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAttachments.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$ComposerIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerIf.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/index.js [app-ssr] (ecmascript) <export * as ComposerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$composer$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/composer/index.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/hooks/useManagedRef.ts
__turbopack_context__.s([
    "useManagedRef",
    ()=>useManagedRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
var useManagedRef = (callback)=>{
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(void 0);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        if (cleanupRef.current) {
            cleanupRef.current();
        }
        if (el) {
            cleanupRef.current = callback(el);
        }
    }, [
        callback
    ]);
    return ref;
};
;
 //# sourceMappingURL=useManagedRef.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageRoot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveRoot",
    ()=>MessagePrimitiveRoot
]);
// src/primitives/message/MessageRoot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var useIsHoveringRef = ()=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(()=>api.message());
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        const handleMouseEnter = ()=>{
            message.setIsHovering(true);
        };
        const handleMouseLeave = ()=>{
            message.setIsHovering(false);
        };
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        if (el.matches(":hover")) message.setIsHovering(true);
        return ()=>{
            el.removeEventListener("mouseenter", handleMouseEnter);
            el.removeEventListener("mouseleave", handleMouseLeave);
            message.setIsHovering(false);
        };
    }, [
        message
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(callbackRef);
};
var MessagePrimitiveRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardRef2)=>{
    const isHoveringRef = useIsHoveringRef();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardRef2, isHoveringRef);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref
    });
});
MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
;
 //# sourceMappingURL=MessageRoot.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/PartByIndexProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PartByIndexProvider",
    ()=>PartByIndexProvider
]);
// src/context/providers/PartByIndexProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/derived-scopes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var PartByIndexProvider = ({ index, children })=>{
    const baseApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useExtendedAssistantApi"])({
        part: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: ()=>baseApi.message().part({
                    index
                })
        })
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantProvider"], {
        api,
        children
    });
};
;
 //# sourceMappingURL=PartByIndexProvider.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/TextMessagePartProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextMessagePartProvider",
    ()=>TextMessagePartProvider
]);
// src/context/providers/TextMessagePartProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$core$2f$resource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+tap@0.1.5_react@19.2.0/node_modules/@assistant-ui/tap/dist/core/resource.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$hooks$2f$tap$2d$memo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+tap@0.1.5_react@19.2.0/node_modules/@assistant-ui/tap/dist/hooks/tap-memo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$react$2f$use$2d$resource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+tap@0.1.5_react@19.2.0/node_modules/@assistant-ui/tap/dist/react/use-resource.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/store.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$tap$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/tap-api.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/derived-scopes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var TextMessagePartClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$core$2f$resource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ text, isRunning })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$hooks$2f$tap$2d$memo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            type: "text",
            text,
            status: isRunning ? {
                type: "running"
            } : {
                type: "complete"
            }
        }), [
        text,
        isRunning
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$tap$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapApi"])({
        getState: ()=>state,
        addToolResult: ()=>{
            throw new Error("Not supported");
        },
        resumeToolCall: ()=>{
            throw new Error("Not supported");
        }
    });
});
var TextMessagePartProvider = ({ text, isRunning = false, children })=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$tap$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$assistant$2d$ui$2f$tap$2f$dist$2f$react$2f$use$2d$resource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asStore"])(TextMessagePartClient({
        text,
        isRunning
    })));
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useExtendedAssistantApi"])({
        part: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "root",
            query: {},
            get: ()=>store.getState().api
        }),
        subscribe: store.subscribe,
        flushSync: store.flushSync
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantProvider"], {
        api,
        children
    });
};
;
 //# sourceMappingURL=TextMessagePartProvider.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartText.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartText",
    ()=>useMessagePartText
]);
// src/primitives/messagePart/useMessagePartText.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var useMessagePartText = ()=>{
    const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ part })=>{
        if (part.type !== "text" && part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
        return part;
    });
    return text;
};
;
 //# sourceMappingURL=useMessagePartText.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveText",
    ()=>MessagePartPrimitiveText
]);
// src/primitives/messagePart/MessagePartText.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$useMessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartText.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$smooth$2f$useSmooth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/smooth/useSmooth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
var MessagePartPrimitiveText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ smooth = true, component: Component = "span", ...rest }, forwardedRef)=>{
    const { text, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$smooth$2f$useSmooth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmooth"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$useMessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMessagePartText"])(), smooth);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
        "data-status": status.type,
        ...rest,
        ref: forwardedRef,
        children: text
    });
});
MessagePartPrimitiveText.displayName = "MessagePartPrimitive.Text";
;
 //# sourceMappingURL=MessagePartText.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartImage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartImage",
    ()=>useMessagePartImage
]);
// src/primitives/messagePart/useMessagePartImage.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var useMessagePartImage = ()=>{
    const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ part })=>{
        if (part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
        return part;
    });
    return image;
};
;
 //# sourceMappingURL=useMessagePartImage.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveImage",
    ()=>MessagePartPrimitiveImage
]);
// src/primitives/messagePart/MessagePartImage.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$useMessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartImage.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
var MessagePartPrimitiveImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardedRef)=>{
    const { image } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$useMessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMessagePartImage"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].img, {
        src: image,
        ...props,
        ref: forwardedRef
    });
});
MessagePartPrimitiveImage.displayName = "MessagePartPrimitive.Image";
;
 //# sourceMappingURL=MessagePartImage.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartInProgress.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveInProgress",
    ()=>MessagePartPrimitiveInProgress
]);
// src/primitives/messagePart/MessagePartInProgress.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var MessagePartPrimitiveInProgress = ({ children })=>{
    const isInProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ part })=>part.status.type === "running");
    return isInProgress ? children : null;
};
MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";
;
 //# sourceMappingURL=MessagePartInProgress.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageParts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitivePartByIndex",
    ()=>MessagePrimitivePartByIndex,
    "MessagePrimitiveParts",
    ()=>MessagePrimitiveParts
]);
// src/primitives/message/MessageParts.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$PartByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/PartByIndexProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$TextMessagePartProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/TextMessagePartProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartInProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartInProgress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react/shallow.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
var createGroupState = (groupType)=>{
    let start = -1;
    return {
        startGroup: (index)=>{
            if (start === -1) {
                start = index;
            }
        },
        endGroup: (endIndex, ranges)=>{
            if (start !== -1) {
                ranges.push({
                    type: groupType,
                    startIndex: start,
                    endIndex
                });
                start = -1;
            }
        },
        finalize: (endIndex, ranges)=>{
            if (start !== -1) {
                ranges.push({
                    type: groupType,
                    startIndex: start,
                    endIndex
                });
            }
        }
    };
};
var groupMessageParts = (messageTypes)=>{
    const ranges = [];
    const toolGroup = createGroupState("toolGroup");
    const reasoningGroup = createGroupState("reasoningGroup");
    for(let i = 0; i < messageTypes.length; i++){
        const type = messageTypes[i];
        if (type === "tool-call") {
            reasoningGroup.endGroup(i - 1, ranges);
            toolGroup.startGroup(i);
        } else if (type === "reasoning") {
            toolGroup.endGroup(i - 1, ranges);
            reasoningGroup.startGroup(i);
        } else {
            toolGroup.endGroup(i - 1, ranges);
            reasoningGroup.endGroup(i - 1, ranges);
            ranges.push({
                type: "single",
                index: i
            });
        }
    }
    toolGroup.finalize(messageTypes.length - 1, ranges);
    reasoningGroup.finalize(messageTypes.length - 1, ranges);
    return ranges;
};
var useMessagePartsGroups = ()=>{
    const messageTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShallow"])((s)=>s.message.parts.map((c)=>c.type)));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (messageTypes.length === 0) {
            return [];
        }
        return groupMessageParts(messageTypes);
    }, [
        messageTypes
    ]);
};
var ToolUIDisplay = ({ Fallback, ...props })=>{
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ toolUIs })=>{
        const Render2 = toolUIs.tools[props.toolName] ?? toolUIs.fallback ?? Fallback;
        if (Array.isArray(Render2)) return Render2[0] ?? Fallback;
        return Render2;
    });
    if (!Render) return null;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Render, {
        ...props
    });
};
var defaultComponents = {
    Text: ()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartInProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        style: {
                            fontFamily: "revert"
                        },
                        children: " \u25CF"
                    })
                })
            ]
        }),
    Reasoning: ()=>null,
    Source: ()=>null,
    Image: ()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}),
    File: ()=>null,
    Unstable_Audio: ()=>null,
    ToolGroup: ({ children })=>children,
    ReasoningGroup: ({ children })=>children
};
var MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {} } = {} })=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ part: part2 })=>part2);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = api.part().addToolResult;
        const resume = api.part().resumeToolCall;
        if ("Override" in tools) return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(tools.Override, {
            ...part,
            addResult,
            resume
        });
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ToolUIDisplay, {
            ...part,
            Fallback: Tool,
            addResult,
            resume
        });
    }
    if (part.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
    switch(type){
        case "text":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Text, {
                ...part
            });
        case "reasoning":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Reasoning, {
                ...part
            });
        case "source":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Source, {
                ...part
            });
        case "image":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Image, {
                ...part
            });
        case "file":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(File, {
                ...part
            });
        case "audio":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Audio, {
                ...part
            });
        default:
            const unhandledType = type;
            throw new Error(`Unknown message part type: ${unhandledType}`);
    }
};
var MessagePrimitivePartByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$PartByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePartComponent, {
            components
        })
    });
}, (prev, next)=>prev.index === next.index && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools && prev.components?.ToolGroup === next.components?.ToolGroup && prev.components?.ReasoningGroup === next.components?.ReasoningGroup);
MessagePrimitivePartByIndex.displayName = "MessagePrimitive.PartByIndex";
var EmptyPartFallback = ({ status, component: Component })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$TextMessagePartProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            type: "text",
            text: "",
            status
        })
    });
};
var COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
var EmptyPartsImpl = ({ components })=>{
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.message.status ?? COMPLETE_STATUS);
    if (components?.Empty) return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(components.Empty, {
        status
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EmptyPartFallback, {
        status,
        component: components?.Text ?? defaultComponents.Text
    });
};
var EmptyParts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
var MessagePrimitiveParts = ({ components })=>{
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.parts.length);
    const messageRanges = useMessagePartsGroups();
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (contentLength === 0) {
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EmptyParts, {
                components
            });
        }
        return messageRanges.map((range)=>{
            if (range.type === "single") {
                return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePrimitivePartByIndex, {
                    index: range.index,
                    components
                }, range.index);
            } else if (range.type === "toolGroup") {
                const ToolGroupComponent = components.ToolGroup ?? defaultComponents.ToolGroup;
                return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ToolGroupComponent, {
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                    children: Array.from({
                        length: range.endIndex - range.startIndex + 1
                    }, (_, i)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePrimitivePartByIndex, {
                            index: range.startIndex + i,
                            components
                        }, i))
                }, `tool-${range.startIndex}`);
            } else {
                const ReasoningGroupComponent = components.ReasoningGroup ?? defaultComponents.ReasoningGroup;
                return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ReasoningGroupComponent, {
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                    children: Array.from({
                        length: range.endIndex - range.startIndex + 1
                    }, (_, i)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePrimitivePartByIndex, {
                            index: range.startIndex + i,
                            components
                        }, i))
                }, `reasoning-${range.startIndex}`);
            }
        });
    }, [
        messageRanges,
        components,
        contentLength
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: partsElements
    });
};
MessagePrimitiveParts.displayName = "MessagePrimitive.Parts";
;
 //# sourceMappingURL=MessageParts.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageAttachments.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveAttachmentByIndex",
    ()=>MessagePrimitiveAttachmentByIndex,
    "MessagePrimitiveAttachments",
    ()=>MessagePrimitiveAttachments
]);
// src/primitives/message/MessageAttachments.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$AttachmentByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/AttachmentByIndexProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var getComponent = (components, attachment)=>{
    const type = attachment.type;
    switch(type){
        case "image":
            return components?.Image ?? components?.Attachment;
        case "document":
            return components?.Document ?? components?.Attachment;
        case "file":
            return components?.File ?? components?.Attachment;
        default:
            const _exhaustiveCheck = type;
            throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
};
var AttachmentComponent = ({ components })=>{
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ attachment: attachment2 })=>attachment2);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {});
};
var MessagePrimitiveAttachmentByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$AttachmentByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageAttachmentByIndexProvider"], {
        index,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(AttachmentComponent, {
            components
        })
    });
}, (prev, next)=>prev.index === next.index && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment);
MessagePrimitiveAttachmentByIndex.displayName = "MessagePrimitive.AttachmentByIndex";
var MessagePrimitiveAttachments = ({ components })=>{
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>{
        if (message.role !== "user") return 0;
        return message.attachments.length;
    });
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: attachmentsCount
        }, (_, index)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePrimitiveAttachmentByIndex, {
                index,
                components
            }, index));
    }, [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
;
 //# sourceMappingURL=MessageAttachments.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageError.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveError",
    ()=>MessagePrimitiveError
]);
// src/primitives/message/MessageError.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
var MessagePrimitiveError = ({ children })=>{
    const hasError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.status?.type === "incomplete" && message.status.reason === "error");
    return hasError ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children
    }) : null;
};
MessagePrimitiveError.displayName = "MessagePrimitive.Error";
;
 //# sourceMappingURL=MessageError.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessagePartsGrouped.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveUnstable_PartsGrouped",
    ()=>MessagePrimitiveUnstable_PartsGrouped,
    "MessagePrimitiveUnstable_PartsGroupedByParentId",
    ()=>MessagePrimitiveUnstable_PartsGroupedByParentId
]);
// src/primitives/message/MessagePartsGrouped.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$PartByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/PartByIndexProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$TextMessagePartProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/TextMessagePartProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartInProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartInProgress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var groupMessagePartsByParentId = (parts)=>{
    const groupMap = /* @__PURE__ */ new Map();
    for(let i = 0; i < parts.length; i++){
        const part = parts[i];
        const parentId = part?.parentId;
        const groupId = parentId ?? `__ungrouped_${i}`;
        const indices = groupMap.get(groupId) ?? [];
        indices.push(i);
        groupMap.set(groupId, indices);
    }
    const groups = [];
    for (const [groupId, indices] of groupMap){
        const groupKey = groupId.startsWith("__ungrouped_") ? void 0 : groupId;
        groups.push({
            groupKey,
            indices
        });
    }
    return groups;
};
var useMessagePartsGrouped = (groupingFunction)=>{
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.parts);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (parts.length === 0) {
            return [];
        }
        return groupingFunction(parts);
    }, [
        parts,
        groupingFunction
    ]);
};
var ToolUIDisplay = ({ Fallback, ...props })=>{
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ toolUIs })=>{
        const Render2 = toolUIs.tools[props.toolName] ?? toolUIs.fallback ?? Fallback;
        if (Array.isArray(Render2)) return Render2[0] ?? Fallback;
        return Render2;
    });
    if (!Render) return null;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Render, {
        ...props
    });
};
var defaultComponents = {
    Text: ()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartText$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartInProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        style: {
                            fontFamily: "revert"
                        },
                        children: " \u25CF"
                    })
                })
            ]
        }),
    Reasoning: ()=>null,
    Source: ()=>null,
    Image: ()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$messagePart$2f$MessagePartImage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}),
    File: ()=>null,
    Unstable_Audio: ()=>null,
    Group: ({ children })=>children
};
var MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {} } = {} })=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ part: part2 })=>part2);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = (result)=>api.part().addToolResult(result);
        const resume = api.part().resumeToolCall;
        if ("Override" in tools) return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(tools.Override, {
            ...part,
            addResult,
            resume
        });
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ToolUIDisplay, {
            ...part,
            Fallback: Tool,
            addResult,
            resume
        });
    }
    if (part.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
    switch(type){
        case "text":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Text, {
                ...part
            });
        case "reasoning":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Reasoning, {
                ...part
            });
        case "source":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Source, {
                ...part
            });
        case "image":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Image, {
                ...part
            });
        case "file":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(File, {
                ...part
            });
        case "audio":
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Audio, {
                ...part
            });
        default:
            const unhandledType = type;
            throw new Error(`Unknown message part type: ${unhandledType}`);
    }
};
var MessagePartImpl = ({ partIndex, components })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$PartByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index: partIndex,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePartComponent, {
            components
        })
    });
};
var MessagePart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(MessagePartImpl, (prev, next)=>prev.partIndex === next.partIndex && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools && prev.components?.Group === next.components?.Group);
var EmptyPartFallback = ({ status, component: Component })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$TextMessagePartProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            type: "text",
            text: "",
            status
        })
    });
};
var COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
var EmptyPartsImpl = ({ components })=>{
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])((s)=>s.message.status ?? COMPLETE_STATUS);
    if (components?.Empty) return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(components.Empty, {
        status
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EmptyPartFallback, {
        status,
        component: components?.Text ?? defaultComponents.Text
    });
};
var EmptyParts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
var MessagePrimitiveUnstable_PartsGrouped = ({ groupingFunction, components })=>{
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.parts.length);
    const messageGroups = useMessagePartsGrouped(groupingFunction);
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (contentLength === 0) {
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EmptyParts, {
                components
            });
        }
        return messageGroups.map((group, groupIndex)=>{
            const GroupComponent = components?.Group ?? defaultComponents.Group;
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(GroupComponent, {
                groupKey: group.groupKey,
                indices: group.indices,
                children: group.indices.map((partIndex)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePart, {
                        partIndex,
                        components
                    }, partIndex))
            }, `group-${groupIndex}-${group.groupKey ?? "ungrouped"}`);
        });
    }, [
        messageGroups,
        components,
        contentLength
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: partsElements
    });
};
MessagePrimitiveUnstable_PartsGrouped.displayName = "MessagePrimitive.Unstable_PartsGrouped";
var MessagePrimitiveUnstable_PartsGroupedByParentId = ({ components, ...props })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MessagePrimitiveUnstable_PartsGrouped, {
        ...props,
        components,
        groupingFunction: groupMessagePartsByParentId
    });
};
MessagePrimitiveUnstable_PartsGroupedByParentId.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
;
 //# sourceMappingURL=MessagePartsGrouped.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/primitives/message/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageAttachments.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageError.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessagePartsGrouped$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessagePartsGrouped.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachmentByIndex"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachments"],
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Error",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveError"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"],
    "PartByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitivePartByIndex"],
    "Parts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveRoot"],
    "Unstable_PartsGrouped",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessagePartsGrouped$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGrouped"],
    "Unstable_PartsGroupedByParentId",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessagePartsGrouped$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGroupedByParentId"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageAttachments$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageAttachments.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessageError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessageError.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$MessagePartsGrouped$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/MessagePartsGrouped.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/index.js [app-ssr] (ecmascript) <export * as MessagePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$message$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/message/index.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadRoot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveRoot",
    ()=>ThreadPrimitiveRoot
]);
// src/primitives/thread/ThreadRoot.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var ThreadPrimitiveRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref
    });
});
ThreadPrimitiveRoot.displayName = "ThreadPrimitive.Root";
;
 //# sourceMappingURL=ThreadRoot.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadEmpty.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveEmpty",
    ()=>ThreadPrimitiveEmpty
]);
// src/primitives/thread/ThreadEmpty.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var ThreadPrimitiveEmpty = ({ children })=>{
    const empty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread })=>thread.messages.length === 0 && !thread.isLoading);
    return empty ? children : null;
};
ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";
;
 //# sourceMappingURL=ThreadEmpty.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadIf.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveIf",
    ()=>ThreadPrimitiveIf
]);
// src/primitives/thread/ThreadIf.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
"use client";
;
var useThreadIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread })=>{
        const isEmpty = thread.messages.length === 0 && !thread.isLoading;
        if (props.empty === true && !isEmpty) return false;
        if (props.empty === false && isEmpty) return false;
        if (props.running === true && !thread.isRunning) return false;
        if (props.running === false && thread.isRunning) return false;
        if (props.disabled === true && !thread.isDisabled) return false;
        if (props.disabled === false && thread.isDisabled) return false;
        return true;
    });
};
var ThreadPrimitiveIf = ({ children, ...query })=>{
    const result = useThreadIf(query);
    return result ? children : null;
};
ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";
;
 //# sourceMappingURL=ThreadIf.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantEvent.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/react/hooks/useAssistantEvent.ts
__turbopack_context__.s([
    "useAssistantEvent",
    ()=>useAssistantEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/types/EventTypes.js [app-ssr] (ecmascript)");
;
;
;
var useAssistantEvent = (selector, callback)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(callback);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        callbackRef.current = callback;
    });
    const { scope, event } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>api.on({
            scope,
            event
        }, (e)=>callbackRef.current(e)), [
        api,
        scope,
        event
    ]);
};
;
 //# sourceMappingURL=useAssistantEvent.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useOnResizeContent.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/hooks/useOnResizeContent.tsx
__turbopack_context__.s([
    "useOnResizeContent",
    ()=>useOnResizeContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js [app-ssr] (ecmascript)");
;
;
;
var useOnResizeContent = (callback)=>{
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const refCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        const resizeObserver = new ResizeObserver(()=>{
            callbackRef();
        });
        const mutationObserver = new MutationObserver(()=>{
            callbackRef();
        });
        resizeObserver.observe(el);
        mutationObserver.observe(el, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
        return ()=>{
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [
        callbackRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(refCallback);
};
;
 //# sourceMappingURL=useOnResizeContent.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/useThreadViewportAutoScroll.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThreadViewportAutoScroll",
    ()=>useThreadViewportAutoScroll
]);
// src/primitives/thread/useThreadViewportAutoScroll.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantEvent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantEvent.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnResizeContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useOnResizeContent.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useOnScrollToBottom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$ReadonlyStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/ReadonlyStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
var useThreadViewportAutoScroll = ({ autoScroll = true })=>{
    const divRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    const lastScrollTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isScrollingToBottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((behavior)=>{
        const div = divRef.current;
        if (!div || !autoScroll) return;
        isScrollingToBottomRef.current = true;
        div.scrollTo({
            top: div.scrollHeight,
            behavior
        });
    }, [
        autoScroll
    ]);
    const handleScroll = ()=>{
        const div = divRef.current;
        if (!div) return;
        const isAtBottom = threadViewportStore.getState().isAtBottom;
        const newIsAtBottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 1;
        if (!newIsAtBottom && lastScrollTop.current < div.scrollTop) {} else {
            if (newIsAtBottom) {
                isScrollingToBottomRef.current = false;
            }
            if (newIsAtBottom !== isAtBottom) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$ReadonlyStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(threadViewportStore).setState({
                    isAtBottom: newIsAtBottom
                });
            }
        }
        lastScrollTop.current = div.scrollTop;
    };
    const resizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnResizeContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnResizeContent"])(()=>{
        if (isScrollingToBottomRef.current || threadViewportStore.getState().isAtBottom) {
            scrollToBottom("instant");
        }
        handleScroll();
    });
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useManagedRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])((el)=>{
        el.addEventListener("scroll", handleScroll);
        return ()=>{
            el.removeEventListener("scroll", handleScroll);
        };
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$hooks$2f$useOnScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])(()=>{
        scrollToBottom("auto");
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantEvent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantEvent"])("thread.run-start", ()=>scrollToBottom("auto"));
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(resizeRef, scrollRef, divRef);
    return autoScrollRef;
};
;
 //# sourceMappingURL=useThreadViewportAutoScroll.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewport.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewport",
    ()=>ThreadPrimitiveViewport
]);
// src/primitives/thread/ThreadViewport.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19._5a2glf4dmhj35mkrlxuofttjoy/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$useThreadViewportAutoScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/useThreadViewportAutoScroll.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$ThreadViewportProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/ThreadViewportProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
var ThreadPrimitiveViewportScrollable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ autoScroll, children, ...rest }, forwardedRef)=>{
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$useThreadViewportAutoScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportAutoScroll"])({
        autoScroll
    });
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, autoScrollRef);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$_5a2glf4dmhj35mkrlxuofttjoy$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...rest,
        ref,
        children
    });
});
ThreadPrimitiveViewportScrollable.displayName = "ThreadPrimitive.ViewportScrollable";
var ThreadPrimitiveViewport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$ThreadViewportProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadViewportProvider"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ThreadPrimitiveViewportScrollable, {
            ...props,
            ref
        })
    });
});
ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";
;
 //# sourceMappingURL=ThreadViewport.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/MessageByIndexProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageByIndexProvider",
    ()=>MessageByIndexProvider
]);
// src/context/providers/MessageByIndexProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/types/EventTypes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/tap-store/derived-scopes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
var MessageByIndexProvider = ({ index, children })=>{
    const baseApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useExtendedAssistantApi"])({
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "thread",
            query: {
                type: "index",
                index
            },
            get: ()=>baseApi.thread().message({
                    index
                })
        }),
        composer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$tap$2d$store$2f$derived$2d$scopes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DerivedScope"])({
            source: "message",
            query: {},
            get: ()=>baseApi.thread().message({
                    index
                }).composer
        }),
        on (selector, callback) {
            const getMessage = ()=>baseApi.thread().message({
                    index
                });
            const { event, scope } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkEventScope"])("composer", scope, event) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$types$2f$EventTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkEventScope"])("message", scope, event)) return baseApi.on(selector, callback);
            return baseApi.on({
                scope: "thread",
                event
            }, (e)=>{
                if (e.messageId === getMessage().getState().id) {
                    callback(e);
                }
            });
        }
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantProvider"], {
        api,
        children
    });
};
;
 //# sourceMappingURL=MessageByIndexProvider.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadMessages.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveMessageByIndex",
    ()=>ThreadPrimitiveMessageByIndex,
    "ThreadPrimitiveMessages",
    ()=>ThreadPrimitiveMessages,
    "ThreadPrimitiveMessagesImpl",
    ()=>ThreadPrimitiveMessagesImpl
]);
// src/primitives/thread/ThreadMessages.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$MessageByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/providers/MessageByIndexProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var isComponentsSame = (prev, next)=>{
    return prev.Message === next.Message && prev.EditComposer === next.EditComposer && prev.UserEditComposer === next.UserEditComposer && prev.AssistantEditComposer === next.AssistantEditComposer && prev.SystemEditComposer === next.SystemEditComposer && prev.UserMessage === next.UserMessage && prev.AssistantMessage === next.AssistantMessage && prev.SystemMessage === next.SystemMessage;
};
var DEFAULT_SYSTEM_MESSAGE = ()=>null;
var getComponent = (components, role, isEditing)=>{
    switch(role){
        case "user":
            if (isEditing) {
                return components.UserEditComposer ?? components.EditComposer ?? components.UserMessage ?? components.Message;
            } else {
                return components.UserMessage ?? components.Message;
            }
        case "assistant":
            if (isEditing) {
                return components.AssistantEditComposer ?? components.EditComposer ?? components.AssistantMessage ?? components.Message;
            } else {
                return components.AssistantMessage ?? components.Message;
            }
        case "system":
            if (isEditing) {
                return components.SystemEditComposer ?? components.EditComposer ?? components.SystemMessage ?? components.Message;
            } else {
                return components.SystemMessage ?? DEFAULT_SYSTEM_MESSAGE;
            }
        default:
            const _exhaustiveCheck = role;
            throw new Error(`Unknown message role: ${_exhaustiveCheck}`);
    }
};
var ThreadMessageComponent = ({ components })=>{
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.role);
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ message })=>message.composer.isEditing);
    const Component = getComponent(components, role, isEditing);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {});
};
var ThreadPrimitiveMessageByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$providers$2f$MessageByIndexProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageByIndexProvider"], {
        index,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ThreadMessageComponent, {
            components
        })
    });
}, (prev, next)=>prev.index === next.index && isComponentsSame(prev.components, next.components));
ThreadPrimitiveMessageByIndex.displayName = "ThreadPrimitive.MessageByIndex";
var ThreadPrimitiveMessagesImpl = ({ components })=>{
    const messagesLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread })=>thread.messages.length);
    const messageElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (messagesLength === 0) return null;
        return Array.from({
            length: messagesLength
        }, (_, index)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ThreadPrimitiveMessageByIndex, {
                index,
                components
            }, index));
    }, [
        messagesLength,
        components
    ]);
    return messageElements;
};
ThreadPrimitiveMessagesImpl.displayName = "ThreadPrimitive.Messages";
var ThreadPrimitiveMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(ThreadPrimitiveMessagesImpl, (prev, next)=>isComponentsSame(prev.components, next.components));
;
 //# sourceMappingURL=ThreadMessages.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadScrollToBottom.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveScrollToBottom",
    ()=>ThreadPrimitiveScrollToBottom
]);
// src/primitives/thread/ThreadScrollToBottom.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useThreadScrollToBottom = ()=>{
    const isAtBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.isAtBottom);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$ThreadViewportContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    const handleScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        threadViewportStore.getState().scrollToBottom();
    }, [
        threadViewportStore
    ]);
    if (isAtBottom) return null;
    return handleScrollToBottom;
};
var ThreadPrimitiveScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.ScrollToBottom", useThreadScrollToBottom);
;
 //# sourceMappingURL=ThreadScrollToBottom.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadSuggestion.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveSuggestion",
    ()=>ThreadPrimitiveSuggestion
]);
// src/primitives/thread/ThreadSuggestion.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/utils/createActionButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/hooks/useAssistantState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
;
var useThreadSuggestion = ({ prompt, send, clearComposer = true, autoSend, method: _method })=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$hooks$2f$useAssistantState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantState"])(({ thread })=>thread.isDisabled);
    const resolvedSend = send ?? autoSend ?? false;
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const isRunning = api.thread().getState().isRunning;
        if (resolvedSend && !isRunning) {
            api.thread().append(prompt);
            if (clearComposer) {
                api.composer().setText("");
            }
        } else {
            if (clearComposer) {
                api.composer().setText(prompt);
            } else {
                const currentText = api.composer().getState().text;
                api.composer().setText(currentText.trim() ? `${currentText} ${prompt}` : prompt);
            }
        }
    }, [
        api,
        resolvedSend,
        clearComposer,
        prompt
    ]);
    if (disabled) return null;
    return callback;
};
var ThreadPrimitiveSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$utils$2f$createActionButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.Suggestion", useThreadSuggestion, [
    "prompt",
    "send",
    "clearComposer",
    "autoSend",
    "method"
]);
;
 //# sourceMappingURL=ThreadSuggestion.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/primitives/thread/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadEmpty$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadEmpty.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadIf.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadViewport$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewport.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadMessages$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadMessages.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadScrollToBottom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadSuggestion$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadSuggestion.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Empty",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadEmpty$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveEmpty"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveIf"],
    "MessageByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadMessages$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessageByIndex"],
    "Messages",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadMessages$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessages"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveRoot"],
    "ScrollToBottom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveScrollToBottom"],
    "Suggestion",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadSuggestion$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestion"],
    "Viewport",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadViewport$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewport"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadRoot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadRoot.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadEmpty$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadEmpty.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadIf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadIf.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadViewport$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewport.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadMessages$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadMessages.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadScrollToBottom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadScrollToBottom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$ThreadSuggestion$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadSuggestion.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/index.js [app-ssr] (ecmascript) <export * as ThreadPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$primitives$2f$thread$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/primitives/thread/index.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/ensureBinding.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/react/utils/ensureBinding.ts
__turbopack_context__.s([
    "ensureBinding",
    ()=>ensureBinding
]);
var ensureBinding = (r)=>{
    const runtime = r;
    if (runtime.__isBound) return;
    runtime.__internal_bindMethods?.();
    runtime.__isBound = true;
};
;
 //# sourceMappingURL=ensureBinding.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/useRuntimeState.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/react/utils/useRuntimeState.ts
__turbopack_context__.s([
    "useRuntimeState",
    ()=>useRuntimeState,
    "useRuntimeStateInternal",
    ()=>useRuntimeStateInternal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$ensureBinding$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/ensureBinding.js [app-ssr] (ecmascript)");
;
;
function useRuntimeStateInternal(runtime, selector = identity) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$ensureBinding$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureBinding"])(runtime);
    const slice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(runtime.subscribe, ()=>selector(runtime.getState()), ()=>selector(runtime.getState()));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebugValue"])(slice);
    return slice;
}
var identity = (arg)=>arg;
function useRuntimeState(runtime, selector) {
    return useRuntimeStateInternal(runtime, selector);
}
;
 //# sourceMappingURL=useRuntimeState.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/createStateHookForRuntime.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/react/utils/createStateHookForRuntime.ts
__turbopack_context__.s([
    "createStateHookForRuntime",
    ()=>createStateHookForRuntime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$useRuntimeState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/useRuntimeState.js [app-ssr] (ecmascript)");
;
function createStateHookForRuntime(useRuntime) {
    function useStoreHook(param) {
        let optional = false;
        let selector;
        if (typeof param === "function") {
            selector = param;
        } else if (param) {
            optional = !!param.optional;
            selector = param.selector;
        }
        const store = useRuntime({
            optional
        });
        if (!store) return null;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$useRuntimeState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRuntimeStateInternal"])(store, selector);
    }
    return useStoreHook;
}
;
 //# sourceMappingURL=createStateHookForRuntime.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/AssistantContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantRuntime",
    ()=>useAssistantRuntime,
    "useThreadList",
    ()=>useThreadList
]);
// src/legacy-runtime/hooks/AssistantContext.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$createStateHookForRuntime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/utils/createStateHookForRuntime.js [app-ssr] (ecmascript)");
"use client";
;
;
function useAssistantRuntime(options) {
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    const runtime = api.threads().__internal_getAssistantRuntime?.() ?? null;
    if (!runtime && !options?.optional) {
        throw new Error("AssistantRuntime is not available");
    }
    return runtime;
}
var useThreadListRuntime = (opt)=>useAssistantRuntime(opt)?.threads ?? null;
var useThreadList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$utils$2f$createStateHookForRuntime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStateHookForRuntime"])(useThreadListRuntime);
;
 //# sourceMappingURL=AssistantContext.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/model-context/useAssistantInstructions.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantInstructions",
    ()=>useAssistantInstructions
]);
// src/model-context/useAssistantInstructions.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
var getInstructions = (instruction)=>{
    if (typeof instruction === "string") return {
        instruction
    };
    return instruction;
};
var useAssistantInstructions = (config)=>{
    const { instruction, disabled = false } = getInstructions(config);
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (disabled) return;
        const config2 = {
            system: instruction
        };
        return api.modelContext().register({
            getModelContext: ()=>config2
        });
    }, [
        api,
        instruction,
        disabled
    ]);
};
;
 //# sourceMappingURL=useAssistantInstructions.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/model-context/tool.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/model-context/tool.ts
__turbopack_context__.s([
    "tool",
    ()=>tool
]);
function tool(tool2) {
    return tool2;
}
;
 //# sourceMappingURL=tool.js.map
}),
"[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/model-context/useAssistantToolUI.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantToolUI",
    ()=>useAssistantToolUI
]);
// src/model-context/useAssistantToolUI.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@assistant-ui+react@0.11.37_@types+react-dom@19.2.2_@types+react@19.2.2__@types+react@19.2.2__utqnq2rpqwwcg76r2vcd3th5pi/node_modules/@assistant-ui/react/dist/context/react/AssistantApiContext.js [app-ssr] (ecmascript)");
"use client";
;
;
var useAssistantToolUI = (tool)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$assistant$2d$ui$2b$react$40$0$2e$11$2e$37_$40$types$2b$react$2d$dom$40$19$2e$2$2e$2_$40$types$2b$react$40$19$2e$2$2e$2_$5f40$types$2b$react$40$19$2e$2$2e$2_$5f$utqnq2rpqwwcg76r2vcd3th5pi$2f$node_modules$2f40$assistant$2d$ui$2f$react$2f$dist$2f$context$2f$react$2f$AssistantApiContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantApi"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!tool?.toolName || !tool?.render) return void 0;
        return api.toolUIs().setToolUI(tool.toolName, tool.render);
    }, [
        api,
        tool?.toolName,
        tool?.render
    ]);
};
;
 //# sourceMappingURL=useAssistantToolUI.js.map
}),
];

//# sourceMappingURL=e734c_%40assistant-ui_react_dist_72b6d0d3._.js.map