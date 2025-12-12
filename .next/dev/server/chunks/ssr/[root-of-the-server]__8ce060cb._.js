module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
;
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toast",
    ()=>Toast,
    "ToastAction",
    ()=>ToastAction,
    "ToastClose",
    ()=>ToastClose,
    "ToastDescription",
    ()=>ToastDescription,
    "ToastProvider",
    ()=>ToastProvider,
    "ToastTitle",
    ()=>ToastTitle,
    "ToastViewport",
    ()=>ToastViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/src/components/ui/toaster.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/locales/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"header\":{\"forBrands\":\"For Brands\",\"forCreators\":\"For Creators\",\"faq\":\"FAQ\",\"support\":\"Support\",\"login\":\"Login\",\"logout\":\"Logout\",\"dashboard\":\"Dashboard\",\"home\":\"Home\",\"profile\":\"My Profile\",\"discover\":\"Discover\",\"messages\":\"Messages\",\"creators\":\"Creators\",\"notifications\":\"Notifications\",\"myAccount\":\"My Account\",\"settings\":\"Settings\"},\"navigation\":{\"backToDashboard\":\"Back to Dashboard\",\"backToDiscovery\":\"Back to Discovery\",\"backToCampaign\":\"Back to Campaign Details\"},\"chat\":{\"title\":\"Deals\",\"tabs\":{\"negotiations\":\"Negotiating\",\"active\":\"Active\",\"archived\":\"Archived\"},\"emptyTab\":\"No conversations in this category.\",\"noMessages\":\"No messages yet\",\"loadingMessages\":\"Loading messages...\",\"viewProfile\":\"View Profile\",\"status\":{\"yourResponse\":\"Awaiting your response\",\"waitingForCreator\":\"Waiting for creator's response\",\"brandReviewing\":\"Brand is reviewing your offer\",\"fund\":\"Deal Agreed. Fund to start.\",\"awaitingFunds\":\"Deal Agreed. Awaiting funds.\",\"offerAccepted\":\"Offer accepted. Awaiting payment.\",\"fundsSecured\":\"Funds Secured. Work in progress.\",\"review\":\"Work submitted for validation.\",\"completed\":\"Campaign complete!\",\"cancelled\":\"Negotiation cancelled.\",\"status\":\"Status\"},\"budget\":{\"lastOffer\":\"Last Offer\",\"agreed\":\"Agreed Budget\",\"theirOffer\":\"Their Offer\"},\"fundEscrow\":\"Fund Escrow\",\"initialCard\":{\"titleCreator\":\"Discussion for\",\"titleBrand\":\"Application for\",\"descriptionCreator\":\"The brand has opened a discussion based on your application.\",\"descriptionBrand\":\"Opened on\",\"yourOffer\":\"Your Opening Offer\",\"creatorOffer\":\"Creator's Opening Offer\",\"coverLetter\":\"Original Cover Letter\"},\"offerCard\":{\"yourOffer\":\"Your Offer\",\"youProposed\":\"You proposed a budget of\",\"offerReceived\":\"Offer Received\",\"theyProposed\":\"{name} proposed a budget of\"},\"accept\":\"Accept\",\"reject\":\"Reject\",\"accepted\":\"Accepted\",\"rejected\":\"Rejected\",\"superseded\":\"Superseded\",\"eventAccepted\":\"Offer accepted by {role} at {amount} MAD.\",\"eventFunded\":\"The funds have been secured by the brand.\",\"eventAcceptedAwaitingFunds\":\"Offer accepted by {role}. Awaiting funds from the Brand.\",\"waitingResponse\":\"Waiting for the other party's response...\",\"acceptRate\":\"Accept Rate ({amount} MAD)\",\"or\":\"OR\",\"proposeNew\":\"Propose New Rate\",\"decline\":\"Decline\",\"proposalForm\":{\"title\":\"New Proposal\",\"description\":\"Propose a new budget and add a message if you wish.\",\"amount\":\"Amount (MAD)\",\"message\":\"Message (optional)\",\"placeholder\":\"e.g., This is my maximum budget...\",\"send\":\"Send Offer\"},\"guardianBot\":{\"title\":\"Message Blocked by Guardian Bot\",\"description\":\"Sharing contact information is forbidden during negotiation. Please keep communication on VibeMatch for your security.\"},\"placeholder\":{\"inactive\":\"This conversation is not active for messages.\",\"negotiation\":\"Use the actions below to respond to the offer.\",\"active\":\"Discuss creative details...\"},\"notFound\":{\"title\":\"Conversation not found\"},\"accessDenied\":{\"title\":\"Access Denied\",\"description\":\"You are not a participant in this conversation.\"},\"toast\":{\"offerAccepted\":{\"title\":\"Offer Accepted!\",\"description\":\"The brand can now fund the project.\"},\"offerRejected\":\"Offer Rejected\",\"negotiationCancelled\":\"Negotiation Cancelled\",\"cancelError\":\"Could not cancel the negotiation.\"},\"otherParty\":\"The other party\"},\"brandDashboard\":{\"title\":\"Brand Dashboard\",\"createButton\":\"New Campaign\",\"stats\":{\"active\":\"Active Campaigns\",\"applications\":\"New Applications\",\"budget\":\"Planned Budget\",\"escrow\":\"Secured in Escrow\",\"escrowSubtitle\":\"Real money locked for active projects.\",\"plannedBudgetSubtitle\":\"Sum of your active campaigns.\"},\"createdOn\":\"Created on {date}\",\"editAction\":\"Edit\",\"deleteAction\":\"Delete\",\"deleteDialog\":{\"title\":\"Are you sure?\",\"description\":\"This will permanently delete your campaign and all its data. This action cannot be undone.\",\"cancel\":\"Cancel\",\"confirm\":\"Yes, Delete\"},\"hiringProgress\":\"Hiring Progress\",\"manageButton\":\"Manage Applications\",\"viewButton\":\"View Campaign\",\"fundNowButton\":\"FUND NOW\",\"emptyState\":{\"title\":\"Your Dashboard Awaits\",\"description\":\"This is where you'll manage your campaigns and connect with creators. Start by creating your first campaign.\",\"cta\":\"Create First Campaign\"},\"deleteToast\":{\"deleting\":\"Deleting campaign...\",\"successTitle\":\"Campaign Deleted\",\"successDescription\":\"Your campaign has been successfully removed.\",\"errorTitle\":\"Deletion Failed\"},\"actions\":{\"title\":\"ACTION CENTER\",\"payment\":\"PAYMENT\",\"pay\":\"Pay\",\"fundCreator\":\"Fund the deal with {name}\",\"applicants\":\"APPLICANTS\",\"review\":\"Review\",\"newApplicants\":\"{count, plural, one {1 new applicant} other {# new applicants}} to review.\",\"message\":\"MESSAGE\",\"newMessage\":\"{name} has sent you a new message.\",\"reply\":\"Reply\",\"aCreator\":\"a creator\"},\"filters\":{\"all\":\"All\",\"toFund\":\"To Fund\",\"hiring\":\"Hiring\",\"inProgress\":\"In Progress\",\"archived\":\"Archived\"},\"emptyFilter\":{\"title\":\"No Campaigns Here\",\"description\":\"There are no campaigns matching your current filter.\"}},\"creatorDashboard\":{\"discoverButton\":\"Discover Campaigns\",\"stats\":{\"escrow\":\"Funds in Escrow\",\"escrowSubtitle\":\"Money secured for active projects.\",\"matching\":\"Matching Opportunities\",\"matchingSubtitle\":\"{value} campaigns are looking for a profile like yours.\",\"views\":\"Profile Views (7d)\",\"viewsSubtitle\":\"{value} brands saw your profile today.\"},\"tabs\":{\"active\":\"Active\",\"payment\":\"Awaiting Payment\",\"discussion\":\"In Discussion\",\"pending\":\"Pending\"},\"actions\":{\"review\":\"Review & Accept\",\"view\":\"View Details\",\"chat\":\"Open Chat\",\"withdraw\":\"Withdraw Application\"},\"deleteDialog\":{\"title\":\"Are you sure?\",\"description\":\"This will remove your application for \\\"{campaignTitle}\\\". The brand will no longer be able to see it. You can apply again later if the campaign is still open.\",\"confirm\":\"Yes, Withdraw\"},\"emptyStates\":{\"active\":{\"title\":\"No active campaigns yet\",\"description\":\"Campaigns you are accepted for will appear here. Time to find your next collaboration!\"},\"payment\":{\"title\":\"No payments pending\",\"description\":\"When a brand funds a campaign you've accepted, it will move to your 'Active' tab.\"},\"discussion\":{\"title\":\"No negotiations in progress\",\"description\":\"When a brand is interested in your application, you can negotiate terms here.\"},\"pending\":{\"title\":\"You haven't applied to any campaigns\",\"description\":\"Browse open campaigns from top brands and apply to start collaborating.\"}}},\"manageApplicationsPage\":{\"title\":\"Manage Applications\",\"description\":\"Review and select the best creators for your campaign:\",\"hiredDescription\":\"You've hired {hired} out of {total} creators for this campaign.\",\"hiredLabel\":\"Hired\",\"goalLabel\":\"Goal\",\"tabs\":{\"new\":\"New\",\"discussion\":\"In Discussion\",\"payment\":\"Awaiting Payment\",\"hired\":\"Hired\"},\"closed\":{\"title\":\"This campaign is no longer accepting applications.\",\"description\":\"Its current status is:\",\"cta\":\"View Campaign\"},\"newApplicantsTitle\":\"New Applicants\",\"noNewApplicants\":{\"title\":\"No New Applications\",\"description\":\"Check the other tabs for applicants who are in discussion or already hired.\"},\"noNegotiatingApplicants\":{\"title\":\"No Applicants in Discussion\",\"description\":\"Shortlist new applicants to start negotiating.\"},\"noHiredCreators\":{\"title\":\"No Creators Hired Yet\",\"description\":\"Accept an applicant's offer to hire them for this campaign.\"},\"creator\":\"Creator\",\"trustScore\":\"Trust Score\",\"coverLetter\":\"Cover Letter\",\"readFullLetter\":\"Read full letter\",\"letterFrom\":\"Cover letter from {name}\",\"close\":\"Close\",\"negotiateButton\":\"Discuss & Negotiate\",\"acceptButton\":\"Accept & Hire\",\"rejectButton\":\"Reject\",\"viewProfileButton\":\"View Profile\",\"noApplications\":{\"title\":\"No Applications Yet\",\"description\":\"Your campaign is live. Check back soon to see who has applied!\",\"cta\":\"Back to Dashboard\"},\"accessDenied\":{\"title\":\"Access Denied\",\"description\":\"You do not have permission to manage this campaign.\"},\"openingChatToast\":\"Opening discussion...\",\"chatOpenedToast\":{\"title\":\"Chat Opened!\",\"description\":\"You can now negotiate the terms with the creator.\"},\"hiringCreatorToast\":\"Hiring creator...\",\"hiredToast\":{\"title\":\"Creator Hired!\",\"description\":\"They have been notified to accept the campaign.\"}},\"promoBanner\":{\"general\":[{\"title\":\"Join the Inner Circle.\",\"subtitle\":\"Unlock Founder Benefits Before They're Gone.\",\"cta\":\"Join Now\"},{\"title\":\"Spaces are limited.\",\"subtitle\":\"Secure your spot as a Founding Member today.\",\"cta\":\"Apply Now\"}],\"creator\":[{\"title\":\"Ready to turn your content into a career?\",\"subtitle\":\"Join as a Founding Creator.\",\"cta\":\"Start Earning\"}],\"brand\":[{\"title\":\"Tired of fake engagement?\",\"subtitle\":\"Connect with Morocco's most authentic creators.\",\"cta\":\"Find Influencers\"}]},\"footer\":{\"copyright\":\"© 2024 VibeMatch. Built in Casablanca for Morocco.\",\"terms\":\"Terms of Service\",\"privacy\":\"Privacy Policy\",\"legal\":\"Legal Notice\"},\"homePage\":{\"trustBar\":{\"title\":\"JOINING A TRUSTED ECOSYSTEM\",\"metric\":\"50+ Creators on Waitlist\"},\"howItWorks\":{\"title\":\"How VibeMatch Works\",\"description\":\"A streamlined process to connect with the perfect creators for your brand.\",\"brands\":{\"steps\":[{\"title\":\"Post Your Campaign\",\"description\":\"Describe your goals and deliverables. It's free to post.\",\"icon\":\"Megaphone\"},{\"title\":\"Hire & Secure Funds\",\"description\":\"Select the best creator and deposit the payment into VibeMatch Escrow.\",\"icon\":\"Lock\"},{\"title\":\"Approve & Release\",\"description\":\"Once you validate the content, we release the payment to the creator.\",\"icon\":\"CheckCircle\"}]},\"creators\":{\"steps\":[{\"title\":\"Apply to Missions\",\"description\":\"Browse campaigns and apply to the ones that match your vibe. It's free.\",\"icon\":\"Rocket\"},{\"title\":\"Accept & Create\",\"description\":\"Once hired, the brand's payment is secured in Escrow. You can start creating with confidence.\",\"icon\":\"Clapperboard\"},{\"title\":\"Get Paid Instantly\",\"description\":\"As soon as the brand approves your work, the funds are released to your account.\",\"icon\":\"Banknote\"}]}},\"escrow\":{\"title\":\"The VibeMatch Escrow:\",\"titleHighlight\":\"Your Security.\",\"description\":\"For brands, it means you only pay for work you approve. For creators, it means your payment is guaranteed the moment you're hired. It's the simplest way to build trust and ensure every collaboration is a success.\"},\"hero\":{\"title1\":\"The Secure Influencer\",\"title2\":\"Marketplace.\",\"subtitle\":\"For Brands: Only pay for work you validate. For Creators: Get paid, guaranteed, within 24 hours. Escrow for everyone.\",\"brandsButton\":\"I'm a Brand\",\"creatorsButton\":\"I'm a Creator\",\"trustText\":\"Trusted by 50+ creators on our waitlist.\"},\"brands\":{\"title1\":\"Stop wasting money\",\"title2\":\"on\",\"title3\":\"fake engagement.\",\"description\":\"We provide vetted creators and guaranteed results. Our revolutionary Trust Engine analyzes over 50 data points to ensure every influencer you partner with has a genuine, engaged audience. No more bots, no more vanity metrics. Just real impact.\",\"joinButton\":\"Start Hiring Safely\",\"joinSubtext\":\"Access our private beta of pre-vetted, high-trust influencers.\"},\"creators\":{\"title1\":\"Stop chasing payments.\",\"title2\":\"We guarantee them.\",\"description\":\"Focus on what you do best: creating amazing content. VibeMatch handles the boring stuff. We guarantee your payments and automate your invoices, so you can build your brand with peace of mind.\",\"applyButton\":\"Secure my first job\",\"applySubtext\":\"Limited spots available for our Founding Creator Program.\"},\"testimonialsTitle1\":\"What\",\"testimonialsTitle2\":\"Moroccan Creators\",\"testimonialsTitle3\":\"are Saying.\",\"testimonials\":[{\"quote\":\"Finding brands that value authentic engagement over just follower counts was a constant struggle. VibeMatch's vetting process is a game-changer. I finally feel seen for the community I've built.\",\"name\":\"Ghita A.\",\"role\":\"Lifestyle Creator\",\"image\":\"testimonial-1\"},{\"quote\":\"Chasing invoices and dealing with late payments was draining my creative energy. With VibeMatch, I know I'll get paid on time, every time. It's incredibly liberating.\",\"name\":\"Ayman F.\",\"role\":\"Tech Reviewer\",\"image\":\"testimonial-2\"},{\"quote\":\"As a creator, it’s hard to find partners who trust your vision. VibeMatch connects me with brands that understand the value of creative freedom and authentic storytelling.\",\"name\":\"Soukaina\",\"role\":\"Fashion Influencer\",\"image\":\"testimonial-3\"}],\"finalCta\":{\"title\":\"Ready to Launch Your First Campaign?\",\"description\":\"Find authentic creators, secure your payments, and get results you can count on. It's free to get started.\",\"button\":\"Start Now\",\"reassurance\":\"No credit card required for signup.\"},\"faq\":{\"title1\":\"Your Questions,\",\"title2\":\"Answered.\",\"description\":\"Find quick answers to common questions about how VibeMatch works for both brands and creators.\",\"brandsTitle\":\"For Brands\",\"creatorsTitle\":\"For Creators\",\"viewAllButton\":\"View All FAQs\"}},\"faqPage\":{\"title\":{\"part1\":\"Frequently Asked\",\"part2\":\"Questions\"},\"description\":\"Have a question? We're here to help. Explore our FAQ to find answers to common questions about VibeMatch.\",\"categories\":\"Categories\",\"forBrands\":\"For Brands\",\"forCreators\":\"For Creators\",\"general\":\"General\",\"stillQuestions\":{\"title\":\"Still have questions?\",\"description\":\"Our team is here to help. Reach out to us and we'll get back to you as soon as possible.\",\"contactButton\":\"Contact Support\"},\"brandsFaq\":[{\"question\":\"What is VibeMatch's Trust Engine?\",\"answer\":\"Our Trust Engine is a proprietary system that analyzes over 50 data points to vet influencers. It checks for fake followers, bot activity, and engagement authenticity to ensure you connect with creators who have a genuine, engaged audience, maximizing your campaign's ROI.\"},{\"question\":\"How do I find influencers for my campaign?\",\"answer\":\"VibeMatch offers advanced search and filtering tools. You can search for influencers based on niche, audience demographics, engagement rates, location, and more. Our platform will recommend the best matches for your brand based on your campaign goals and our Trust Engine data.\"},{\"question\":\"How are payments handled on the platform?\",\"answer\":\"Payments are held securely in escrow by VibeMatch. You fund the campaign upon agreement, and we release the payment to the creator only after you have approved the content and campaign deliverables have been met. This protects both parties and ensures a smooth collaboration.\"}],\"creatorsFaq\":[{\"question\":\"How do I get paid?\",\"answer\":\"We guarantee your payments. Once a campaign is completed and approved, funds are released to your VibeMatch account. You can then withdraw your earnings directly to your bank account. No more chasing invoices!\"},{\"question\":\"What are the requirements to join as a creator?\",\"answer\":\"We look for creators with an authentic connection to their audience, regardless of follower size. We evaluate engagement quality, content creativity, and niche relevance. If you create high-quality content and have a loyal community, we encourage you to apply.\"},{\"question\":\"Is there a fee for creators?\",\"answer\":\"It is free for creators to join VibeMatch and create a profile. We take a small platform fee from your earnings on each completed campaign. This fee helps us cover payment processing, platform maintenance, and provide you with support and resources to grow your career.\"}],\"generalFaq\":[{\"question\":\"What makes VibeMatch different from other platforms?\",\"answer\":\"VibeMatch is built on the pillars of Trust and Efficiency. Our unique Trust Engine ensures authentic collaborations, while our automated payment system protects creators. We are specifically focused on the Moroccan market, understanding its unique dynamics and fostering a community of top-tier local talent and brands.\"},{\"question\":\"What if I have a dispute?\",\"answer\":\"In the rare case of a disagreement between a brand and a creator, VibeMatch provides a dedicated dispute resolution process. Our support team will mediate the situation, review the campaign agreement and communication, and work towards a fair and timely resolution for both parties.\"}]},\"loginPage\":{\"title\":{\"part1\":\"Welcome to\"},\"description\":\"Connect to your dashboard.\",\"form\":{\"email\":{\"label\":\"Email Address\",\"placeholder\":\"your@email.com\"},\"password\":{\"label\":\"Password\",\"forgot\":\"Forgot password?\"},\"submitButton\":\"Login\"},\"signup\":{\"text\":\"Don't have an account yet?\",\"link\":\"Apply here.\"}},\"signupDialog\":{\"title\":\"Join VibeMatch\",\"description\":\"Choose your path and start your journey with us.\",\"brand\":{\"title\":\"I'm a Brand\",\"description\":\"Find the perfect creators.\"},\"creator\":{\"title\":\"I'm a Creator\",\"description\":\"Collaborate with brands.\"}},\"brandJoinPage\":{\"title\":{\"part1\":\"Be the First to Discover\"},\"description\":\"Join our exclusive waitlist for brands and discover a more transparent and efficient way to collaborate with influencers.\",\"form\":{\"name\":{\"label\":\"Name\",\"placeholder\":\"Your name\"},\"email\":{\"label\":\"Email\",\"placeholder\":\"Your email\"},\"company\":{\"label\":\"Company Name\",\"placeholder\":\"Your company name\"},\"ice\":{\"label\":\"ICE\",\"placeholder\":\"Your ICE number\"},\"phone\":{\"label\":\"Phone (Morocco)\",\"placeholder\":\"06 XX XX XX XX\"},\"city\":{\"label\":\"City (Morocco)\",\"placeholder\":\"Your city\"},\"submitButton\":\"Join the waitlist\",\"submittingButton\":\"Submitting...\"}},\"brandJoinSuccessPage\":{\"title\":\"Thanks! You're on the list.\",\"description\":\"We'll contact you for priority access.\",\"backButton\":\"Back to Home\"},\"creatorJoinForm\":{\"steps\":{\"1\":{\"title\":\"Become a Founding Creator\",\"short_title\":\"Info\",\"description\":\"Join an exclusive community and shape the future of creator collaborations.\"},\"2\":{\"title\":\"Link Your Social Profiles\",\"short_title\":\"Profiles\",\"description\":\"Add your Instagram and TikTok handles. We'll do a quick check to verify they're active.\"},\"3\":{\"title\":\"Define Your Vibe\",\"short_title\":\"Niche\",\"description\":\"What are your main areas of expertise? Select the niches that best represent your content.\"},\"4\":{\"title\":\"Professionalism Pledge\",\"short_title\":\"Pledge\",\"description\":\"Our community is built on trust and reliability. Please confirm your commitment.\"},\"5\":{\"title\":\"Application Submitted!\",\"short_title\":\"Done\",\"description\":\"Thank you for applying to be a Founding Creator.\"}},\"stepCounter\":\"Step {current} of {total}\",\"backButton\":\"Back\",\"nextButton\":\"Next Step\",\"nextButtonText\":\"Next:\",\"submitButton\":\"Submit Application\",\"step1\":{\"header\":\"Welcome to the Inner Circle\",\"description\":\"As a Founding Creator, you'll get early access, influence our platform's development, and connect with a curated network of top-tier talent and brands. Let's get started.\",\"nameLabel\":\"Full Name\",\"namePlaceholder\":\"Enter your full name\",\"emailLabel\":\"Email Address\",\"emailPlaceholder\":\"Enter your email address\",\"phoneLabel\":\"Phone Number\",\"phonePlaceholder\":\"Enter your phone number\",\"differentWhatsappLabel\":\"My WhatsApp number is different\",\"whatsappLabel\":\"WhatsApp Number\",\"whatsappPlaceholder\":\"Enter your WhatsApp number\"},\"step2\":{\"header\":\"Showcase Your Influence\",\"instagramLabel\":\"Instagram Handle\",\"tiktokLabel\":\"TikTok Handle\",\"handlePlaceholder\":\"your_handle\",\"whyConnectLink\":\"Why do I need to provide my handles?\",\"whyConnectAnswer\":\"We use your handles for a one-time, automated analysis of your public profile data, like follower count and engagement rate. This helps us calculate your Trust Score and verify your audience's authenticity. We never store your login details or post on your behalf.\"},\"step3\":{\"header\":\"What's Your Niche?\",\"otherNicheLabel\":\"Please specify your niche\",\"otherNichePlaceholder\":\"e.g. Sustainable Living, Pet Content\"},\"step4\":{\"header\":\"Our Pledge for Quality\",\"description\":\"To ensure VibeMatch remains a high-trust platform, we require all creators to commit to professional standards. This helps us maintain a reliable environment for everyone.\",\"pledge\":\"I commit to meeting deadlines and not using fake engagement.\",\"creatorMandate\":\"I accept the Terms of Use and I grant VibeMatch an exclusive mandate to invoice and collect payments on my behalf (Mandat d'Encaissement). I agree that VibeMatch deducts its commission before transferring the net balance.\"},\"finalStep\":{\"title\":\"Thank you for your application.\",\"description\":\"Our team is reviewing your profile and you will receive a response within 48 hours.\",\"backButton\":\"Back to Homepage\"},\"niches\":[{\"id\":\"fashion\",\"label\":\"Fashion & Style\",\"icon\":\"diamond\"},{\"id\":\"beauty\",\"label\":\"Beauty & Skincare\",\"icon\":\"face\"},{\"id\":\"food\",\"label\":\"Food & Cuisine\",\"icon\":\"restaurant\"},{\"id\":\"travel\",\"label\":\"Travel & Adventure\",\"icon\":\"flight_takeoff\"},{\"id\":\"lifestyle\",\"label\":\"Lifestyle\",\"icon\":\"self_improvement\"},{\"id\":\"fitness\",\"label\":\"Sports & Fitness\",\"icon\":\"fitness_center\"},{\"id\":\"comedy\",\"label\":\"Humor & Comedy\",\"icon\":\"mood\"},{\"id\":\"art\",\"label\":\"Art & Music\",\"icon\":\"music_note\"},{\"id\":\"gaming\",\"label\":\"Tech & Gaming\",\"icon\":\"stadia_controller\"},{\"id\":\"family\",\"label\":\"Family & Parenting\",\"icon\":\"family_restroom\"},{\"id\":\"ugc\",\"label\":\"UGC\",\"icon\":\"groups\"},{\"id\":\"other\",\"label\":\"Other\",\"icon\":\"more_horiz\"}]},\"creatorProfile\":{\"nextStepTitle\":\"Next Step:\",\"nextStepLabel\":\"Next\",\"completeProfileButton\":\"Complete Profile\",\"completionTips\":[\"Creators with complete profiles are 3x more likely to be contacted by brands.\",\"A great bio is your chance to tell your story and attract your dream collaborations.\",\"Brands often filter by location to find local creators for events and campaigns.\",\"Your profile picture is the first impression you make. Make it a great one!\",\"Tags help our algorithm match you with the most relevant campaign opportunities.\"],\"steps\":{\"completeProfile\":\"Complete your profile\",\"addPicture\":\"Add a profile picture\",\"addName\":\"Add your display name\",\"addLocation\":\"Add your location\",\"addTag\":\"Choose at least one tag\",\"addBio\":\"Write a bio to tell your story\",\"complete\":\"Profile is complete!\"},\"edit\":{\"title\":\"Editing Profile\",\"cardTitle\":\"Edit Public Profile\",\"cardDescription\":\"This is how brands will see you on VibeMatch.\",\"nameLabel\":\"Display Name\",\"namePlaceholder\":\"Your first name or nickname\",\"locationLabel\":\"Location\",\"locationPlaceholder\":\"e.g., Marrakech, Morocco\",\"tagsLabel\":\"Tags\",\"bioLabel\":\"Bio\",\"bioPlaceholder\":\"Tell brands what makes you unique. What's your story and your content's vibe?\",\"cancelButton\":\"Cancel\",\"saveButton\":\"Save Changes\",\"savingButton\":\"Saving...\"},\"stats\":{\"title\":\"Collaboration Stats\",\"campaignsCompleted\":\"Campaigns Completed\",\"newTalent\":\"New Talent\",\"joined\":\"Joined VibeMatch\"},\"publicProfile\":{\"title\":\"Public Profile\",\"description\":\"This is how brands will see you.\",\"editButton\":\"Edit Profile\",\"bioLabel\":\"Bio\",\"noBio\":\"No bio provided.\"},\"portfolio\":{\"title\":\"My Portfolio\",\"description\":\"Showcase your best work.\",\"empty\":\"Your portfolio is empty.\",\"addButton\":\"Add a Project\"},\"toast\":{\"success\":{\"title\":\"Profile Updated\",\"description\":\"Your information has been successfully saved.\"},\"error\":{\"title\":\"Update Failed\",\"description\":\"Could not update your profile.\"}}},\"contactPage\":{\"title\":{\"part1\":\"Get in\",\"part2\":\"Touch\"},\"description\":\"We're here to help. Whether you have a question about our platform, a partnership inquiry, or need support, our team is ready to assist you.\",\"phone\":{\"title\":\"Talk to Support\",\"description\":\"Our support team is available from 9 AM to 5 PM, Monday to Friday.\",\"button\":\"Call Now\"},\"whatsapp\":{\"title\":\"Chat on WhatsApp\",\"description\":\"Prefer texting? Reach out to us on WhatsApp for quick answers.\",\"button\":\"Start Chat\"},\"email\":{\"title\":\"Send an Email\",\"description\":\"For detailed inquiries or feedback, feel free to send us an email.\",\"button\":\"Send Email\"}},\"currency\":\"MAD\",\"notificationsPage\":{\"title\":\"Notifications\",\"description\":\"Review all your campaign applications, invitations, and updates in one place.\",\"empty\":{\"title\":\"Your inbox is empty\",\"description\":\"When brands respond to your applications or invite you to campaigns, you'll see it here.\",\"description_brand\":\"When creators apply to your campaigns, you'll see the notifications here.\"},\"card\":{\"appliedTo\":\"Applied to\"},\"source\":{\"applied\":\"Applied\"}},\"createCampaignPage\":{\"title\":\"Create a New Campaign\",\"description\":\"This will be visible to creators on the platform.\",\"basics\":{\"title\":\"Campaign Basics\",\"description\":\"Give your campaign a title and a clear brief.\"},\"titleLabel\":\"Campaign Title\",\"titlePlaceholder\":\"e.g., Summer Skincare Launch\",\"briefLabel\":\"Campaign Brief\",\"briefPlaceholder\":\"Describe the campaign goals, target audience, key messages, and overall vibe.\",\"instructions\":{\"label\":\"Instructions & Prohibitions (Do's & Don'ts)\",\"placeholder\":\"e.g., Do not show competitor logos. Film only in daylight. Use a dynamic format...\"},\"deliverables\":{\"title\":\"Deliverables\",\"description\":\"Specify what content you need from each creator.\",\"campaignTypeLabel\":\"What's the main goal of this campaign?\",\"influence\":{\"title\":\"Influence (Sponsored Post)\",\"description\":\"The creator posts on their social media to reach their audience.\"},\"ugc\":{\"title\":\"UGC (Content Only)\",\"description\":\"The creator sends you the video/photo files. They don't post anything.\",\"tooltip\":\"The creator will deliver the raw video file (MP4). You can use it on your own social media and for ads. The creator will not post it.\"},\"selectLabel\":\"What do you need creators to deliver?\",\"platformLabel\":\"Platform\",\"platformPlaceholder\":\"Select platform\",\"typeLabel\":\"Type\",\"typePlaceholder\":\"Select type\",\"quantityLabel\":\"Quantity\",\"noteLabel\":\"Optional Note\",\"notePlaceholder\":\"e.g., must include product link\",\"addButton\":\"Add Deliverable\"},\"logistics\":{\"title\":\"Product Logistics\",\"options\":[{\"value\":\"shipping\",\"title\":\"Shipping\",\"description\":\"I will ship the product to the creator for free.\",\"icon\":\"Package\"},{\"value\":\"digital\",\"title\":\"Digital / Service\",\"description\":\"No physical product is required (app, service, event).\",\"icon\":\"Computer\"}]},\"discovery\":{\"title\":\"Discovery & Budget\",\"description\":\"Set tags to attract the right creators and define your budget.\"},\"tagsLabel\":\"Tags\",\"otherTagLabel\":\"Custom Tag(s)\",\"otherTagPlaceholder\":\"e.g. Sustainable, Vegan. Separate with commas.\",\"budgetLabel\":\"Budget per Creator (in DH)\",\"numCreatorsLabel\":\"Number of Creators\",\"publishButton\":\"Publish Campaign\",\"publishingButton\":\"Publishing Campaign...\",\"success\":{\"title\":\"Campaign Published!\",\"description\":\"Your campaign is now live. Creators on VibeMatch can now see and apply to it.\",\"manageButton\":\"Manage Applications\",\"dashboardButton\":\"Back to Dashboard\"}},\"editCampaignPage\":{\"title\":\"Edit Campaign\",\"description\":\"Update the details of your campaign below.\",\"saveButton\":\"Save Changes\",\"savingButton\":\"Saving...\",\"toast\":{\"successTitle\":\"Campaign Updated!\",\"successDescription\":\"Your changes have been saved.\",\"errorTitle\":\"Update Failed\",\"errorDescription\":\"Could not update the campaign.\"},\"notFound\":{\"title\":\"Campaign Not Found\",\"description\":\"The campaign you're trying to edit doesn't exist.\",\"cta\":\"Return to Dashboard\"},\"accessDenied\":{\"title\":\"Access Denied\",\"description\":\"You don't have permission to edit this campaign.\",\"cta\":\"Return to Dashboard\"}},\"greetings\":{\"morning\":\"Good morning\",\"afternoon\":\"Good afternoon\",\"evening\":\"Good evening\"},\"status\":{\"OPEN_FOR_APPLICATIONS\":\"Open for Applications\",\"PENDING_SELECTION\":\"Pending Selection\",\"PENDING_CREATOR_ACCEPTANCE\":\"Pending Creator Acceptance\",\"OFFER_PENDING\":\"Offer Pending\",\"PENDING_PAYMENT\":\"Pending Payment\",\"IN_PROGRESS\":\"In Progress\",\"DELIVERED\":\"Delivered\",\"COMPLETED\":\"Completed\",\"REJECTED_BY_CREATOR\":\"Rejected by Creator\",\"YOUR_ACCEPTANCE\":\"Awaiting Your Acceptance\",\"AWAITING_YOUR_PAYMENT\":\"Awaiting Your Payment\"},\"discoverCampaigns\":{\"title\":\"Discover Campaigns\",\"description\":\"Browse and apply for exclusive campaigns from top Moroccan brands.\",\"budget\":\"Budget\",\"viewAndApply\":\"View & Apply\",\"applied\":\"Application Sent\",\"full\":\"Campaign Full\",\"applyNow\":\"Apply Now\",\"noCampaigns\":{\"title\":\"No Open Campaigns Right Now\",\"description\":\"Check back soon for new opportunities!\"}},\"campaignTypes\":{\"influence\":{\"badge\":\"INFLUENCE\"},\"ugc\":{\"badge\":\"UGC\"}},\"discoverCreators\":{\"title\":\"Discover Creators\",\"description\":\"Browse and connect with top-tier Moroccan creators for your next campaign.\",\"trustScore\":\"Trust Score\",\"trustScoreTooltip\":\"A measure of reliability, authenticity, and professionalism based on platform activity.\",\"followers\":\"Followers\",\"inviteButton\":\"Invite to Campaign\",\"viewProfileButton\":\"View Profile\",\"noCreators\":{\"title\":\"No Creators Found\",\"description\":\"Check back soon as new creators join the platform!\"}},\"inviteDialog\":{\"title\":\"Invite {name}\",\"description\":\"Select one of your active campaigns and send a personalized message.\",\"campaignLabel\":\"Campaign\",\"campaignPlaceholder\":\"Select a campaign with open slots...\",\"noCampaigns\":\"No active campaigns with open slots.\",\"hiredText\":\"{hired}/{total} hired\",\"messageLabel\":\"Message\",\"messagePlaceholder\":\"Write a brief message to the creator...\",\"sendButton\":\"Send Invitation\",\"defaultMessage\":\"Hi {name}, we think you'd be a great fit for our campaign and would love for you to apply!\",\"validation\":{\"alreadyHired\":\"{name} is already part of this campaign.\",\"alreadyApplied\":\"{name} has already applied to this campaign.\"},\"toast\":{\"error\":{\"cannotSend\":{\"title\":\"Cannot send invitation\"}},\"success\":{\"title\":\"Invitation Sent!\",\"description\":\"{name} has been invited to your campaign.\"}}},\"campaignPage\":{\"postedBy\":\"Posted by\",\"briefTitle\":\"Campaign Brief\",\"deliverablesTitle\":\"Deliverables\",\"conditionsTitle\":\"Conditions & Logistics\",\"logistics\":{\"title\":\"Product Logistics\"},\"instructions\":{\"title\":\"Instructions & Prohibitions\"},\"applyNow\":\"Apply Now\"},\"logistics\":{\"shipping\":\"The brand will ship the product to you for free. You will need to provide your address after being hired.\",\"digital\":\"No physical product is required for this campaign (e.g., app, service, event).\"},\"applyPage\":{\"title\":\"Apply for\",\"backButton\":\"Back to Campaign Details\",\"alreadyApplied\":{\"title\":\"You've Already Applied!\",\"description\":\"The brand has your application. We'll notify you if you're selected.\"},\"form\":{\"tariff\":{\"title\":\"Confirm Your Tariff\",\"description\":\"The brand's proposed budget is {budget} DH. You can adjust this if needed.\",\"warning\":\"Note: Your offer is higher than the brand's budget.\"},\"coverLetter\":{\"label\":\"Why you? (Optional cover letter)\",\"placeholder\":\"Introduce yourself and explain why you'd be perfect for this collaboration...\"},\"submitButton\":\"Send my Application\",\"submittingButton\":\"Submitting...\"}},\"paymentSuccess\":{\"title\":\"Payment Successful!\",\"description\":\"Funds are now secured in Escrow. The creators have been notified to begin their work.\",\"documentsTitle\":\"Accounting Documents\",\"invoiceButton\":\"Download Fee Invoice\",\"receiptButton\":\"Download Mandate Receipt\",\"backButton\":\"Back to Dashboard\"},\"checkout\":{\"title\":\"Secure Funds (Escrow)\",\"summary\":\"Order Summary\",\"proceedButton\":\"Proceed to Checkout\",\"paymentTo\":\"Payment to\",\"subtotal\":\"Sub-total (Paid to creators)\",\"serviceFee\":\"VibeMatch Service Fee (10%)\",\"vat\":\"VAT on Fees (20%)\",\"total\":\"TOTAL TO BE CHARGED\",\"consent\":{\"title\":\"Legal Consent (Required)\",\"brandMandate\":\"I accept the Terms of Service and I authorize VibeMatch to secure these funds in Escrow until validation of the deliverables. I acknowledge that this payment discharges my debt towards the Creator.\"},\"cancel\":\"Cancel\",\"pay\":\"Pay {total} MAD\",\"processing\":\"Processing...\",\"processingDescription\":\"Simulating secure transaction.\",\"toast\":{\"error\":{\"title\":\"Payment Failed\",\"description\":\"An unexpected error occurred.\"}}},\"termsPage\":{\"title\":\"Terms of Service\",\"lastUpdated\":\"Last updated: December 7, 2025\",\"discrepancyNotice\":\"In case of discrepancy, the French version governs.\",\"preamble\":{\"title\":\"Preamble\",\"eligibility\":{\"title\":\"1. ELIGIBILITY (AGE RESTRICTION)\",\"content\":\"The Services are strictly reserved for individuals aged 18 years or older having full legal capacity. Any registration by a minor is strictly prohibited unless accompanied by the written consent of a legal guardian (Wali). VibeMatch reserves the right to request proof of age at any time.\"},\"acceptance\":{\"title\":\"2. ACCEPTANCE (ELECTRONIC CONTRACT)\",\"content\":\"Accessing and using the Platform implies unconditional acceptance of these GTC. In accordance with Law No. 53-05 on the electronic exchange of legal data, checking the \\\"I agree\\\" box during registration or payment constitutes a valid electronic signature, binding the User to these terms with the same legal force as a handwritten signature.\"}},\"brands\":{\"title\":\"Part I: Brand Terms\",\"legalStatus\":{\"title\":\"Legal Status and Mandate\",\"content\":\"The Brand acknowledges VibeMatch acts as a Technical Intermediary and Trusted Third Party. By funding a campaign, the Brand grants VibeMatch a Payment Mandate (D.O.C. Art. 879 et seq.) to:\",\"item1\":\"Secure funds in an escrow account.\",\"item2\":\"Release funds to the Creator only upon deliverable validation.\"},\"obligations\":{\"title\":\"Obligations and Validation\",\"brief_b\":\"The Brief:\",\"brief_t\":\"The Brand must provide a precise brief. VibeMatch is not liable for dissatisfaction from a vague brief.\",\"validation_b\":\"Tacit Validation:\",\"validation_t\":\"The Brand must validate or request revisions of deliverables within five (5) calendar days of receipt. Failure to act implies acceptance, triggering automatic payment.\"},\"payments\":{\"title\":\"Payments and Escrow\",\"liberatory_b\":\"Liberatory Payment:\",\"liberatory_t\":\"Payment to VibeMatch's escrow fully discharges the Brand's debt to the Creator.\",\"chargebacks_b\":\"Chargebacks (Fraud):\",\"chargebacks_t\":\"Initiating a chargeback after validation is considered fraudulent and will incur a 20% penalty plus collection costs.\",\"refunds\":{\"title\":\"Refunds\",\"preWork\":\"Cancellation before work: Refund minus a 15% (tax-exclusive) admin fee.\",\"nonDelivery\":\"Non-delivery: Full refund of the escrowed amount.\"}}},\"creators\":{\"title\":\"Part II: Creator Terms\",\"independence\":{\"title\":\"Independence\",\"content\":\"The Creator acts as an independent professional (self-employed, company). These terms create no employment relationship. The Creator is solely responsible for their tax and social security declarations.\"},\"billingMandate\":{\"title\":\"Billing Mandate\",\"content\":\"To facilitate operations, the Creator grants VibeMatch a Billing Mandate to:\",\"item1\":\"Issue invoices in the name and on behalf of the Creator addressed to the Brand, in accordance with the self-billing rules applicable in Morocco.\",\"item2\":\"Collect funds and deduct a 15% (tax-exclusive) platform commission before transferring the net balance within five (5) business days.\"},\"ip\":{\"title\":\"Intellectual Property (Law 2-00)\",\"assignment_b\":\"Assignment:\",\"assignment_t\":\"Upon payment, the Creator irrevocably assigns economic rights (reproduction, representation) to the Client for online use worldwide.\",\"personality_b\":\"Personality Rights:\",\"personality_t\":\"The Creator authorizes the Client to use their name, image, and voice for the campaign's commercial purposes.\",\"adaptation_b\":\"Adaptation Rights:\",\"adaptation_t\":\"The Creator authorizes technical modifications (cropping, resizing) for social media formats.\",\"warranty_b\":\"Warranty:\",\"warranty_t\":\"The Creator indemnifies VibeMatch and the Brand against any third-party claims (music, trademarks) related to the content.\"},\"confidentiality\":{\"title\":\"Confidentiality\",\"content\":\"The Creator must keep all campaign details confidential. Any premature leak constitutes a material breach subject to damages.\"}},\"common\":{\"title\":\"Part III: Common Provisions\",\"antiCircumvention\":{\"title\":\"Non-Circumvention\",\"content\":\"Users (Brand and Creator) agree not to bypass VibeMatch to contract directly between them for a period of twelve (12) months following their initial connection on the platform.\",\"penalty_b\":\"Penalty Clause (D.O.C. Art. 264):\",\"penalty_t\":\"Violation constitutes a direct commercial loss for VibeMatch. The defaulting party agrees to pay a fixed penalty of 10,000 MAD or 20% of the circumvented budget (whichever is higher) as damages, due upon notice.\"},\"personalData\":{\"title\":\"Personal Data (Law 09-08)\",\"content\":\"VibeMatch processes personal data necessary for contract execution (Identity, Payments, Usage). Users acknowledge having read and accepted our <PrivacyPolicy>Privacy Policy</PrivacyPolicy>, which details the collection, processing, and rights regarding their data (Access, Rectification, Opposition) in accordance with Law 09-08 (CNDP).\"},\"liability\":{\"title\":\"Liability and Force Majeure\",\"content\":\"VibeMatch has an obligation of means. It cannot be held liable for technical interruptions or the commercial failure of a campaign. No party is liable for delays caused by Force Majeure.\"},\"law\":{\"title\":\"Governing Law and Jurisdiction\",\"content\":\"These terms are governed by Moroccan law. In case of a dispute, after an unsuccessful amicable settlement attempt within thirty (30) days, the dispute shall be submitted to the exclusive jurisdiction of the Commercial Court of Casablanca.\"},\"survival\":{\"title\":\"Survival of Terms\",\"content\":\"The provisions regarding Intellectual Property, Confidentiality, and Non-Circumvention shall survive the termination, expiration, or deletion of the User's account for any reason, for the durations prescribed by applicable laws (e.g., 70 years for Copyright, 12 months for Non-Circumvention).\"},\"severability\":{\"title\":\"Severability\",\"content\":\"If any provision of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, such invalidity shall not affect the validity of the remaining provisions, which shall remain in full force and effect.\"},\"modifications\":{\"title\":\"Changes to Terms\",\"content\":\"VibeMatch reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the service after such changes constitutes acceptance of the new Terms.\"}}},\"privacyPage\":{\"title\":\"Privacy Policy\",\"lastUpdated\":\"Last Updated: December 7, 2025\",\"sections\":{\"preamble\":{\"title\":\"1. Preamble & Controller\",\"p1\":\"The protection of your personal data is a priority for VibeMatch. This Privacy Policy outlines how we collect, use, and protect your data in accordance with Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data.\",\"controller\":{\"title\":\"Data Controller (Responsable du Traitement):\",\"identity_b\":\"Identity:\",\"identity_t\":\"[Your Name or Company Name], Holder of ICE No. [Insert ICE].\",\"hq_b\":\"Headquarters:\",\"hq_t\":\"Casablanca, Morocco.\",\"contact_b\":\"Contact:\",\"contact_t\":\"legal@vibematch.ma\"}},\"data\":{\"title\":\"2. Data Collected\",\"p1\":\"We collect two types of data:\",\"direct\":{\"title\":\"2.1. Data You Provide Directly:\",\"identity_b\":\"Identity:\",\"identity_t\":\"Name, Surname, ID/Passport (for KYC verification), Email, Phone number.\",\"professional_b\":\"Professional:\",\"professional_t\":\"Biography, Social Media handles (Instagram, TikTok), Pricing rates.\",\"financial_b\":\"Financial:\",\"financial_t\":\"RIB/IBAN (for Payouts), Billing Address. Note: Credit card numbers are handled directly by our secure payment processor (e.g., Stripe/CMI) and are never stored on VibeMatch servers.\"},\"auto\":{\"title\":\"2.2. Data Collected Automatically (The \\\"Trust Score\\\"):\",\"p1\":\"To power our verification engine, we collect publicly available data from Linked Social Media Accounts:\",\"l1\":\"Follower counts, Engagement rates, Audience demographics.\",\"l2\":\"Important: We do not access private messages (DMs) or passwords.\"},\"technical\":{\"title\":\"2.3. Technical Data:\",\"l1\":\"IP Address, Browser type, Login timestamps (required for the \\\"Electronic Signature\\\" proof under Law 53-05).\"}},\"purpose\":{\"title\":\"3. Purpose of Processing (Finalités)\",\"p1\":\"We process your data for the following specific purposes:\",\"l1_b\":\"Contract Execution:\",\"l1_t\":\"To create accounts, generate invoices, and facilitate the \\\"Mandate\\\" between Brand and Creator.\",\"l2_b\":\"Trust & Safety:\",\"l2_t\":\"To calculate the \\\"Trust Score\\\" and detect fake followers or fraudulent profiles.\",\"l3_b\":\"Financial Compliance:\",\"l3_t\":\"To execute Escrow releases and comply with tax obligations.\",\"l4_b\":\"Legal Defense:\",\"l4_t\":\"To store proof of consent (Logs) in case of dispute.\"},\"sharing\":{\"title\":\"4. Data Sharing & Recipients\",\"p1\":\"VibeMatch does not sell your personal data. Data is shared only with:\",\"l1_b\":\"Counterparties:\",\"l1_t\":\"When a Brand hires a Creator, necessary professional data (Name, Portfolio, Stats) is visible to the Brand.\",\"l2_b\":\"Service Providers:\",\"l2_t\":\"Secure Payment Processors (Banking), Cloud Hosting Providers (Data Storage).\",\"l3_b\":\"Authorities:\",\"l3_t\":\"In response to a valid legal request from Moroccan authorities (Police, Tax Admin, or CNDP).\"},\"transfers\":{\"title\":\"5. International Transfers\",\"p1\":\"Users are informed that data may be hosted on secure servers located outside of Morocco (e.g., AWS, Google Cloud). VibeMatch ensures these providers adhere to strict security standards (GDPR/ISO 27001) ensuring a level of protection equivalent to Moroccan law.\"},\"rights\":{\"title\":\"6. Your Rights (Law 09-08)\",\"p1\":\"In accordance with Articles 7, 8, and 9 of Law 09-08, you have the following rights:\",\"l1_b\":\"Right of Access:\",\"l1_t\":\"You may request a copy of all data we hold about you.\",\"l2_b\":\"Right of Rectification:\",\"l2_t\":\"You may correct inaccurate or incomplete data.\",\"l3_b\":\"Right of Opposition:\",\"l3_t\":\"You may object to the processing of your data for legitimate reasons (unless the data is required for a contracted payment).\",\"p2\":\"How to exercise these rights: Send a request to legal@vibematch.ma. We will respond within the statutory deadline.\"},\"retention\":{\"title\":\"7. Data Retention\",\"l1_b\":\"Active Accounts:\",\"l1_t\":\"Data is kept as long as the account is active.\",\"l2_b\":\"Financial Records:\",\"l2_t\":\"Invoices and Transaction logs are kept for 10 years (Fiscal obligation).\",\"l3_b\":\"Inactive Accounts:\",\"l3_t\":\"User data is archived or anonymized 12 months after account closure, except where law requires longer retention.\"},\"security\":{\"title\":\"8. Security\",\"p1\":\"VibeMatch implements technical and organizational measures (Encryption, Access Control) to protect your data against unauthorized access, loss, or alteration.\"},\"cookies\":{\"title\":\"9. Cookies\",\"p1\":\"Our platform uses \\\"Cookies\\\" to improve user experience (Session management). You can configure your browser to refuse cookies, but some platform features (like Login) may not function correctly.\"}}},\"legalNotice\":{\"title\":\"Legal Notice\",\"navTitle\":\"Summary\",\"sections\":{\"editor\":{\"title\":\"1. Site Editor\",\"companyNameLabel\":\"Company Name / Name:\",\"companyName\":\"[Company Name] SARL\",\"legalStatusLabel\":\"Legal Status:\",\"legalStatus\":\"Société à Responsabilité Limitée\",\"hqLabel\":\"Head Office:\",\"hq\":\"Casablanca, Morocco\",\"emailLabel\":\"Contact Email:\",\"email\":\"legal@vibematch.ma\",\"iceLabel\":\"ICE Number:\",\"ice\":\"[Insert ICE]\",\"tpLabel\":\"RC:\",\"tp\":\"[Insert RC]\"},\"hosting\":{\"title\":\"2. Hosting\",\"hostLabel\":\"Host:\",\"host\":\"Vercel Inc.\",\"addressLabel\":\"Address:\",\"address\":\"San Francisco, USA\"},\"ip\":{\"title\":\"3. Intellectual Property\",\"content\":\"All graphic elements, source codes, logos, and texts of the VibeMatch site are the exclusive property of the editor. Any reproduction without authorization is prohibited.\"}}},\"deliverableTypes\":{\"Post\":\"{count, plural, one {Instagram Post} other {# Instagram Posts}}\",\"Story\":\"{count, plural, one {Instagram Story} other {# Instagram Stories}}\",\"Reel\":\"{count, plural, one {Instagram Reel} other {# Instagram Reels}}\",\"Video\":\"{count, plural, one {TikTok Video} other {# TikTok Videos}}\",\"UGC Video Vertical\":\"{count, plural, one {UGC Video (Vertical)} other {# UGC Videos (Vertical)}}\",\"UGC Video Horizontal\":\"{count, plural, one {UGC Video (Horizontal)} other {# UGC Videos (Horizontal)}}\",\"UGC Photo Pack\":\"{count, plural, one {UGC Photo Pack} other {# UGC Photo Packs}}\"}}"));}),
"[project]/src/locales/fr.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"header\":{\"forBrands\":\"Pour les Marques\",\"forCreators\":\"Pour les Créateurs\",\"faq\":\"FAQ\",\"support\":\"Support\",\"login\":\"Connexion\",\"logout\":\"Déconnexion\",\"dashboard\":\"Accueil\",\"home\":\"Accueil\",\"profile\":\"Mon Profil\",\"discover\":\"Découvrir\",\"messages\":\"Messages\",\"creators\":\"Créateurs\",\"notifications\":\"Notifications\",\"myAccount\":\"Mon Compte\",\"settings\":\"Paramètres\"},\"navigation\":{\"backToDashboard\":\"Retour au Tableau de Bord\",\"backToDiscovery\":\"Retour à la Découverte\",\"backToCampaign\":\"Retour aux Détails\"},\"chat\":{\"title\":\"Contrats\",\"tabs\":{\"negotiations\":\"Négociation\",\"active\":\"Actifs\",\"archived\":\"Archivés\"},\"emptyTab\":\"Aucune conversation dans cette catégorie.\",\"noMessages\":\"Pas encore de messages\",\"loadingMessages\":\"Chargement des messages...\",\"viewProfile\":\"Voir le profil\",\"status\":{\"yourResponse\":\"En attente de votre réponse\",\"waitingForCreator\":\"En attente de la réponse du créateur\",\"brandReviewing\":\"La marque examine votre offre\",\"fund\":\"Accord conclu. Financez pour démarrer.\",\"awaitingFunds\":\"Deal Agreed. Awaiting funds.\",\"offerAccepted\":\"Offre acceptée. En attente de paiement.\",\"fundsSecured\":\"Fonds sécurisés. Travail en cours.\",\"review\":\"Travail soumis pour validation.\",\"completed\":\"Campagne terminée !\",\"cancelled\":\"Négociation annulée.\",\"status\":\"Statut\"},\"budget\":{\"lastOffer\":\"Dernière Offre\",\"agreed\":\"Budget Convenu\",\"theirOffer\":\"Son Offre\"},\"fundEscrow\":\"Financer le Séquestre\",\"initialCard\":{\"titleCreator\":\"Discussion pour\",\"titleBrand\":\"Candidature pour\",\"descriptionCreator\":\"La marque a ouvert une discussion suite à votre candidature.\",\"descriptionBrand\":\"Ouvert le\",\"yourOffer\":\"Votre Offre Initiale\",\"creatorOffer\":\"Offre Initiale du Créateur\",\"coverLetter\":\"Lettre de Motivation Initiale\"},\"offerCard\":{\"yourOffer\":\"Votre Offre\",\"youProposed\":\"Vous avez proposé un budget de\",\"offerReceived\":\"Offre Reçue\",\"theyProposed\":\"{name} a proposé un budget de\"},\"accept\":\"Accepter\",\"reject\":\"Rejeter\",\"accepted\":\"Acceptée\",\"rejected\":\"Rejetée\",\"superseded\":\"Remplacée\",\"eventAccepted\":\"Offre acceptée par {role} à {amount} MAD.\",\"eventFunded\":\"Les fonds ont été sécurisés par la marque.\",\"eventAcceptedAwaitingFunds\":\"Offre acceptée par {role}. En attente du financement par la marque.\",\"waitingResponse\":\"En attente de la réponse de l'autre partie...\",\"acceptRate\":\"Accepter le tarif ({amount} MAD)\",\"or\":\"OU\",\"proposeNew\":\"Proposer un nouveau tarif\",\"decline\":\"Refuser\",\"proposalForm\":{\"title\":\"Nouvelle Proposition\",\"description\":\"Proposez un nouveau budget et ajoutez un message si vous le souhaitez.\",\"amount\":\"Montant (MAD)\",\"message\":\"Message (optionnel)\",\"placeholder\":\"Ex: C'est mon budget maximum...\",\"send\":\"Envoyer l'Offre\"},\"guardianBot\":{\"title\":\"Message Bloqué par Guardian Bot\",\"description\":\"Le partage d'informations de contact est interdit pendant la négociation. Veuillez garder la communication sur VibeMatch pour votre sécurité.\"},\"placeholder\":{\"inactive\":\"Cette conversation n'est pas active pour les messages.\",\"negotiation\":\"Utilisez les actions ci-dessous pour répondre à l'offre.\",\"active\":\"Discutez des détails créatifs...\"},\"notFound\":{\"title\":\"Conversation introuvable\"},\"accessDenied\":{\"title\":\"Accès Refusé\",\"description\":\"Vous n'êtes pas un participant de cette conversation.\"},\"toast\":{\"offerAccepted\":{\"title\":\"Offre Acceptée !\",\"description\":\"La marque peut maintenant financer le projet.\"},\"offerRejected\":\"Offre Rejetée\",\"negotiationCancelled\":\"Négociation Annulée\",\"cancelError\":\"Impossible d'annuler la négociation.\"},\"otherParty\":\"L'autre partie\"},\"brandDashboard\":{\"title\":\"Tableau de Bord Marque\",\"createButton\":\"Nouvelle Campagne\",\"stats\":{\"active\":\"Campagnes Actives\",\"applications\":\"Nouvelles Candidatures\",\"budget\":\"Budget Planifié\",\"escrow\":\"Fonds Séquestrés\",\"escrowSubtitle\":\"Argent réel bloqué pour les projets actifs.\",\"plannedBudgetSubtitle\":\"Somme de vos campagnes actives.\"},\"createdOn\":\"Créée le {date}\",\"editAction\":\"Modifier\",\"deleteAction\":\"Supprimer\",\"deleteDialog\":{\"title\":\"Êtes-vous sûr ?\",\"description\":\"Cette action supprimera définitivement votre campagne et toutes ses données. Cette action est irréversible.\",\"cancel\":\"Annuler\",\"confirm\":\"Oui, Supprimer\"},\"hiringProgress\":\"Progression du recrutement\",\"manageButton\":\"Gérer les candidatures\",\"viewButton\":\"Voir la campagne\",\"fundNowButton\":\"FINANCER MAINTENANT\",\"emptyState\":{\"title\":\"Votre tableau de bord vous attend\",\"description\":\"C'est ici que vous gérerez vos campagnes et vous connecterez avec les créateurs. Commencez par créer votre première campagne.\",\"cta\":\"Créer la première campagne\"},\"deleteToast\":{\"deleting\":\"Suppression de la campagne...\",\"successTitle\":\"Campagne Supprimée\",\"successDescription\":\"Votre campagne a été supprimée avec succès.\",\"errorTitle\":\"Échec de la suppression\"},\"actions\":{\"title\":\"CENTRE D'ACTIONS\",\"payment\":\"PAIEMENT\",\"pay\":\"Payer\",\"fundCreator\":\"Financez l'accord avec {name}\",\"applicants\":\"CANDIDATS\",\"review\":\"Examiner\",\"newApplicants\":\"{count, plural, one {1 nouveau candidat} other {# nouveaux candidats}} à examiner.\",\"message\":\"MESSAGE\",\"newMessage\":\"{name} vous a envoyé un nouveau message.\",\"reply\":\"Répondre\",\"aCreator\":\"un créateur\"},\"filters\":{\"all\":\"Tout\",\"toFund\":\"À Financer\",\"hiring\":\"Recrutement\",\"inProgress\":\"En Cours\",\"archived\":\"Archivées\"},\"emptyFilter\":{\"title\":\"Aucune Campagne Ici\",\"description\":\"Il n'y a aucune campagne correspondant à votre filtre actuel.\"}},\"creatorDashboard\":{\"discoverButton\":\"Découvrir des Campagnes\",\"stats\":{\"escrow\":\"Fonds sous Séquestre\",\"escrowSubtitle\":\"Argent sécurisé pour les projets actifs.\",\"matching\":\"Opportunités Compatibles\",\"matchingSubtitle\":\"{value} campagnes recherchent un profil comme le vôtre.\",\"views\":\"Vues du Profil (7j)\",\"viewsSubtitle\":\"{value} marques ont vu votre profil aujourd'hui.\"},\"tabs\":{\"active\":\"Actives\",\"payment\":\"En Attente de Paiement\",\"discussion\":\"En Discussion\",\"pending\":\"En Attente\"},\"actions\":{\"review\":\"Examiner & Accepter\",\"view\":\"Voir les Détails\",\"chat\":\"Ouvrir le Chat\",\"withdraw\":\"Retirer la Candidature\"},\"deleteDialog\":{\"title\":\"Êtes-vous sûr ?\",\"description\":\"Cela retirera votre candidature pour \\\"{campaignTitle}\\\". La marque ne pourra plus la voir. Vous pourrez postuler à nouveau plus tard si la campagne est toujours ouverte.\",\"confirm\":\"Oui, Retirer\"},\"emptyStates\":{\"active\":{\"title\":\"Aucune campagne active pour le moment\",\"description\":\"Les campagnes pour lesquelles vous êtes accepté apparaîtront ici. Il est temps de trouver votre prochaine collaboration !\"},\"payment\":{\"title\":\"Aucun paiement en attente\",\"description\":\"Lorsqu'une marque finance une campagne que vous avez acceptée, elle passera dans votre onglet 'Actives'.\"},\"discussion\":{\"title\":\"Aucune négociation en cours\",\"description\":\"Lorsqu'une marque est intéressée par votre candidature, vous pouvez négocier les termes ici.\"},\"pending\":{\"title\":\"Vous n'avez postulé à aucune campagne\",\"description\":\"Parcourez les campagnes ouvertes des meilleures marques et postulez pour commencer à collaborer.\"}}},\"manageApplicationsPage\":{\"title\":\"Gérer les Candidatures\",\"description\":\"Examinez et sélectionnez les meilleurs créateurs pour votre campagne :\",\"hiredDescription\":\"Vous avez recruté {hired} sur {total} créateurs pour cette campagne.\",\"hiredLabel\":\"Recrutés\",\"goalLabel\":\"Objectif\",\"tabs\":{\"new\":\"Nouveaux\",\"discussion\":\"En Discussion\",\"payment\":\"En Attente de Paiement\",\"hired\":\"Recrutés\"},\"closed\":{\"title\":\"Cette campagne n'accepte plus de candidatures.\",\"description\":\"Son statut actuel est :\",\"cta\":\"Voir la Campagne\"},\"newApplicantsTitle\":\"Nouveaux Candidats\",\"noNewApplicants\":{\"title\":\"Aucune Nouvelle Candidature\",\"description\":\"Consultez les autres onglets pour les candidats en discussion ou déjà recrutés.\"},\"noNegotiatingApplicants\":{\"title\":\"Aucun Candidat en Discussion\",\"description\":\"Présélectionnez de nouveaux candidats pour commencer à négocier.\"},\"noHiredCreators\":{\"title\":\"Aucun Créateur Recruté pour l'Instant\",\"description\":\"Acceptez l'offre d'un candidat pour le recruter pour cette campagne.\"},\"creator\":\"Créateur\",\"trustScore\":\"Score de Confiance\",\"coverLetter\":\"Lettre de Motivation\",\"readFullLetter\":\"Lire la lettre complète\",\"letterFrom\":\"Lettre de motivation de {name}\",\"close\":\"Fermer\",\"negotiateButton\":\"Discuter & Négocier\",\"acceptButton\":\"Accepter & Recruter\",\"rejectButton\":\"Rejeter\",\"viewProfileButton\":\"Voir le Profil\",\"noApplications\":{\"title\":\"Aucune Candidature pour l'Instant\",\"description\":\"Votre campagne est en ligne. Revenez bientôt pour voir qui a postulé !\",\"cta\":\"Retour au Tableau de Bord\"},\"accessDenied\":{\"title\":\"Accès Refusé\",\"description\":\"Vous n'avez pas la permission de gérer cette campagne.\"},\"openingChatToast\":\"Ouverture de la discussion...\",\"chatOpenedToast\":{\"title\":\"Discussion ouverte !\",\"description\":\"Vous pouvez maintenant négocier les termes avec le créateur.\"},\"hiringCreatorToast\":\"Recrutement du créateur...\",\"hiredToast\":{\"title\":\"Créateur Recruté !\",\"description\":\"Une notification lui a été envoyée pour accepter la campagne.\"}},\"promoBanner\":{\"general\":[{\"title\":\"Rejoignez le Cercle des Fondateurs.\",\"subtitle\":\"Débloquez des Avantages Exclusifs Avant qu'il ne Soit Trop Tard.\",\"cta\":\"Rejoindre\"},{\"title\":\"Les places sont limitées.\",\"subtitle\":\"Réservez votre statut de Membre Fondateur dès aujourd'hui.\",\"cta\":\"Postuler maintenant\"}],\"creator\":[{\"title\":\"Prêt à transformer votre contenu en carrière ?\",\"subtitle\":\"Devenez un Créateur Fondateur.\",\"cta\":\"Commencer à gagner\"}],\"brand\":[{\"title\":\"Fatigué du faux engagement ?\",\"subtitle\":\"Collaborez avec les créateurs les plus authentiques du Maroc.\",\"cta\":\"Trouver des influenceurs\"}]},\"footer\":{\"copyright\":\"© 2024 VibeMatch. Conçu à Casablanca pour le Maroc.\",\"terms\":\"Conditions d'utilisation\",\"privacy\":\"Politique de confidentialité\",\"legal\":\"Mentions Légales\"},\"homePage\":{\"trustBar\":{\"title\":\"ILS FONT CONFIANCE À NOTRE ÉCOSYSTÈME\",\"metric\":\"50+ Créateurs en liste d'attente\"},\"howItWorks\":{\"title\":\"Comment VibeMatch Fonctionne\",\"description\":\"Un processus simple pour vous connecter avec les créateurs parfaits pour votre marque.\",\"brands\":{\"steps\":[{\"title\":\"Postez Votre Campagne\",\"description\":\"Décrivez vos objectifs et livrables. C'est gratuit.\",\"icon\":\"Megaphone\"},{\"title\":\"Engagez & Sécurisez\",\"description\":\"Sélectionnez le meilleur créateur et déposez le paiement sur le séquestre VibeMatch.\",\"icon\":\"Lock\"},{\"title\":\"Validez & Payez\",\"description\":\"Une fois le contenu validé, nous libérons le paiement au créateur.\",\"icon\":\"CheckCircle\"}]},\"creators\":{\"steps\":[{\"title\":\"Postulez aux Missions\",\"description\":\"Parcourez les campagnes et postulez à celles qui correspondent à votre style. C'est gratuit.\",\"icon\":\"Rocket\"},{\"title\":\"Acceptez & Créez\",\"description\":\"Une fois engagé, le paiement de la marque est sécurisé. Vous pouvez créer en toute confiance.\",\"icon\":\"Clapperboard\"},{\"title\":\"Soyez Payé Instantanément\",\"description\":\"Dès que la marque approuve votre travail, les fonds sont virés sur votre compte.\",\"icon\":\"Banknote\"}]}},\"escrow\":{\"title\":\"Le Séquestre VibeMatch :\",\"titleHighlight\":\"Votre Garantie.\",\"description\":\"Pour les marques, c'est l'assurance de ne payer que pour un travail approuvé. Pour les créateurs, c'est la garantie d'être payé dès l'embauche. C'est le moyen le plus simple de bâtir la confiance et de garantir le succès de chaque collaboration.\"},\"hero\":{\"title1\":\"La Marketplace d'Influence\",\"title2\":\"Sécurisée.\",\"subtitle\":\"Marques : Payez seulement quand le travail est validé. Créateurs : Soyez payés garanti sous 24h. Le Séquestre (Escrow) pour tous.\",\"brandsButton\":\"Je suis une Marque\",\"creatorsButton\":\"Je suis un Créateur\",\"trustText\":\"Rejoint par 50+ créateurs sur notre liste d'attente.\"},\"brands\":{\"title1\":\"Ne gaspillez plus d'argent en\",\"title2\":\"faux engagement.\",\"title3\":\"faux engagement.\",\"description\":\"Nous fournissons des créateurs certifiés et des résultats garantis. Notre Trust Engine révolutionnaire analyse plus de 50 points de données pour s'assurer que chaque influenceur avec qui vous vous associez a une audience authentique et engagée. Fini les bots, fini les métriques de vanité. Juste un impact réel.\",\"joinButton\":\"Start Hiring safely\",\"joinSubtext\":\"Accédez à notre bêta privée de créateurs pré-vérifiés à haute confiance.\"},\"creators\":{\"title1\":\"Arrêtez de courir après les paiements.\",\"title2\":\"Nous les garantissons.\",\"description\":\"Concentrez-vous sur ce que vous faites de mieux : créer du contenu exceptionnel. VibeMatch s'occupe du reste. Nous garantissons vos paiements et automatisons votre facturation, pour que vous puissiez construire votre marque en toute tranquillité.\",\"applyButton\":\"Secure my first job\",\"applySubtext\":\"Places limitées pour notre Programme Créateurs Fondateurs.\"},\"testimonialsTitle1\":\"Ce qu'en disent\",\"testimonialsTitle2\":\"les Créateurs Marocains\",\"testimonialsTitle3\":\".\",\"testimonials\":[{\"quote\":\"Trouver des marques qui valorisent l'engagement authentique était un combat permanent. Le processus de VibeMatch change la donne. Je me sens enfin valorisée pour la communauté que j'ai bâtie.\",\"name\":\"Ghita A.\",\"role\":\"Créatrice Lifestyle\",\"image\":\"testimonial-1\"},{\"quote\":\"Courir après les factures drainait mon énergie créative. Avec VibeMatch, je sais que je serai payé à temps, à chaque fois. C'est incroyablement libérateur.\",\"name\":\"Ayman F.\",\"role\":\"Chroniqueur Tech\",\"image\":\"testimonial-2\"},{\"quote\":\"En tant que créatrice, il est difficile de trouver des partenaires qui font confiance à votre vision. VibeMatch me connecte à des marques qui comprennent la valeur de la liberté créative et du storytelling authentique.\",\"name\":\"Soukaina\",\"role\":\"Influenceuse Mode\",\"image\":\"testimonial-3\"}],\"finalCta\":{\"title\":\"Prêt à lancer votre première campagne ?\",\"description\":\"Trouvez des créateurs authentiques, sécurisez vos paiements et obtenez des résultats fiables. L'inscription est gratuite.\",\"button\":\"Commencer maintenant\",\"reassurance\":\"Aucune carte de crédit requise pour l'inscription.\"},\"faq\":{\"title1\":\"Vos Questions,\",\"title2\":\"Nos Réponses.\",\"description\":\"Trouvez ici les réponses aux questions les plus fréquentes sur VibeMatch, que vous soyez une marque ou un créateur.\",\"brandsTitle\":\"Pour les Marques\",\"creatorsTitle\":\"Pour les Créateurs\",\"viewAllButton\":\"Voir toute la FAQ\"}},\"faqPage\":{\"title\":{\"part1\":\"Foire Aux\",\"part2\":\"Questions\"},\"description\":\"Une question ? Nous sommes là pour vous aider. Explorez notre FAQ pour trouver des réponses claires et concises.\",\"categories\":\"Catégories\",\"forBrands\":\"Pour les Marques\",\"forCreators\":\"Pour les Créateurs\",\"general\":\"Général\",\"stillQuestions\":{\"title\":\"D'autres questions ?\",\"description\":\"Notre équipe est à votre disposition. Contactez-nous et nous vous répondrons dans les plus brefs délais.\",\"contactButton\":\"Contacter le Support\"},\"brandsFaq\":[{\"question\":\"Qu'est-ce que le Trust Engine de VibeMatch ?\",\"answer\":\"Notre Trust Engine est un système propriétaire qui analyse plus de 50 points de données pour certifier les influenceurs. Il détecte les faux abonnés, l'activité des bots et l'authenticité de l'engagement pour vous garantir des collaborations avec des créateurs à l'audience réelle, maximisant ainsi le ROI de vos campagnes.\"},{\"question\":\"Comment trouver les influenceurs pour ma campagne ?\",\"answer\":\"VibeMatch offre des outils de recherche et de filtrage avancés. Vous pouvez rechercher par niche, démographie de l'audience, taux d'engagement, localisation, etc. Notre plateforme recommande les meilleurs profils pour votre marque en se basant sur vos objectifs et les données de notre Trust Engine.\"},{\"question\":\"Comment sont gérés les paiements ?\",\"answer\":\"Les paiements sont sécurisés via un compte séquestre. Vous financez la campagne lors de l'accord, et nous ne libérons les fonds au créateur qu'après votre approbation du contenu. Ce système protège les deux parties et assure une collaboration sereine.\"}],\"creatorsFaq\":[{\"question\":\"Comment suis-je rémunéré ?\",\"answer\":\"Nous garantissons vos paiements. Une fois une campagne terminée et approuvée, les fonds sont libérés sur votre compte VibeMatch. Vous pouvez ensuite retirer vos gains directement sur votre compte bancaire. Fini la course aux factures !\"},{\"question\":\"Quelles sont les conditions pour devenir créateur ?\",\"answer\":\"Nous recherchons des créateurs ayant une connexion authentique avec leur public, quelle que soit la taille de leur communauté. Nous évaluons la qualité de l'engagement, la créativité du contenu et la pertinence de la niche. Si vous créez du contenu de haute qualité et avez une communauté fidèle, nous vous encourageons à postuler.\"},{\"question\":\"Y a-t-il des frais pour les créateurs ?\",\"answer\":\"L'inscription est gratuite. Nous prélevons une faible commission sur vos gains. Cela nous permet de couvrir les frais, la maintenance et de vous offrir un support dédié.\"}],\"generalFaq\":[{\"question\":\"Qu'est-ce qui différencie VibeMatch ?\",\"answer\":\"VibeMatch repose sur la Confiance et l'Efficacité. Notre Trust Engine garantit des collaborations authentiques, et notre système de paiement automatisé protège les créateurs. Nous sommes spécialisés sur le marché marocain.\"},{\"question\":\"Que se passe-t-il en cas de litige ?\",\"answer\":\"VibeMatch propose une médiation. Notre équipe intervient, examine l'accord et la communication, et œuvre pour une résolution juste et rapide.\"}]},\"loginPage\":{\"title\":{\"part1\":\"Bienvenue sur\"},\"description\":\"Connectez-vous à votre espace.\",\"form\":{\"email\":{\"label\":\"Adresse e-mail\",\"placeholder\":\"votre@email.com\"},\"password\":{\"label\":\"Mot de passe\",\"forgot\":\"Mot de passe oublié ?\"},\"submitButton\":\"Se connecter\"},\"signup\":{\"text\":\"Pas encore de compte ?\",\"link\":\"Rejoignez-nous.\"}},\"signupDialog\":{\"title\":\"Rejoignez l'aventure VibeMatch\",\"description\":\"Choisissez votre profil et lancez-vous.\",\"brand\":{\"title\":\"Je suis une Marque\",\"description\":\"Trouvez les talents parfaits.\"},\"creator\":{\"title\":\"Je suis un Créateur\",\"description\":\"Collaborez avec des marques.\"}},\"brandJoinPage\":{\"title\":{\"part1\":\"Accédez en avant-première à\"},\"description\":\"Rejoignez notre liste d'attente exclusive et découvrez une nouvelle ère de collaboration avec les influenceurs, basée sur la transparence et l'efficacité.\",\"form\":{\"name\":{\"label\":\"Nom complet\",\"placeholder\":\"Votre nom complet\"},\"email\":{\"label\":\"Email\",\"placeholder\":\"Votre email professionnel\"},\"company\":{\"label\":\"Nom de l'entreprise\",\"placeholder\":\"Nom de votre entreprise\"},\"ice\":{\"label\":\"ICE\",\"placeholder\":\"Votre numéro ICE\"},\"phone\":{\"label\":\"Téléphone (Maroc)\",\"placeholder\":\"06 XX XX XX XX\"},\"city\":{\"label\":\"Ville (Maroc)\",\"placeholder\":\"Votre ville\"},\"submitButton\":\"Rejoindre la liste d'attente\",\"submittingButton\":\"Envoi en cours...\"}},\"brandJoinSuccessPage\":{\"title\":\"Merci ! Votre place est réservée.\",\"description\":\"Nous vous contacterons pour vous donner un accès prioritaire.\",\"backButton\":\"Retour à l'accueil\"},\"creatorJoinForm\":{\"steps\":{\"1\":{\"title\":\"Devenez Créateur Fondateur\",\"short_title\":\"Infos\",\"description\":\"Rejoignez une communauté d'élite et redéfinissez les collaborations créatives.\"},\"2\":{\"title\":\"Liez vos Profils Sociaux\",\"short_title\":\"Profils\",\"description\":\"Indiquez vos noms d'utilisateur Instagram et TikTok. Nous vérifierons rapidement leur validité.\"},\"3\":{\"title\":\"Définissez votre Univers\",\"short_title\":\"Niche\",\"description\":\"Quels sont vos domaines de prédilection ? Choisissez les niches qui vous représentent.\"},\"4\":{\"title\":\"Engagement de Confiance\",\"short_title\":\"Charte\",\"description\":\"Notre communauté repose sur la fiabilité. Confirmez votre adhésion à nos standards de qualité.\"},\"5\":{\"title\":\"Candidature Envoyée !\",\"short_title\":\"Fait\",\"description\":\"Merci d'avoir postulé pour devenir un Créateur Fondateur.\"}},\"stepCounter\":\"Étape {current} sur {total}\",\"backButton\":\"Retour\",\"nextButton\":\"Étape suivante\",\"nextButtonText\":\"Suivant:\",\"submitButton\":\"Envoyer ma candidature\",\"step1\":{\"header\":\"Bienvenue dans le Cercle des Pionniers\",\"description\":\"En tant que Créateur Fondateur, accédez en avant-première à VibeMatch, influencez son évolution et rejoignez un réseau exclusif de marques et talents. Commençons.\",\"nameLabel\":\"Nom complet\",\"namePlaceholder\":\"Entrez votre nom complet\",\"emailLabel\":\"Adresse e-mail\",\"emailPlaceholder\":\"Entrez votre adresse e-mail\",\"phoneLabel\":\"Numéro de téléphone\",\"phonePlaceholder\":\"Entrez votre numéro\",\"differentWhatsappLabel\":\"Mon numéro WhatsApp est différent\",\"whatsappLabel\":\"Numéro WhatsApp\",\"whatsappPlaceholder\":\"Entrez votre numéro WhatsApp\"},\"step2\":{\"header\":\"Affichez votre Influence\",\"instagramLabel\":\"Nom d'utilisateur Instagram\",\"tiktokLabel\":\"Nom d'utilisateur TikTok\",\"handlePlaceholder\":\"votre_nom_utilisateur\",\"whyConnectLink\":\"Pourquoi fournir mes noms d'utilisateur ?\",\"whyConnectAnswer\":\"Nous utilisons vos identifiants pour une analyse automatisée et unique de vos données de profil public. Cela nous aide à calculer votre Score de Confiance et à vérifier l'authenticité de votre audience. Nous ne stockons jamais vos identifiants.\"},\"step3\":{\"header\":\"Quelle est votre Niche ?\",\"otherNicheLabel\":\"Veuillez préciser votre niche\",\"otherNichePlaceholder\":\"ex: Vie durable, Contenu animalier\"},\"step4\":{\"header\":\"Notre Engagement Qualité\",\"description\":\"Pour que VibeMatch reste une plateforme de confiance, nous demandons à tous les créateurs de s'engager à un haut niveau de professionnalisme. C'est notre garantie collective.\",\"pledge\":\"Je m'engage à respecter les délais et à ne jamais utiliser de faux engagement.\",\"creatorMandate\":\"J'accepte les Conditions d'Utilisation et je confère à VibeMatch un mandat exclusif pour facturer et encaisser les paiements en mon nom (Mandat d'Encaissement). J'accepte que VibeMatch déduise sa commission avant de me transférer le solde net.\"},\"finalStep\":{\"title\":\"Merci pour votre candidature.\",\"description\":\"Notre équipe étudie votre profil. Vous recevrez une réponse sous 48 heures.\",\"backButton\":\"Retour à la page d'accueil\"},\"niches\":[{\"id\":\"fashion\",\"label\":\"Mode & Style\",\"icon\":\"diamond\"},{\"id\":\"beauty\",\"label\":\"Beauté & Soins\",\"icon\":\"face\"},{\"id\":\"food\",\"label\":\"Food & Cuisine\",\"icon\":\"restaurant\"},{\"id\":\"travel\",\"label\":\"Voyage & Découverte\",\"icon\":\"flight_takeoff\"},{\"id\":\"lifestyle\",\"label\":\"Lifestyle & Quotidien\",\"icon\":\"self_improvement\"},{\"id\":\"fitness\",\"label\":\"Sport & Fitness\",\"icon\":\"fitness_center\"},{\"id\":\"comedy\",\"label\":\"Humour & Comédie\",\"icon\":\"mood\"},{\"id\":\"art\",\"label\":\"Art & Musique\",\"icon\":\"music_note\"},{\"id\":\"gaming\",\"label\":\"Tech & Gaming\",\"icon\":\"stadia_controller\"},{\"id\":\"family\",\"label\":\"Famille & Parentalité\",\"icon\":\"family_restroom\"},{\"id\":\"ugc\",\"label\":\"UGC\",\"icon\":\"groups\"},{\"id\":\"other\",\"label\":\"Autre\",\"icon\":\"more_horiz\"}]},\"creatorProfile\":{\"nextStepTitle\":\"Prochaine Étape :\",\"nextStepLabel\":\"Suivant\",\"completeProfileButton\":\"Compléter le Profil\",\"completionTips\":[\"Les créateurs avec des profils complets sont 3x plus susceptibles d'être contactés par les marques.\",\"Une super bio est votre chance de raconter votre histoire et d'attirer des collaborations de rêve.\",\"Les marques filtrent souvent par lieu pour trouver des créateurs locaux pour des événements et des campagnes.\",\"Votre photo de profil est la première impression que vous faites. Assurez-vous qu'elle soit excellente !\",\"Les tags aident notre algorithme à vous proposer les opportunités les plus pertinentes.\"],\"steps\":{\"completeProfile\":\"Complétez votre profil\",\"addPicture\":\"Ajoutez une photo de profil\",\"addName\":\"Ajoutez votre nom d'affichage\",\"addLocation\":\"Ajoutez votre localisation\",\"addTag\":\"Choisissez au moins un tag\",\"addBio\":\"Écrivez une biographie pour raconter votre histoire\",\"complete\":\"Le profil est complet !\"},\"edit\":{\"title\":\"Modification du Profil\",\"cardTitle\":\"Modifier le Profil Public\",\"cardDescription\":\"C'est ainsi que les marques vous verront sur VibeMatch.\",\"nameLabel\":\"Nom d'Affichage\",\"namePlaceholder\":\"Votre prénom ou surnom\",\"locationLabel\":\"Localisation\",\"locationPlaceholder\":\"ex: Marrakech, Maroc\",\"tagsLabel\":\"Tags\",\"bioLabel\":\"Bio\",\"bioPlaceholder\":\"Dites aux marques ce qui vous rend unique. Quelle est votre histoire et l'ambiance de votre contenu ?\",\"cancelButton\":\"Annuler\",\"saveButton\":\"Enregistrer\",\"savingButton\":\"Enregistrement...\"},\"stats\":{\"title\":\"Statistiques de Collaboration\",\"campaignsCompleted\":\"Campagnes Terminées\",\"newTalent\":\"Nouveau Talent\",\"joined\":\"A rejoint VibeMatch\"},\"publicProfile\":{\"title\":\"Profil Public\",\"description\":\"C'est ainsi que les marques vous verront.\",\"editButton\":\"Modifier le Profil\",\"bioLabel\":\"Bio\",\"noBio\":\"Aucune biographie fournie.\"},\"portfolio\":{\"title\":\"Mon Portfolio\",\"description\":\"Mettez en avant vos meilleurs travaux.\",\"empty\":\"Votre portfolio est vide.\",\"addButton\":\"Ajouter un Projet\"},\"toast\":{\"success\":{\"title\":\"Profil Mis à Jour\",\"description\":\"Vos informations ont été enregistrées avec succès.\"},\"error\":{\"title\":\"Échec de la Mise à Jour\",\"description\":\"Impossible de mettre à jour votre profil.\"}}},\"contactPage\":{\"title\":{\"part1\":\"Contactez-\",\"part2\":\"nous\"},\"description\":\"Nous sommes là pour vous aider. Que vous ayez une question, une proposition de partenariat ou besoin d'aide, notre équipe est à votre écoute.\",\"phone\":{\"title\":\"Support Téléphonique\",\"description\":\"Notre équipe est disponible du lundi au vendredi, de 9h à 17h.\",\"button\":\"Appeler Maintenant\"},\"whatsapp\":{\"title\":\"Discuter sur WhatsApp\",\"description\":\"Vous préférez les messages ? Contactez-nous sur WhatsApp pour une réponse rapide.\",\"button\":\"Démarrer la Discussion\"},\"email\":{\"title\":\"Envoyer un E-mail\",\"description\":\"Pour toute demande détaillée ou pour nous faire part de vos suggestions.\"}},\"currency\":\"MAD\",\"notificationsPage\":{\"title\":\"Notifications\",\"description\":\"Consultez toutes vos candidatures, invitations et mises à jour de campagnes en un seul endroit.\",\"empty\":{\"title\":\"Votre boîte de réception est vide\",\"description\":\"Lorsque les marques répondront à vos candidatures ou vous inviteront à des campagnes, vous le verrez ici.\",\"description_brand\":\"Lorsque les créateurs postulent à vos campagnes, vous verrez les notifications ici.\"},\"card\":{\"appliedTo\":\"A postulé à\"},\"source\":{\"applied\":\"Candidature\"}},\"createCampaignPage\":{\"title\":\"Créer une Nouvelle Campagne\",\"description\":\"Ceci sera visible par les créateurs sur la plateforme.\",\"basics\":{\"title\":\"Bases de la Campagne\",\"description\":\"Donnez un titre et un brief clair à votre campagne.\"},\"titleLabel\":\"Titre de la Campagne\",\"titlePlaceholder\":\"Ex: Lancement Soins d'Été\",\"briefLabel\":\"Brief de la Campagne\",\"briefPlaceholder\":\"Décrivez les objectifs, le public cible, les messages clés et l'ambiance générale.\",\"instructions\":{\"label\":\"Instructions & Interdictions (À faire & à ne pas faire)\",\"placeholder\":\"Ex: Ne pas montrer de logos concurrents. Filmer uniquement à la lumière du jour. Format dynamique...\"},\"deliverables\":{\"title\":\"Livrables\",\"description\":\"Spécifiez le contenu que vous attendez de chaque créateur.\",\"campaignTypeLabel\":\"Quel est l'objectif principal de cette campagne ?\",\"influence\":{\"title\":\"Influence (Publication Sponsorisée)\",\"description\":\"Le créateur publie sur ses réseaux sociaux pour atteindre son audience.\"},\"ugc\":{\"title\":\"UGC (Contenu Uniquement)\",\"description\":\"Le créateur vous envoie les fichiers vidéo/photo. Il ne poste rien.\",\"tooltip\":\"Le créateur livrera le fichier vidéo brut (MP4). Vous pourrez l'utiliser sur vos propres réseaux sociaux et publicités. Le créateur ne le publiera pas.\"},\"selectLabel\":\"Que doivent livrer les créateurs ?\",\"platformLabel\":\"Plateforme\",\"platformPlaceholder\":\"Sélectionner la plateforme\",\"typeLabel\":\"Type\",\"typePlaceholder\":\"Sélectionner le type\",\"quantityLabel\":\"Quantité\",\"noteLabel\":\"Note (Optionnel)\",\"notePlaceholder\":\"Ex: doit inclure le lien du produit\",\"addButton\":\"Ajouter un Livrable\"},\"logistics\":{\"title\":\"Logistique du Produit\",\"options\":[{\"value\":\"shipping\",\"title\":\"Expédition\",\"description\":\"J'enverrai le produit gratuitement au créateur.\",\"icon\":\"Package\"},{\"value\":\"digital\",\"title\":\"Digital / Service\",\"description\":\"Aucun produit physique requis (app, service, lieu).\",\"icon\":\"Computer\"}]},\"discovery\":{\"title\":\"Découverte & Budget\",\"description\":\"Définissez des tags pour attirer les bons créateurs et fixez votre budget.\"},\"tagsLabel\":\"Tags\",\"otherTagLabel\":\"Tag(s) Personnalisé(s)\",\"otherTagPlaceholder\":\"Ex: Durable, Vegan. Séparez par des virgules.\",\"budgetLabel\":\"Budget par Créateur (en DH)\",\"numCreatorsLabel\":\"Nombre de Créateurs\",\"publishButton\":\"Publier la Campagne\",\"publishingButton\":\"Publication en cours...\",\"success\":{\"title\":\"Campagne Publiée !\",\"description\":\"Votre campagne est maintenant en ligne. Les créateurs sur VibeMatch peuvent la voir et postuler.\",\"manageButton\":\"Gérer les candidatures\",\"dashboardButton\":\"Retour au tableau de bord\"}},\"editCampaignPage\":{\"title\":\"Modifier la Campagne\",\"description\":\"Mettez à jour les détails de votre campagne ci-dessous.\",\"saveButton\":\"Enregistrer les modifications\",\"savingButton\":\"Enregistrement...\",\"toast\":{\"successTitle\":\"Campagne Mise à Jour !\",\"successDescription\":\"Vos modifications ont été enregistrées.\",\"errorTitle\":\"Échec de la Mise à Jour\",\"errorDescription\":\"Impossible de mettre à jour la campagne.\"},\"notFound\":{\"title\":\"Campagne Introuvable\",\"description\":\"La campagne que vous essayez de modifier n'existe pas.\",\"cta\":\"Retour au Tableau de Bord\"},\"accessDenied\":{\"title\":\"Accès Refusé\",\"description\":\"Vous n'avez pas la permission de modifier cette campagne.\",\"cta\":\"Retour au Tableau de Bord\"}},\"greetings\":{\"morning\":\"Bonjour\",\"afternoon\":\"Bonjour\",\"evening\":\"Bonsoir\"},\"status\":{\"OPEN_FOR_APPLICATIONS\":\"Ouverte aux candidatures\",\"PENDING_SELECTION\":\"En attente de sélection\",\"PENDING_CREATOR_ACCEPTANCE\":\"En attente d'acceptation\",\"OFFER_PENDING\":\"Offre en attente\",\"PENDING_PAYMENT\":\"En attente de paiement\",\"IN_PROGRESS\":\"En cours\",\"DELIVERED\":\"Livrée\",\"COMPLETED\":\"Terminée\",\"REJECTED_BY_CREATOR\":\"Refusée par le créateur\",\"YOUR_ACCEPTANCE\":\"En attente de votre acceptation\",\"AWAITING_YOUR_PAYMENT\":\"En attente de votre paiement\"},\"discoverCampaigns\":{\"title\":\"Découvrir les Campagnes\",\"description\":\"Parcourez et postulez à des campagnes exclusives des meilleures marques marocaines.\",\"budget\":\"Budget\",\"viewAndApply\":\"Voir & Postuler\",\"applied\":\"Candidature Envoyée\",\"full\":\"Campagne Complète\",\"applyNow\":\"Postuler\",\"noCampaigns\":{\"title\":\"Aucune Campagne Ouverte pour le Moment\",\"description\":\"Revenez bientôt pour de nouvelles opportunités !\"}},\"campaignTypes\":{\"influence\":{\"badge\":\"INFLUENCE\"},\"ugc\":{\"badge\":\"UGC\"}},\"discoverCreators\":{\"title\":\"Découvrir les Créateurs\",\"description\":\"Parcourez et connectez-vous avec les meilleurs créateurs marocains pour votre prochaine campagne.\",\"trustScore\":\"Score de Confiance\",\"trustScoreTooltip\":\"Une mesure de la fiabilité, de l'authenticité et du professionnalisme basée sur l'activité sur la plateforme.\",\"followers\":\"Abonnés\",\"inviteButton\":\"Inviter à une Campagne\",\"viewProfileButton\":\"Voir le Profil\",\"noCreators\":{\"title\":\"Aucun Créateur Trouvé\",\"description\":\"Revenez bientôt, de nouveaux créateurs rejoignent la plateforme !\"}},\"inviteDialog\":{\"title\":\"Inviter {name}\",\"description\":\"Sélectionnez une de vos campagnes actives et envoyez un message personnalisé.\",\"campaignLabel\":\"Campagne\",\"campaignPlaceholder\":\"Sélectionnez une campagne avec des places libres...\",\"noCampaigns\":\"Aucune campagne active avec des places libres.\",\"hiredText\":\"{hired}/{total} recrutés\",\"messageLabel\":\"Message\",\"messagePlaceholder\":\"Rédigez un message bref au créateur...\",\"sendButton\":\"Envoyer l'Invitation\",\"defaultMessage\":\"Bonjour {name}, nous pensons que votre profil serait parfait pour notre campagne et nous aimerions vous inviter à postuler !\",\"validation\":{\"alreadyHired\":\"{name} fait déjà partie de cette campagne.\",\"alreadyApplied\":\"{name} a déjà postulé à cette campagne.\"},\"toast\":{\"error\":{\"cannotSend\":{\"title\":\"Impossible d'envoyer l'invitation\"}},\"success\":{\"title\":\"Invitation Envoyée !\",\"description\":\"{name} a été invité(e) à votre campagne.\"}}},\"campaignPage\":{\"postedBy\":\"Publié par\",\"briefTitle\":\"Brief de la Campagne\",\"deliverablesTitle\":\"Livrables\",\"conditionsTitle\":\"Conditions & Logistique\",\"logistics\":{\"title\":\"Logistique du Produit\"},\"instructions\":{\"title\":\"Instructions & Interdictions\"},\"applyNow\":\"Postuler\"},\"logistics\":{\"shipping\":\"La marque vous enverra le produit gratuitement. Vous devrez fournir votre adresse après avoir été recruté.\",\"digital\":\"Aucun produit physique n'est requis pour cette campagne (ex: application, service, événement).\"},\"applyPage\":{\"title\":\"Postuler pour\",\"backButton\":\"Retour aux détails\",\"alreadyApplied\":{\"title\":\"Vous avez déjà postulé !\",\"description\":\"La marque a bien reçu votre candidature. Nous vous informerons si vous êtes sélectionné.\"},\"form\":{\"tariff\":{\"title\":\"Confirmez Votre Tarif\",\"description\":\"Le budget proposé par la marque est de {budget} DH. Vous pouvez ajuster ce montant si nécessaire.\",\"warning\":\"Note : Votre offre est supérieure au budget de la marque.\"},\"coverLetter\":{\"label\":\"Pourquoi vous ? (Lettre de motivation optionnelle)\",\"placeholder\":\"Présentez-vous et expliquez pourquoi vous seriez parfait pour cette collaboration...\"},\"submitButton\":\"Envoyer ma candidature\",\"submittingButton\":\"Envoi en cours...\"}},\"paymentSuccess\":{\"title\":\"Paiement Réussi !\",\"description\":\"Les fonds sont maintenant sécurisés en Escrow. Les créateurs ont été notifiés pour commencer leur travail.\",\"documentsTitle\":\"Documents Comptables\",\"invoiceButton\":\"Télécharger la Facture de Frais\",\"receiptButton\":\"Télécharger le Reçu de Mandat\",\"backButton\":\"Retour au Tableau de Bord\"},\"checkout\":{\"title\":\"Sécuriser les Fonds (Escrow)\",\"summary\":\"Résumé de la Commande\",\"proceedButton\":\"Procéder au Checkout\",\"paymentTo\":\"Paiement à\",\"subtotal\":\"Sous-total (Reversé aux créateurs)\",\"serviceFee\":\"Frais de Service VibeMatch (10%)\",\"vat\":\"TVA sur Frais (20%)\",\"total\":\"TOTAL À DÉBITER\",\"consent\":{\"title\":\"Consentement Légal (Requis)\",\"brandMandate\":\"J'accepte les Conditions d'Utilisation et je donne mandat à VibeMatch pour séquestrer ces fonds jusqu'à validation des livrables. Je reconnais que ce paiement est libératoire de ma dette envers le Créateur.\"},\"cancel\":\"Annuler\",\"pay\":\"Payer {total} MAD\",\"processing\":\"Traitement...\",\"processingDescription\":\"Simulation d'une transaction sécurisée.\",\"toast\":{\"error\":{\"title\":\"Échec du Paiement\",\"description\":\"Une erreur inattendue est survenue.\"}}},\"termsPage\":{\"title\":\"Conditions Générales d'Utilisation\",\"lastUpdated\":\"Dernière mise à jour : 07 Décembre 2025\",\"discrepancyNotice\":\"En cas de divergence, la version française fait foi.\",\"preamble\":{\"title\":\"Préambule\",\"eligibility\":{\"title\":\"1. ÉLIGIBILITÉ (RESTRICTION D'ÂGE)\",\"content\":\"Les Services sont strictly reserved for individuals aged 18 years or older having full legal capacity. Any registration by a minor is strictly prohibited unless accompanied by the written consent of a legal guardian (Wali). VibeMatch se réserve le droit de demander une preuve d'âge à tout moment.\"},\"acceptance\":{\"title\":\"2. ACCEPTATION (CONTRAT ÉLECTRONIQUE)\",\"content\":\"L'accès et l'utilisation de la Plateforme impliquent l'acceptation sans réserve des présentes CGU. Conformément à la Loi n° 53-05 relative à l'échange électronique de données juridiques, le fait de cocher la case \\\"J'accepte\\\" lors de l'inscription ou du paiement constitue une signature électronique valide, liant l'Utilisateur à ces conditions avec la même force probante qu'une signature manuscrite.\"}},\"brands\":{\"title\":\"Partie I : Conditions pour les Marques\",\"legalStatus\":{\"title\":\"Statut Juridique et Mandat\",\"content\":\"La Marque reconnaît que VibeMatch agit exclusivement en tant qu'Intermédiaire Technique et Tiers de Confiance. En finançant une campagne, la Marque accorde à VibeMatch un Mandat de Paiement (D.O.C. Art. 879 et seq.) pour :\",\"item1\":\"Sécuriser les fonds sur un compte dédié (Compte de Cantonnement / Séquestre).\",\"item2\":\"Libérer les fonds au profit du Créateur uniquement après validation des livrables.\"},\"obligations\":{\"title\":\"Obligations et Validation\",\"brief_b\":\"Le Brief :\",\"brief_t\":\"La Marque s'engage à fournir un cahier des charges précis. VibeMatch ne saurait être tenu responsable d'une insatisfaction résultant d'un brief vague ou incomplet.\",\"validation_b\":\"Validation Tacite :\",\"validation_t\":\"La Marque doit valider ou demander des révisions des livrables dans un délai de cinq (5) jours calendaires suivant leur réception. En l'absence d'action dans ce délai, les livrables sont réputés acceptés (\\\"Réception Tacite\\\"), déclenchant le paiement automatique au Créateur.\"},\"payments\":{\"title\":\"Paiements et Séquestre\",\"liberatory_b\":\"Paiement Libératoire :\",\"liberatory_t\":\"Le paiement au compte séquestre de VibeMatch vaut décharge de la dette de la Marque envers le Créateur.\",\"chargebacks_b\":\"Chargebacks (Fraude) :\",\"chargebacks_t\":\"Initier un rejet de débit après validation est considéré comme frauduleux et entraînera une pénalité de 20% plus les frais de recouvrement.\",\"refunds\":{\"title\":\"Remboursements\",\"preWork\":\"Annulation avant travaux : Remboursement du séquestre moins 15% de Frais Administratifs (Hors Taxe).\",\"nonDelivery\":\"Non-Livraison : Remboursement intégral du séquestre.\"}}},\"creators\":{\"title\":\"Partie II : Conditions pour les Créateurs\",\"independence\":{\"title\":\"Indépendance\",\"content\":\"Le Créateur agit en tant que professionnel indépendant (Auto-Entrepreneur, Société). Ces termes ne créent aucun lien de subordination. Le Créateur est seul responsable de ses déclarations fiscales et sociales.\"},\"billingMandate\":{\"title\":\"Mandat de Facturation\",\"content\":\"Pour faciliter les opérations, le Créateur confère à VibeMatch un Mandat de Facturation afin de :\",\"item1\":\"Émettre des factures au nom et pour le compte du Créateur adressées à la Marque, conformément aux règles d'auto-facturation applicables au Maroc.\",\"item2\":\"Encaisser les fonds et déduire une commission de 15% (Hors Taxe) avant de transférer le solde net sous cinq (5) jours ouvrables.\"},\"ip\":{\"title\":\"Propriété Intellectuelle (Loi 2-00)\",\"assignment_b\":\"Cession :\",\"assignment_t\":\"Dès paiement, le Créateur cède irrévocablement les droits patrimoniaux (reproduction, représentation) au Client pour une utilisation en ligne mondiale.\",\"personality_b\":\"Droits de la Personnalité :\",\"personality_t\":\"Le Créateur autorise le Client à utiliser son nom, image et voix pour les besoins commerciaux de la campagne.\",\"adaptation_b\":\"Droits d'Adaptation :\",\"adaptation_t\":\"Le Créateur autorise les modifications techniques (recadrage, redimensionnement) pour les formats des réseaux sociaux.\",\"warranty_b\":\"Garantie :\",\"warranty_t\":\"Le Créateur garantit VibeMatch et la Marque contre toute réclamation de tiers (musique, marques) liée au contenu.\"},\"confidentiality\":{\"title\":\"Confidentialité\",\"content\":\"Le Créateur doit garder tous les détails de la Campagne confidentiels. Toute fuite prématurée constitue une Faute Grave passible de dommages-intérêts.\"}},\"common\":{\"title\":\"Partie III : Dispositions Communes\",\"antiCircumvention\":{\"title\":\"Non-Contournement\",\"content\":\"Les Utilisateurs (Marque et Créateur) s'interdisent de contourner VibeMatch pour contracter directement entre eux pour une durée de douze (12) mois suivant leur mise en relation initiale sur la Plateforme.\",\"penalty_b\":\"Clause Pénale (Article 264 D.O.C) :\",\"penalty_t\":\"Toute violation constitue une perte commerciale directe pour VibeMatch. La partie contrevenante s'engage à payer une indemnité forfaitaire de 10.000 DHS ou 20% du budget détourné (le montant le plus élevé étant retenu) à titre de dommages-intérêts, immédiatement exigibles sur notification.\"},\"personalData\":{\"title\":\"Données Personnelles (Loi 09-08)\",\"content\":\"VibeMatch traite les données personnelles nécessaires à l'exécution du contrat. Les Utilisateurs reconnaissent avoir lu et accepté notre <PrivacyPolicy>Politique de Confidentialité</PrivacyPolicy>, qui détaille la collecte, le traitement et les droits concernant leurs données (Accès, Rectification, Opposition) conformément à la Loi 09-08 (CNDP).\"},\"liability\":{\"title\":\"Responsabilité et Force Majeure\",\"content\":\"VibeMatch est tenu à une Obligation de Moyens. Sa responsabilité ne saurait être engagée pour des interruptions techniques ou l'échec commercial d'une campagne. Aucune partie n'est responsable des retards causés par la Force Majeure.\"},\"law\":{\"title\":\"Droit Applicable et Juridiction\",\"content\":\"Ces CGU sont régies par le Droit Marocain. En cas de litige, après une tentative de règlement amiable, la compétence exclusive est attribuée au Tribunal de Commerce de Casablanca.\"},\"survival\":{\"title\":\"Survivance des Clauses\",\"content\":\"Les dispositions relatives à la Propriété Intellectuelle, la Confidentialité et le Non-Contournement survivront à la résiliation, à l'expiration ou à la suppression du compte de l'Utilisateur pour quelque raison que ce soit, pour les durées prescrites par les lois applicables (par ex., 70 ans pour le droit d'auteur, 12 mois pour le non-contournement).\"},\"severability\":{\"title\":\"Divisibilité\",\"content\":\"Si une disposition de ces Conditions est jugée invalide ou inapplicable par un tribunal compétent, cette invalidité n'affectera pas la validité des autres dispositions qui resteront en vigueur.\"},\"modifications\":{\"title\":\"Modifications des Conditions\",\"content\":\"VibeMatch se réserve le droit de modifier ces termes à tout moment. Les utilisateurs seront informés des changements importants par e-mail ou notification sur la plateforme. L'utilisation continue du service après de tels changements constitue une acceptation des nouvelles Conditions.\"}}},\"privacyPage\":{\"title\":\"Politique de Confidentialité\",\"lastUpdated\":\"Dernière mise à jour : 07 Décembre 2025\",\"sections\":{\"preamble\":{\"title\":\"1. PRÉAMBULE & RESPONSABLE DU TRAITEMENT\",\"p1\":\"La protection de vos données personnelles est une priorité pour VibeMatch. Cette Politique de Confidentialité détaille comment nous collectons, utilisons et protégeons vos données conformément à la Loi n° 09-08.\",\"controller\":{\"title\":\"Responsable du Traitement :\",\"identity_b\":\"Identité :\",\"identity_t\":\"[Raison Sociale] SARL, Titulaire de l'ICE N° [Insérer ICE], RC N° [Insérer RC].\",\"hq_b\":\"Siège social :\",\"hq_t\":\"Casablanca, Maroc.\",\"contact_b\":\"Contact :\",\"contact_t\":\"legal@vibematch.ma\"}},\"data\":{\"title\":\"2. DONNÉES COLLECTÉES\",\"p1\":\"Nous collectons deux types de données :\",\"direct\":{\"title\":\"2.1. Données que vous fournissez directement :\",\"identity_b\":\"Identité :\",\"identity_t\":\"Nom, Prénom, CNI/Passeport (pour vérification KYC), Email, Téléphone.\",\"professional_b\":\"Professionnelles :\",\"professional_t\":\"Biographie, Noms d'utilisateur réseaux sociaux (Instagram, TikTok), Tarifs.\",\"financial_b\":\"Financières :\",\"financial_t\":\"RIB/IBAN (pour les virements), Adresse de facturation. Note : les numéros de carte de crédit sont gérés directement par notre processeur de paiement sécurisé (ex: Stripe/CMI) et ne sont jamais stockés sur les serveurs de VibeMatch.\"},\"auto\":{\"title\":\"2.2. Données collectées automatiquement (Le \\\"Trust Score\\\") :\",\"p1\":\"Pour alimenter notre moteur de vérification, nous collectons des données publiquement disponibles depuis les comptes de réseaux sociaux liés :\",\"l1\":\"Nombre d'abonnés, Taux d'engagement, Données démographiques de l'audience.\",\"l2\":\"Important : Nous n'accédons pas aux messages privés (DM) ni aux mots de passe.\"},\"technical\":{\"title\":\"2.3. Données Techniques :\",\"l1\":\"Adresse IP, type de navigateur, horodatages de connexion (requis pour la preuve de \\\"Signature Électronique\\\" selon la Loi 53-05).\"}},\"purpose\":{\"title\":\"3. FINALITÉS DU TRAITEMENT\",\"p1\":\"Nous traitons vos données pour les finalités spécifiques suivantes :\",\"l1_b\":\"Exécution du Contrat :\",\"l1_t\":\"Pour créer des comptes, générer des factures et faciliter le \\\"Mandat\\\" entre la Marque et le Créateur.\",\"l2_b\":\"Confiance & Sécurité :\",\"l2_t\":\"Pour calculer le \\\"Trust Score\\\" et détecter les faux abonnés ou les profils frauduleux.\",\"l3_b\":\"Conformité Financière :\",\"l3_t\":\"Pour exécuter les libérations de fonds du séquestre et se conformer aux obligations fiscales.\",\"l4_b\":\"Défense Légale :\",\"l4_t\":\"Pour stocker la preuve du consentement (Logs) en cas de litige.\"},\"sharing\":{\"title\":\"4. PARTAGE DES DONNÉES & DESTINATAIRES\",\"p1\":\"VibeMatch ne vend pas vos données personnelles. Les données sont partagées uniquement avec :\",\"l1_b\":\"Contreparties :\",\"l1_t\":\"Lorsqu'une Marque engage un Créateur, les données professionnelles nécessaires (Nom, Portfolio, Stats) sont visibles pour la Marque.\",\"l2_b\":\"Prestataires de Services :\",\"l2_t\":\"Processeurs de paiement sécurisés (Banques), Fournisseurs d'hébergement cloud (Stockage de données).\",\"l3_b\":\"Autorités :\",\"l3_t\":\"En réponse à une demande légale valide des autorités marocaines (Police, Administration Fiscale, ou CNDP).\"},\"transfers\":{\"title\":\"5. TRANSFERTS INTERNATIONAUX\",\"p1\":\"Les utilisateurs sont informés que les données peuvent être hébergées sur des serveurs sécurisés situés hors du Maroc (ex: AWS, Google Cloud). VibeMatch s'assure que ces prestataires adhèrent à des normes de sécurité strictes (GDPR/ISO 27001) garantissant un niveau de protection équivalent à la loi marocaine.\"},\"rights\":{\"title\":\"6. VOS DROITS (LOI 09-08)\",\"p1\":\"Conformément aux Articles 7, 8 et 9 de la Loi 09-08, vous disposez des droits suivants :\",\"l1_b\":\"Droit d'Accès :\",\"l1_t\":\"Vous pouvez demander une copie de toutes les données que nous détenons à votre sujet.\",\"l2_b\":\"Droit de Rectification :\",\"l2_t\":\"Vous pouvez corriger des données inexactes ou incomplètes.\",\"l3_b\":\"Droit d'Opposition :\",\"l3_t\":\"Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes (sauf si les données sont requises pour un paiement contractuel).\",\"p2\":\"Comment exercer ces droits : Envoyez une demande à legal@vibematch.ma. Nous répondrons dans le délai légal.\"},\"retention\":{\"title\":\"7. CONSERVATION DES DONNÉES\",\"l1_b\":\"Comptes Actifs :\",\"l1_t\":\"Les données sont conservées tant que le compte est actif.\",\"l2_b\":\"Registres Financiers :\",\"l2_t\":\"Les factures et les journaux de transactions sont conservés pendant 10 ans (obligation fiscale).\",\"l3_b\":\"Comptes Inactifs :\",\"l3_t\":\"Les données utilisateur sont archivées ou anonymisées 12 mois après la fermeture du compte, sauf lorsque la loi exige une conservation plus longue.\"},\"security\":{\"title\":\"8. SÉCURITÉ\",\"p1\":\"VibeMatch met en œuvre des mesures techniques et organisationnelles (Chiffrement, Contrôle d'accès) pour protéger vos données contre tout accès non autorisé, perte ou altération.\"},\"cookies\":{\"title\":\"9. COOKIES\",\"p1\":\"Notre plateforme utilise des \\\"Cookies\\\" pour améliorer l'expérience utilisateur (Gestion de session). Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités de la plateforme (comme la Connexion) pourraient ne pas fonctionner correctement.\"}}},\"legalNotice\":{\"title\":\"Mentions Légales\",\"navTitle\":\"Sommaire\",\"sections\":{\"editor\":{\"title\":\"1. Éditeur du Site\",\"companyNameLabel\":\"Raison Sociale / Nom :\",\"companyName\":\"[Raison Sociale] SARL\",\"legalStatusLabel\":\"Statut Juridique :\",\"legalStatus\":\"Société à Responsabilité Limitée\",\"hqLabel\":\"Siège Social :\",\"hq\":\"Casablanca, Maroc\",\"emailLabel\":\"Email de contact :\",\"email\":\"legal@vibematch.ma\",\"iceLabel\":\"Numéro ICE :\",\"ice\":\"[Insérer ICE]\",\"tpLabel\":\"RC :\",\"tp\":\"[Insérer RC]\"},\"hosting\":{\"title\":\"2. Hébergement\",\"hostLabel\":\"Hébergeur :\",\"host\":\"Vercel Inc.\",\"addressLabel\":\"Adresse :\",\"address\":\"San Francisco, USA\"},\"ip\":{\"title\":\"3. Propriété Intellectuelle\",\"content\":\"L'ensemble des éléments graphiques, codes sources, logos et textes du site VibeMatch sont la propriété exclusive de l'éditeur. Toute reproduction sans autorisation est interdite.\"}}},\"deliverableTypes\":{\"Post\":\"{count, plural, one {Post Instagram} other {# Posts Instagram}}\",\"Story\":\"{count, plural, one {Story Instagram} other {# Stories Instagram}}\",\"Reel\":\"{count, plural, one {Reel Instagram} other {# Reels Instagram}}\",\"Video\":\"{count, plural, one {Vidéo TikTok} other {# Vidéos TikTok}}\",\"UGC Video Vertical\":\"{count, plural, one {Vidéo UGC (Verticale)} other {# Vidéos UGC (Verticales)}}\",\"UGC Video Horizontal\":\"{count, plural, one {Vidéo UGC (Horizontale)} other {# Vidéos UGC (Horizontales)}}\",\"UGC Photo Pack\":\"{count, plural, one {Pack Photos UGC} other {# Packs Photos UGC}}\"}}"));}),
"[project]/src/locales/ar.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"header\":{\"forBrands\":\"للعلامات التجارية\",\"forCreators\":\"لصناع المحتوى\",\"faq\":\"الأسئلة الشائعة\",\"support\":\"الدعم\",\"login\":\"تسجيل الدخول\",\"logout\":\"تسجيل الخروج\",\"dashboard\":\"الرئيسية\",\"home\":\"الرئيسية\",\"profile\":\"ملفي الشخصي\",\"discover\":\"اكتشف\",\"messages\":\"الرسائل\",\"creators\":\"صناع المحتوى\",\"notifications\":\"الإشعارات\",\"myAccount\":\"حسابي\",\"settings\":\"الإعدادات\"},\"navigation\":{\"backToDashboard\":\"العودة إلى لوحة التحكم\",\"backToDiscovery\":\"العودة إلى الاكتشاف\",\"backToCampaign\":\"العودة إلى تفاصيل الحملة\"},\"chat\":{\"title\":\"العقود\",\"tabs\":{\"negotiations\":\"قيد التفاوض\",\"active\":\"نشطة\",\"archived\":\"مؤرشفة\"},\"emptyTab\":\"لا توجد محادثات في هذه الفئة.\",\"noMessages\":\"لا توجد رسائل بعد\",\"loadingMessages\":\"جارٍ تحميل الرسائل...\",\"viewProfile\":\"Voir le profil\",\"status\":{\"yourResponse\":\"En attente de votre réponse\",\"waitingForCreator\":\"En attente de la réponse du créateur\",\"brandReviewing\":\"La marque examine votre offre\",\"fund\":\"تم الاتفاق. قم بالتمويل للبدء.\",\"awaitingFunds\":\"Deal Agreed. Awaiting funds.\",\"offerAccepted\":\"تم قبول العرض. في انتظار الدفع.\",\"fundsSecured\":\"الأموال مؤمنة. العمل قيد التنفيذ.\",\"review\":\"تم تقديم العمل للتحقق.\",\"completed\":\"الحملة مكتملة!\",\"cancelled\":\"تم إلغاء التفاوض.\",\"status\":\"الحالة\"},\"budget\":{\"lastOffer\":\"Dernière Offre\",\"agreed\":\"Budget Convenu\",\"theirOffer\":\"Son Offre\"},\"fundEscrow\":\"Financer le Séquestre\",\"initialCard\":{\"titleCreator\":\"Discussion pour\",\"titleBrand\":\"Candidature pour\",\"descriptionCreator\":\"La marque a ouvert une discussion suite à votre candidature.\",\"descriptionBrand\":\"Ouvert le\",\"yourOffer\":\"Votre Offre Initiale\",\"creatorOffer\":\"Offre Initiale du Créateur\",\"coverLetter\":\"Lettre de Motivation Initiale\"},\"offerCard\":{\"yourOffer\":\"Votre Offre\",\"youProposed\":\"Vous avez proposé un budget de\",\"offerReceived\":\"Offre Reçue\",\"theyProposed\":\"{name} a proposé un budget de\"},\"accept\":\"Accepter\",\"reject\":\"Rejeter\",\"accepted\":\"Acceptée\",\"rejected\":\"Rejetée\",\"superseded\":\"Remplacée\",\"eventAccepted\":\"Offre acceptée par {role} à {amount} MAD.\",\"eventFunded\":\"Les fonds ont été sécurisés par la marque.\",\"eventAcceptedAwaitingFunds\":\"تم قبول العرض من قبل {role}. في انتظار التمويل من العلامة التجارية.\",\"waitingResponse\":\"En attente de la réponse de l'autre partie...\",\"acceptRate\":\"Accepter le tarif ({amount} MAD)\",\"or\":\"OU\",\"proposeNew\":\"Proposer un nouveau tarif\",\"decline\":\"Refuser\",\"proposalForm\":{\"title\":\"Nouvelle Proposition\",\"description\":\"Proposez un nouveau budget et ajoutez un message si vous le souhaitez.\",\"amount\":\"Montant (MAD)\",\"message\":\"Message (optionnel)\",\"placeholder\":\"Ex: C'est mon budget maximum...\",\"send\":\"Envoyer l'Offre\"},\"guardianBot\":{\"title\":\"Message Bloqué par Guardian Bot\",\"description\":\"Le partage d'informations de contact est interdit pendant la négociation. Veuillez garder la communication sur VibeMatch pour votre sécurité.\"},\"placeholder\":{\"inactive\":\"Cette conversation n'est pas active pour les messages.\",\"negotiation\":\"Utilisez les actions ci-dessous pour répondre à l'offre.\",\"active\":\"Discutez des détails créatifs...\"},\"notFound\":{\"title\":\"Conversation introuvable\"},\"accessDenied\":{\"title\":\"Accès Refusé\",\"description\":\"Vous n'êtes pas un participant de cette conversation.\"},\"toast\":{\"offerAccepted\":{\"title\":\"Offre Acceptée !\",\"description\":\"La marque peut maintenant financer le projet.\"},\"offerRejected\":\"Offre Rejetée\",\"negotiationCancelled\":\"Négociation Annulée\",\"cancelError\":\"Impossible d'annuler la négociation.\"},\"otherParty\":\"L'autre partie\"},\"brandDashboard\":{\"title\":\"لوحة تحكم العلامة التجارية\",\"createButton\":\"حملة جديدة\",\"stats\":{\"active\":\"الحملات النشطة\",\"applications\":\"طلبات جديدة\",\"budget\":\"الميزانية المخطط لها\",\"escrow\":\"الأموال المؤمنة\",\"escrowSubtitle\":\"الأموال الحقيقية المقفلة للمشاريع النشطة.\",\"plannedBudgetSubtitle\":\"مجموع ميزانيات حملاتك النشطة.\"},\"createdOn\":\"تم الإنشاء في {date}\",\"editAction\":\"تعديل\",\"deleteAction\":\"حذف\",\"deleteDialog\":{\"title\":\"هل أنت متأكد؟\",\"description\":\"سيؤدي هذا إلى حذف حملتك وجميع بياناتها بشكل دائم. لا يمكن التراجع عن هذا الإجراء.\",\"cancel\":\"إلغاء\",\"confirm\":\"نعم، احذف\"},\"hiringProgress\":\"تقدم التوظيف\",\"manageButton\":\"إدارة الطلبات\",\"viewButton\":\"عرض الحملة\",\"fundNowButton\":\"مول الآن\",\"emptyState\":{\"title\":\"لوحة التحكم الخاصة بك في انتظارك\",\"description\":\"هذا هو المكان الذي ستدير فيه حملاتك وتتواصل مع المبدعين. ابدأ بإنشاء حملتك الأولى.\",\"cta\":\"إنشاء الحملة الأولى\"},\"deleteToast\":{\"deleting\":\"جارٍ حذف الحملة...\",\"successTitle\":\"تم حذف الحملة\",\"successDescription\":\"تمت إزالة حملتك بنجاح.\",\"errorTitle\":\"فشل الحذف\"},\"actions\":{\"title\":\"مركز الإجراءات\",\"payment\":\"دفع\",\"pay\":\"ادفع\",\"fundCreator\":\"مول الصفقة مع {name}\",\"applicants\":\"مرشحون\",\"review\":\"مراجعة\",\"newApplicants\":\"{count, plural, one {مرشح جديد واحد للمراجعة} other {# مرشحين جدد للمراجعة}}.\",\"message\":\"رسالة\",\"newMessage\":\"{name} أرسل لك رسالة جديدة.\",\"reply\":\"رد\",\"aCreator\":\"مبدع\"},\"filters\":{\"all\":\"الكل\",\"toFund\":\"للتمويل\",\"hiring\":\"توظيف\",\"inProgress\":\"قيد التنفيذ\",\"archived\":\"مؤرشفة\"},\"emptyFilter\":{\"title\":\"لا توجد حملات هنا\",\"description\":\"لا توجد حملات تطابق الفلتر الحالي الخاص بك.\"}},\"creatorDashboard\":{\"discoverButton\":\"اكتشف الحملات\",\"stats\":{\"escrow\":\"الأموال في الضمان\",\"escrowSubtitle\":\"الأموال مؤمنة للمشاريع النشطة.\",\"matching\":\"الفرص المطابقة\",\"matchingSubtitle\":\"{value} حملة تبحث عن ملف شخصي مثلك.\",\"views\":\"مشاهدات الملف الشخصي (7 أيام)\",\"viewsSubtitle\":\"{value} علامة تجارية شاهدت ملفك الشخصي اليوم.\"},\"tabs\":{\"active\":\"نشطة\",\"payment\":\"في انتظار الدفع\",\"discussion\":\"قيد المناقشة\",\"pending\":\"في الانتظار\"},\"actions\":{\"review\":\"مراجعة وقبول\",\"view\":\"عرض التفاصيل\",\"chat\":\"فتح المحادثة\",\"withdraw\":\"سحب الطلب\"},\"deleteDialog\":{\"title\":\"هل أنت متأكد؟\",\"description\":\"سيؤدي هذا إلى إزالة طلبك للحملة \\\"{campaignTitle}\\\". لن تتمكن العلامة التجارية من رؤيته بعد الآن. يمكنك التقديم مرة أخرى لاحقًا إذا كانت الحملة لا تزال مفتوحة.\",\"confirm\":\"نعم، اسحب\"},\"emptyStates\":{\"active\":{\"title\":\"لا توجد حملات نشطة بعد\",\"description\":\"ستظهر هنا الحملات التي تم قبولك فيها. حان الوقت للعثور على تعاونك التالي!\"},\"payment\":{\"title\":\"لا توجد مدفوعات معلقة\",\"description\":\"عندما تمول علامة تجارية حملة وافقت عليها، ستنتقل إلى علامة التبويب 'نشطة'.\"},\"discussion\":{\"title\":\"لا توجد مفاوضات جارية\",\"description\":\"عندما تكون علامة تجارية مهتمة بطلبك، يمكنك التفاوض على الشروط هنا.\"},\"pending\":{\"title\":\"لم تقدم طلبًا لأي حملة\",\"description\":\"تصفح الحملات المفتوحة من أفضل العلامات التجارية وقدم طلبًا لبدء التعاون.\"}}},\"manageApplicationsPage\":{\"title\":\"إدارة الطلبات\",\"description\":\"راجع واختر أفضل المبدعين لحملتك:\",\"hiredDescription\":\"لقد وظفت {hired} من أصل {total} مبدع لهذه الحملة.\",\"hiredLabel\":\"تم توظيفهم\",\"goalLabel\":\"الهدف\",\"tabs\":{\"new\":\"الجدد\",\"discussion\":\"قيد المناقشة\",\"payment\":\"في انتظار الدفع\",\"hired\":\"الموظفون\"},\"closed\":{\"title\":\"هذه الحملة لم تعد تقبل الطلبات.\",\"description\":\"حالتها الحالية هي:\",\"cta\":\"عرض الحملة\"},\"newApplicantsTitle\":\"المتقدمون الجدد\",\"noNewApplicants\":{\"title\":\"لا توجد طلبات جديدة\",\"description\":\"تحقق من علامات التبويب الأخرى للمتقدمين قيد المناقشة أو المعينين بالفعل.\"},\"noNegotiatingApplicants\":{\"title\":\"لا يوجد متقدمون قيد المناقشة\",\"description\":\"قم باختيار المتقدمين الجدد لبدء التفاوض.\"},\"noHiredCreators\":{\"title\":\"لم يتم توظيف أي مبدعين بعد\",\"description\":\"اقبل عرض أحد المتقدمين لتوظيفه في هذه الحملة.\"},\"creator\":\"مبدع\",\"trustScore\":\"نقاط الثقة\",\"coverLetter\":\"خطاب التقديم\",\"readFullLetter\":\"اقرأ الخطاب كاملاً\",\"letterFrom\":\"خطاب التقديم من {name}\",\"close\":\"إغلاق\",\"negotiateButton\":\"ناقش وتفاوض\",\"acceptButton\":\"اقبل ووظف\",\"rejectButton\":\"رفض\",\"viewProfileButton\":\"عرض الملف الشخصي\",\"noApplications\":{\"title\":\"لا توجد طلبات بعد\",\"description\":\"حملتك نشطة. عد قريبًا لترى من تقدم!\",\"cta\":\"العودة إلى لوحة التحكم\"},\"accessDenied\":{\"title\":\"الوصول مرفوض\",\"description\":\"ليس لديك إذن لإدارة هذه الحملة.\"},\"openingChatToast\":\"جارٍ فتح المناقشة...\",\"chatOpenedToast\":{\"title\":\"تم فتح المناقشة!\",\"description\":\"يمكنك الآن التفاوض على الشروط مع المبدع.\"},\"hiringCreatorToast\":\"جارٍ توظيف المبدع...\",\"hiredToast\":{\"title\":\"تم توظيف المبدع!\",\"description\":\"تم إشعاره لقبول الحملة.\"}},\"promoBanner\":{\"general\":[{\"title\":\"انضم إلى الدائرة المقربة.\",\"subtitle\":\"احصل على مزايا حصرية للمؤسسين قبل نفادها.\",\"cta\":\"انضم الآن\"},{\"title\":\"الأماكن محدودة.\",\"subtitle\":\"احجز مقعدك كمؤسس اليوم.\",\"cta\":\"قدم الآن\"}],\"creator\":[{\"title\":\"هل أنت مستعد لتحويل محتواك إلى مهنة؟\",\"subtitle\":\"انضم كمبدع مؤسس.\",\"cta\":\"ابدأ الربح\"}],\"brand\":[{\"title\":\"هل سئمت من التفاعل المزيف؟\",\"subtitle\":\"تواصل مع المبدعين الأكثر أصالة في المغرب.\",\"cta\":\"ابحث عن مؤثرين\"}]},\"footer\":{\"copyright\":\"© 2024 VibeMatch. صُنع في الدار البيضاء للمغرب.\",\"terms\":\"شروط الخدمة\",\"privacy\":\"سياسة الخصوصية\",\"legal\":\"إشعار قانوني\"},\"homePage\":{\"trustBar\":{\"title\":\"انضم إلى نظام بيئي موثوق به\",\"metric\":\"50+ مبدع في قائمة الانتظار\"},\"howItWorks\":{\"title\":\"كيف يعمل VibeMatch\",\"description\":\"عملية مبسطة للاتصال مع المبدعين المثاليين لعلامتك التجارية.\",\"brands\":{\"steps\":[{\"title\":\"انشر حملتك\",\"description\":\"صف أهدافك والتسليمات المطلوبة. النشر مجاني.\",\"icon\":\"Megaphone\"},{\"title\":\"وظف وأمّن الأموال\",\"description\":\"اختر أفضل مبدع وقم بإيداع الدفعة في حساب الضمان VibeMatch.\",\"icon\":\"Lock\"},{\"title\":\"وافق وادفع\",\"description\":\"بمجرد التحقق من صحة المحتوى، نقوم بتحويل الدفعة إلى المبدع.\",\"icon\":\"CheckCircle\"}]},\"creators\":{\"steps\":[{\"title\":\"تقدم للمهام\",\"description\":\"تصفح الحملات وتقدم لتلك التي تناسبك. إنه مجاني.\",\"icon\":\"Rocket\"},{\"title\":\"وافق وأبدع\",\"description\":\"بمجرد التوظيف، يتم تأمين دفعة العلامة التجارية في حساب الضمان. يمكنك البدء في الإبداع بثقة.\",\"icon\":\"Clapperboard\"},{\"title\":\"احصل على أموالك فورًا\",\"description\":\"بمجرد موافقة العلامة التجارية على عملك، يتم تحويل الأموال إلى حسابك.\",\"icon\":\"Banknote\"}]}},\"escrow\":{\"title\":\"ضمان VibeMatch:\",\"titleHighlight\":\"أمانك.\",\"description\":\"بالنسبة للعلامات التجارية، يعني ذلك أنك لا تدفع إلا مقابل عمل توافق عليه. بالنسبة للمبدعين، يعني ذلك أن دفعتك مضمونة بمجرد توظيفك. إنها أبسط طريقة لبناء الثقة وضمان نجاح كل تعاون.\"},\"hero\":{\"title1\":\"سوق المؤثرين الآمن\",\"title2\":\"في المغرب.\",\"subtitle\":\"للعلامات التجارية: ادفع فقط عند التحقق من العمل. للمبدعين: احصل على أموالك مضمونة في غضون 24 ساعة. الضمان للجميع.\",\"brandsButton\":\"أنا علامة تجارية\",\"creatorsButton\":\"أنا صانع محتوى\",\"trustText\":\"موثوق به من قبل 50+ مبدع في قائمة الانتظار لدينا.\"},\"brands\":{\"title1\":\"توقف عن إهدار المال على\",\"title2\":\"التفاعل المزيف.\",\"description\":\"نحن نقدم مبدعين معتمدين ونتائج مضمونة. يقوم محرك الثقة الثوري الخاص بنا بتحليل أكثر من 50 نقطة بيانات لضمان أن كل مؤثر تتعاون معه لديه جمهور حقيقي ومتفاعل. لا مزيد من الروبوتات، لا مزيد من المقاييس الزائفة. فقط تأثير حقيقي.\",\"joinButton\":\"ابدأ التوظيف بأمان\"},\"creators\":{\"title1\":\"توقف عن مطاردة المدفوعات.\",\"title2\":\"نحن نضمنها.\",\"description\":\"ركز على ما تفعله بشكل أفضل: إنشاء محتوى مذهل. VibeMatch يعتني بالباقي. نحن نضمن مدفوعاتك ونؤتمت فواتيرك، حتى تتمكن من بناء علامتك التجارية براحة بال تامة.\",\"applyButton\":\"أمّن وظيفتي الأولى\"},\"testimonialsTitle1\":\"شهادات نعتز بها من\",\"testimonialsTitle2\":\"صناع المحتوى المغاربة\",\"testimonialsTitle3\":\".\",\"testimonials\":[{\"quote\":\"العثور على علامات تجارية تقدر التفاعل الحقيقي كان تحديًا كبيرًا. عملية التدقيق في VibeMatch غيرت كل شيء. أشعر أخيرًا بالتقدير للمجتمع الذي بنيته بجهد.\",\"name\":\"غيثة أ.\",\"role\":\"صانعة محتوى لايف ستايل\",\"image\":\"testimonial-1\"},{\"quote\":\"مطاردة الفواتير كانت تستنزف طاقتي الإبداعية. مع VibeMatch، أعلم أن مستحقاتي ستصل في وقتها، كل مرة. هذا شعور لا يقدر بثمن.\",\"name\":\"أيمن ف.\",\"role\":\"مُراجع تقني\",\"image\":\"testimonial-2\"},{\"quote\":\"كصانعة محتوى، من الصعب إيجاد شركاء يثقون برؤيتك الإبداعية. VibeMatch يربطني بعلامات تجارية تفهم قيمة الحرية الإبداعية والقصص الأصيلة.\",\"name\":\"سكينة\",\"role\":\"مؤثرة في مجال الموضة\",\"image\":\"testimonial-3\"}],\"finalCta\":{\"title\":\"هل أنت مستعد لإطلاق حملتك الأولى؟\",\"description\":\"ابحث عن مبدعين أصليين، أمّن مدفوعاتك، واحصل على نتائج يمكنك الاعتماد عليها. البدء مجاني.\",\"button\":\"ابدأ الآن\",\"reassurance\":\"لا يلزم وجود بطاقة ائتمان للتسجيل.\"},\"faq\":{\"title1\":\"أسئلتكم،\",\"title2\":\"أجوبتنا.\",\"description\":\"كل ما يهمك معرفته حول VibeMatch، سواء كنت علامة تجارية أو صانع محتوى، تجده هنا.\",\"brandsTitle\":\"للعلامات التجارية\",\"creatorsTitle\":\"لصناع المحتوى\",\"viewAllButton\":\"عرض كل الأسئلة\"}},\"faqPage\":{\"title\":{\"part1\":\"أسئلة\",\"part2\":\"شائعة\"},\"description\":\"هل لديك سؤال؟ نحن هنا لمساعدتك. استكشف الأسئلة الشائعة للعثور على إجابات حول VibeMatch.\",\"categories\":\"الفئات\",\"forBrands\":\"للعلامات التجارية\",\"forCreators\":\"لصناع المحتوى\",\"general\":\"أسئلة عامة\",\"stillQuestions\":{\"title\":\"هل ما زال لديك استفسار؟\",\"description\":\"فريقنا مستعد لمساعدتك. تواصل معنا وسنعاود الاتصال بك في أقرب وقت ممكن.\",\"contactButton\":\"تواصل مع الدعم\"},\"brandsFaq\":[{\"question\":\"ما هو محرك الثقة في VibeMatch؟\",\"answer\":\"محرك الثقة هو نظامنا الحصري الذي يحلل أكثر من 50 نقطة بيانات لتدقيق المؤثرين. يتحقق من المتابعين الوهميين، نشاط الروبوتات، وأصالة التفاعل لضمان تعاونك مع مبدعين يمتلكون جمهوراً حقيقياً ومتفاعلاً، مما يعظم عائد استثمار حملتك.\"},{\"question\":\"كيف أجد المؤثرين المثاليين لحملتي؟\",\"answer\":\"يقدم VibeMatch أدوات بحث وتصفية متقدمة. يمكنك البحث عن المؤثرين حسب التخصص، الخصائص الديمغرافية للجمهور، معدلات التفاعل، الموقع، والمزيد. سترشح منصتنا أفضل الشراكات لعلامتك التجارية بناءً على أهداف حملتك وبيانات محرك الثقة.\"},{\"question\":\"كيف تتم إدارة المدفوعات على المنصة؟\",\"answer\":\"يتم تأمين المدفوعات في حساب ضمان لدى VibeMatch. تقوم بتمويل الحملة عند الاتفاق، ولا نقوم بتحويل المبلغ للمبدع إلا بعد موافقتك على المحتوى وتحقيق كل أهداف الحملة. هذا يحمي كلا الطرفين ويضمن تعاونًا سلسًا.\"}],\"creatorsFaq\":[{\"question\":\"كيف أنضم إلى VibeMatch كصانع محتوى؟\",\"answer\":\"للحفاظ على شبكة عالية الجودة، الانضمام إلى VibeMatch حاليًا يتم عبر الدعوة أو تقديم طلب. يمكنك التقديم لتكون من المبدعين المؤسسين. نقوم بمراجعة كل طلب بناءً على تفاعل الجمهور، جودة المحتوى، والتخصص. سيتواصل فريقنا معك إذا كان ملفك الشخصي مناسبًا لمنصتنا.\"},{\"question\":\"كيف يضمن VibeMatch دفع مستحقاتي؟\",\"answer\":\"عندما تتعاقد معك علامة تجارية، تقوم بإيداع المبلغ كاملاً في نظام الضمان الآمن لدينا. بمجرد إنجاز المهام المتفق عليها وموافقة العلامة التجارية عليها, نقوم بتحويل الأموال مباشرة إلى حسابك. هذا يزيل مخاطر تأخر أو عدم الدفع, مما يتيح لك التركيز على إبداعك.\"},{\"question\":\"هل هناك رسوم لاستخدام VibeMatch؟\",\"answer\":\"الانضمام وإنشاء ملف شخصي على VibeMatch مجاني لصناع المحتوى. نقتطع رسوم منصة صغيرة من أرباحك عن كل حملة مكتملة. تساعدنا هذه الرسوم في تغطية معالجة الدفعات, صيانة المنصة, وتزويدك بالدعم والموارد لتنمية مسيرتك المهنية.\"}],\"generalFaq\":[{\"question\":\"ما الذي يميز VibeMatch عن المنصات الأخرى؟\",\"answer\":\"VibeMatch مبني على ركائز الثقة والكفاءة. يضمن محرك الثقة الفريد لدينا تعاونات أصيلة، بينما يحمي نظام الدفع الآلي لدينا المبدعين. نحن نركز بشكل خاص على السوق المغربي، ونفهم ديناميكياته الفريدة ونعزز مجتمعًا من أفضل المواهب والعلامات التجارية المحلية.\"},{\"question\":\"ماذا لو حدث نزاع؟\",\"answer\":\"في حالات الخلاف النادرة بين علامة تجارية ومبدع، يوفر VibeMatch عملية مخصصة لحل النزاعات. سيتوسط فريق الدعم لدينا، ويراجع اتفاقية الحملة والتواصل، ويعمل على إيجاد حل عادل وفي الوقت المناسب لكلا الطرفين.\"}]},\"loginPage\":{\"title\":{\"part1\":\"أهلاً بعودتك إلى\"},\"description\":\"سجل دخولك إلى لوحة التحكم الخاصة بك.\",\"form\":{\"email\":{\"label\":\"البريد الإلكتروني\",\"placeholder\":\"your@email.com\"},\"password\":{\"label\":\"كلمة المرور\",\"forgot\":\"هل نسيت كلمة المرور؟\"},\"submitButton\":\"تسجيل الدخول\"},\"signup\":{\"text\":\"ليس لديك حساب بعد؟\",\"link\":\"انضم الآن.\"}},\"signupDialog\":{\"title\":\"انضم إلى عالم VibeMatch\",\"description\":\"اختر دورك وانطلق في رحلة النجاح معنا.\",\"brand\":{\"title\":\"أنا علامة تجارية\",\"description\":\"ابحث عن شركاء النجاح.\"},\"creator\":{\"title\":\"أنا صانع محتوى\",\"description\":\"تعاون مع أقوى العلامات التجارية.\"}},\"brandJoinPage\":{\"title\":{\"part1\":\"كن أول من يكتشف قوة\"},\"description\":\"انضم إلى قائمة الانتظار الحصرية للعلامات التجارية واكتشف طريقة أكثر شفافية وفعالية للتعاون مع المؤثرين.\",\"form\":{\"name\":{\"label\":\"الاسم الكامل\",\"placeholder\":\"اسمك الكامل\"},\"email\":{\"label\":\"البريد الإلكتروني\",\"placeholder\":\"بريدك الإلكتروني\"},\"company\":{\"label\":\"اسم الشركة\",\"placeholder\":\"اسم شركتك\"},\"ice\":{\"label\":\"ICE\",\"placeholder\":\"رقم التعريف الموحد للمقاولة\"},\"phone\":{\"label\":\"الهاتف (المغرب)\",\"placeholder\":\"06 XX XX XX XX\"},\"city\":{\"label\":\"المدينة (المغرب)\",\"placeholder\":\"مدينتك\"},\"submitButton\":\"الانضمام إلى قائمة الانتظار\",\"submittingButton\":\"جارٍ الإرسال...\"}},\"brandJoinSuccessPage\":{\"title\":\"تم التسجيل بنجاح!\",\"description\":\"أنت الآن على قائمة الانتظار. سنتواصل معك قريباً لمنحك وصولاً حصرياً.\",\"backButton\":\"العودة إلى الصفحة الرئيسية\"},\"creatorJoinForm\":{\"steps\":{\"1\":{\"title\":\"كن من المبدعين المؤسسين\",\"short_title\":\"المعلومات\",\"description\":\"انضم إلى مجتمع النخبة وساهم في تشكيل مستقبل شراكات المبدعين.\"},\"2\":{\"title\":\"أضف حساباتك الاجتماعية\",\"short_title\":\"الحسابات\",\"description\":\"أضف أسماء المستخدمين الخاصة بك على Instagram وTikTok. سنتحقق بسرعة من أنها نشطة.\"},\"3\":{\"title\":\"حدد مجالك الإبداعي\",\"short_title\":\"التخصص\",\"description\":\"ما هي مجالات خبرتك الرئيسية؟ اختر التخصصات التي تمثل محتواك بشكل أفضل.\"},\"4\":{\"title\":\"تعهد بالاحترافية\",\"short_title\":\"التعهد\",\"description\":\"مجتمعنا مبني على الثقة والموثوقية. يرجى تأكيد التزامك بالمعايير المهنية.\"},\"5\":{\"title\":\"تم استلام طلبك!\",\"short_title\":\"تم\",\"description\":\"شكراً لتقديمك لتكون من المبدعين المؤسسين.\"}},\"stepCounter\":\"الخطوة {current} من {total}\",\"backButton\":\"رجوع\",\"nextButton\":\"الخطوة التالية\",\"nextButtonText\":\"التالي:\",\"submitButton\":\"إرسال الطلب\",\"step1\":{\"header\":\"أهلاً بك في دائرة النخبة\",\"description\":\"بصفتك من المبدعين المؤسسين، ستحصل على وصول مبكر لمنصة VibeMatch، وستؤثر بشكل مباشر على تطويرها، وتتواصل مع شبكة منسقة من أفضل المواهب والعلامات التجارية. لنبدأ.\",\"nameLabel\":\"الاسم الكامل\",\"namePlaceholder\":\"أدخل اسمك الكامل\",\"emailLabel\":\"البريد الإلكتروني\",\"emailPlaceholder\":\"أدخل بريدك الإلكتروني\",\"phoneLabel\":\"رقم الهاتف\",\"phonePlaceholder\":\"أدخل رقم هاتفك\",\"differentWhatsappLabel\":\"رقمي على واتساب مختلف\",\"whatsappLabel\":\"رقم واتساب\",\"whatsappPlaceholder\":\"أدخل رقم واتساب الخاص بك\"},\"step2\":{\"header\":\"أبرز تأثيرك\",\"instagramLabel\":\"اسم مستخدم انستغرام\",\"tiktokLabel\":\"اسم مستخدم تيك توك\",\"handlePlaceholder\":\"اسم_المستخدم_الخاص_بك\",\"whyConnectLink\":\"لماذا يجب أن أقدم أسماء المستخدمين الخاصة بي؟\",\"whyConnectAnswer\":\"نستخدم أسماء المستخدمين الخاصة بك لإجراء تحليل آلي لمرة واحدة لبيانات ملفك الشخصي العامة، مثل عدد المتابعين ومعدل التفاعل. يساعدنا هذا في حساب \\\"نقاط الثقة\\\" الخاصة بك والتحقق من أصالة جمهورك. نحن لا نخزن تفاصيل تسجيل الدخول الخاصة بك أو ننشر نيابة عنك.\"},\"step3\":{\"header\":\"ما هو تخصصك؟\",\"otherNicheLabel\":\"يرجى تحديد تخصصك\",\"otherNichePlaceholder\":\"مثال: الحياة المستدامة، محتوى الحيوانات الأليفة\"},\"step4\":{\"header\":\"تعهُدنا بالجودة\",\"description\":\"لضمان بقاء VibeMatch منصة موثوقة، نطلب من كل المبدعين الالتزام بالمعايير المهنية. هذا يساعدنا على الحفاظ على بيئة موثوقة للجميع.\",\"pledge\":\"أتعهد باحترام المواعيد النهائية وعدم استخدام أي تفاعل وهمي.\",\"creatorMandate\":\"أوافق على شروط الاستخدام وأمنح VibeMatch تفويضًا حصريًا لإصدار الفواتير وتحصيل المدفوعات نيابة عني. أوافق على أن يقوم VibeMatch بخصم عمولته قبل تحويل الرصيد الصافي.\"},\"finalStep\":{\"title\":\"شكراً لطلب انضمامك.\",\"description\":\"يقوم فريقنا بمراجعة ملفك الشخصي وستتلقى رداً في غضون 48 ساعة.\",\"backButton\":\"العودة إلى الصفحة الرئيسية\"},\"niches\":[{\"id\":\"fashion\",\"label\":\"الموضة والأناقة\",\"icon\":\"diamond\"},{\"id\":\"beauty\",\"label\":\"الجمال والعناية\",\"icon\":\"face\"},{\"id\":\"food\",\"label\":\"الأكل والمطبخ\",\"icon\":\"restaurant\"},{\"id\":\"travel\",\"label\":\"السفر والمغامرات\",\"icon\":\"flight_takeoff\"},{\"id\":\"lifestyle\",\"label\":\"أسلوب الحياة\",\"icon\":\"self_improvement\"},{\"id\":\"fitness\",\"label\":\"الرياضة واللياقة\",\"icon\":\"fitness_center\"},{\"id\":\"comedy\",\"label\":\"الكوميديا والفكاهة\",\"icon\":\"mood\"},{\"id\":\"art\",\"label\":\"الفن والموسيقى\",\"icon\":\"music_note\"},{\"id\":\"gaming\",\"label\":\"التقنية والألعاب\",\"icon\":\"stadia_controller\"},{\"id\":\"family\",\"label\":\"الأسرة والتربية\",\"icon\":\"family_restroom\"},{\"id\":\"ugc\",\"label\":\"محتوى من إنشاء المستخدم\",\"icon\":\"groups\"},{\"id\":\"other\",\"label\":\"أخرى\",\"icon\":\"more_horiz\"}]},\"creatorProfile\":{\"nextStepTitle\":\"الخطوة التالية :\",\"nextStepLabel\":\"Suivant\",\"completeProfileButton\":\"أكمل الملف الشخصي\",\"completionTips\":[\"المبدعون الذين يكملون ملفاتهم الشخصية لديهم فرصة أكبر 3 مرات للتواصل مع العلامات التجارية.\",\"السيرة الذاتية الرائعة هي فرصتك لسرد قصتك وجذب تعاون أحلامك.\",\"غالباً ما تقوم العلامات التجارية بالتصفية حسب الموقع للعثور على مبدعين محليين للفعاليات والحملات.\",\"صورة ملفك الشخصي هي الانطباع الأول الذي تتركه. اجعلها رائعة!\",\"تساعد العلامات خوارزميتنا على مطابقتك مع فرص الحملات الأكثر صلة.\"],\"steps\":{\"completeProfile\":\"أكمل ملفك الشخصي\",\"addPicture\":\"أضف صورة للملف الشخصي\",\"addName\":\"أضف اسم العرض الخاص بك\",\"addLocation\":\"أضف موقعك\",\"addTag\":\"اختر علامة واحدة على الأقل\",\"addBio\":\"اكتب سيرة ذاتية لتروي قصتك\",\"complete\":\"اكتمل الملف الشخصي!\"},\"edit\":{\"title\":\"تعديل الملف الشخصي\",\"cardTitle\":\"تعديل الملف الشخصي العام\",\"cardDescription\":\"هكذا ستراك العلامات التجارية على VibeMatch.\",\"nameLabel\":\"اسم العرض\",\"namePlaceholder\":\"اسمك الأول أو لقبك\",\"locationLabel\":\"الموقع\",\"locationPlaceholder\":\"مثال: مراكش، المغرب\",\"tagsLabel\":\"العلامات\",\"bioLabel\":\"السيرة الذاتية\",\"bioPlaceholder\":\"أخبر العلامات التجارية بما يجعلك فريدًا. ما هي قصتك وأجواء محتواك؟\",\"cancelButton\":\"إلغاء\",\"saveButton\":\"حفظ التغييرات\",\"savingButton\":\"جارٍ الحفظ...\"},\"stats\":{\"title\":\"إحصائيات التعاون\",\"campaignsCompleted\":\"الحملات المكتملة\",\"newTalent\":\"موهبة جديدة\",\"joined\":\"انضم إلى VibeMatch\"},\"publicProfile\":{\"title\":\"الملف الشخصي العام\",\"description\":\"هكذا ستراك العلامات التجارية.\",\"editButton\":\"تعديل الملف الشخصي\",\"bioLabel\":\"السيرة الذاتية\",\"noBio\":\"لم يتم تقديم سيرة ذاتية.\"},\"portfolio\":{\"title\":\"معرض أعمالي\",\"description\":\"اعرض أفضل أعمالك.\",\"empty\":\"معرض أعمالك فارغ.\",\"addButton\":\"إضافة مشروع\"},\"toast\":{\"success\":{\"title\":\"تم تحديث الملف الشخصي\",\"description\":\"تم حفظ معلوماتك بنجاح.\"},\"error\":{\"title\":\"فشل التحديث\",\"description\":\"تعذر تحديث ملفك الشخصي.\"}}},\"contactPage\":{\"title\":{\"part1\":\"تواصل\",\"part2\":\"معنا\"},\"description\":\"نحن هنا لمساعدتك. سواء كان لديك سؤال حول منصتنا، أو استفسار عن شراكة، أو تحتاج إلى دعم، فإن فريقنا جاهز لمساعدتك.\",\"phone\":{\"title\":\"الدعم الهاتفي\",\"description\":\"فريق الدعم لدينا متاح من الاثنين إلى الجمعة، من الساعة 9 صباحًا حتى 5 مساءً.\",\"button\":\"اتصل الآن\"},\"whatsapp\":{\"title\":\"تحدث عبر واتساب\",\"description\":\"هل تفضل الرسائل النصية؟ تواصل معنا على واتساب للحصول على إجابات سريعة.\",\"button\":\"ابدأ المحادثة\"},\"email\":{\"title\":\"أرسل بريدًا إلكترونيًا\",\"description\":\"للاستفسارات المفصلة أو لتقديم ملاحظاتك، لا تتردد في إرسال بريدًا إلكترونيًا إلينا.\",\"button\":\"أرسل بريدًا إلكترونيًا\"}},\"currency\":\"درهم\",\"notificationsPage\":{\"title\":\"الإشعارات\",\"description\":\"اطلع على كل طلبات الحملات والدعوات والتحديثات في مكان واحد.\",\"empty\":{\"title\":\"صندوق الوارد فارغ\",\"description\":\"عندما تستجيب العلامات التجارية لطلباتك أو تدعوك إلى حملات، ستراها هنا.\",\"description_brand\":\"عندما يقدم المبدعون طلبات لحملاتك، سترى الإشعارات هنا.\"},\"card\":{\"appliedTo\":\"A postulé à\"},\"source\":{\"applied\":\"Candidature\"}},\"createCampaignPage\":{\"title\":\"إنشاء حملة جديدة\",\"description\":\"سيكون هذا مرئيًا للمبدعين على المنصة.\",\"basics\":{\"title\":\"أساسيات الحملة\",\"description\":\"أعط حملتك عنوانًا وموجزًا واضحًا.\"},\"titleLabel\":\"عنوان الحملة\",\"titlePlaceholder\":\"مثال: إطلاق منتجات العناية بالبشرة الصيفية\",\"briefLabel\":\"موجز الحملة\",\"briefPlaceholder\":\"صف أهداف الحملة، الجمهور المستهدف، الرسائل الرئيسية، والأجواء العامة.\",\"instructions\":{\"label\":\"التعليمات والمحظورات (ما يجب وما لا يجب فعله)\",\"placeholder\":\"مثال: عدم عرض شعارات المنافسين. التصوير فقط في ضوء النهار. تنسيق ديناميكي...\"},\"deliverables\":{\"title\":\"التسليمات\",\"description\":\"حدد المحتوى الذي تحتاجه من كل مبدع.\",\"campaignTypeLabel\":\"ما هو الهدف الرئيسي لهذه الحملة؟\",\"influence\":{\"title\":\"التأثير (منشور دعائي)\",\"description\":\"ينشر المبدع على وسائل التواصل الاجتماعي الخاصة به للوصول إلى جمهوره.\"},\"ugc\":{\"title\":\"UGC (محتوى فقط)\",\"description\":\"يرسل لك المبدع ملفات الفيديو/الصور. لا ينشر أي شيء.\",\"tooltip\":\"سيسلم المبدع ملف الفيديو الخام (MP4). يمكنك استخدامه على وسائل التواصل الاجتماعي الخاصة بك والإعلانات. لن ينشره المبدع.\"},\"selectLabel\":\"ماذا يجب على المبدعين تقديمه؟\",\"platformLabel\":\"المنصة\",\"platformPlaceholder\":\"اختر المنصة\",\"typeLabel\":\"النوع\",\"typePlaceholder\":\"اختر النوع\",\"quantityLabel\":\"الكمية\",\"noteLabel\":\"ملاحظة (اختياري)\",\"notePlaceholder\":\"مثال: يجب أن يتضمن رابط المنتج\",\"addButton\":\"إضافة مخرج\"},\"logistics\":{\"title\":\"لوجستيات المنتج\",\"options\":[{\"value\":\"shipping\",\"title\":\"الشحن\",\"description\":\"سأقوم بشحن المنتج إلى المبدع مجانًا.\",\"icon\":\"Package\"},{\"value\":\"digital\",\"title\":\"رقمي / خدمة\",\"description\":\"لا يلزم وجود منتج مادي (مثل تطبيق، خدمة، حدث).\",\"icon\":\"Computer\"}]},\"discovery\":{\"title\":\"الاكتشاف والميزانية\",\"description\":\"حدد علامات لجذب المبدعين المناسبين وحدد ميزانيتك.\"},\"tagsLabel\":\"العلامات\",\"otherTagLabel\":\"علامة (علامات) مخصصة\",\"otherTagPlaceholder\":\"مثال: مستدام، نباتي. افصل بفواصل.\",\"budgetLabel\":\"الميزانية لكل مبدع (بالدرهم)\",\"numCreatorsLabel\":\"عدد المبدعين\",\"publishButton\":\"نشر الحملة\",\"publishingButton\":\"جارٍ النشر...\"},\"editCampaignPage\":{\"title\":\"تعديل الحملة\",\"description\":\"قم بتحديث تفاصيل حملتك أدناه.\",\"saveButton\":\"حفظ التغييرات\",\"savingButton\":\"جارٍ الحفظ...\",\"toast\":{\"successTitle\":\"تم تحديث الحملة!\",\"successDescription\":\"تم حفظ تغييراتك.\",\"errorTitle\":\"فشل التحديث\",\"errorDescription\":\"تعذر تحديث الحملة.\"},\"notFound\":{\"title\":\"الحملة غير موجودة\",\"description\":\"الحملة التي تحاول تعديلها غير موجودة.\",\"cta\":\"العودة إلى لوحة التحكم\"},\"accessDenied\":{\"title\":\"الوصول مرفوض\",\"description\":\"ليس لديك إذن لتعديل هذه الحملة.\",\"cta\":\"العودة إلى لوحة التحكم\"}},\"greetings\":{\"morning\":\"صباح الخير\",\"afternoon\":\"مساء الخير\",\"evening\":\"مساء الخير\"},\"status\":{\"OPEN_FOR_APPLICATIONS\":\"مفتوحة للتقديم\",\"PENDING_SELECTION\":\"في انتظار الاختيار\",\"PENDING_CREATOR_ACCEPTANCE\":\"في انتظار قبول المبدع\",\"OFFER_PENDING\":\"عرض معلق\",\"PENDING_PAYMENT\":\"في انتظار الدفع\",\"AWAITING_YOUR_PAYMENT\":\"في انتظار الدفع منك\",\"IN_PROGRESS\":\"قيد التنفيذ\",\"DELIVERED\":\"تم التسليم\",\"COMPLETED\":\"مكتملة\",\"REJECTED_BY_CREATOR\":\"مرفوضة من قبل المبدع\",\"YOUR_ACCEPTANCE\":\"في انتظار قبولك\"},\"discoverCampaigns\":{\"title\":\"اكتشف الحملات\",\"description\":\"تصفح وقدم طلبًا لحملات حصرية من أفضل العلامات التجارية المغربية.\",\"budget\":\"الميزانية\",\"viewAndApply\":\"عرض وتقديم طلب\",\"applied\":\"تم إرسال الطلب\",\"full\":\"الحملة مكتملة\",\"applyNow\":\"قدّم الآن\",\"noCampaigns\":{\"title\":\"لا توجد حملات مفتوحة الآن\",\"description\":\"تحقق مرة أخرى قريبًا للحصول على فرص جديدة!\"}},\"campaignTypes\":{\"influence\":{\"badge\":\"تأثير\"},\"ugc\":{\"badge\":\"محتوى UGC\"}},\"discoverCreators\":{\"title\":\"اكتشف صناع المحتوى\",\"description\":\"تصفح وتواصل مع أفضل المبدعين المغاربة لحملتك القادمة.\",\"trustScore\":\"نقاط الثقة\",\"trustScoreTooltip\":\"مقياس للموثوقية والأصالة والاحترافية بناءً على النشاط على المنصة.\",\"followers\":\"متابع\",\"inviteButton\":\"دعوة إلى حملة\",\"viewProfileButton\":\"عرض الملف الشخصي\",\"noCreators\":{\"title\":\"لم يتم العثور على مبدعين\",\"description\":\"عد قريبًا حيث ينضم مبدعون جدد إلى المنصة!\"}},\"inviteDialog\":{\"title\":\"دعوة {name}\",\"description\":\"اختر إحدى حملاتك النشطة وأرسل رسالة شخصية.\",\"campaignLabel\":\"الحملة\",\"campaignPlaceholder\":\"اختر حملة بها أماكن شاغرة...\",\"noCampaigns\":\"لا توجد حملات نشطة بها أماكن شاغرة.\",\"hiredText\":\"تم توظيف {hired} من أصل {total}\",\"messageLabel\":\"الرسالة\",\"messagePlaceholder\":\"Rédigez un message bref au créateur...\",\"sendButton\":\"إرسال الدعوة\",\"defaultMessage\":\"مرحبًا {name}، نعتقد أن ملفك الشخصي سيكون مناسبًا جدًا لحملتنا ونود دعوتك للتقديم!\",\"validation\":{\"alreadyHired\":\"{name} هو بالفعل جزء من هذه الحملة.\",\"alreadyApplied\":\"{name} قد قدم بالفعل طلبًا لهذه الحملة.\"},\"toast\":{\"error\":{\"cannotSend\":{\"title\":\"لا يمكن إرسال الدعوة\"}},\"success\":{\"title\":\"تم إرسال الدعوة!\",\"description\":\"{name} تمت دعوته إلى حملتك.\"}}},\"campaignPage\":{\"postedBy\":\"نشرت بواسطة\",\"briefTitle\":\"موجز الحملة\",\"deliverablesTitle\":\"التسليمات\",\"conditionsTitle\":\"الشروط واللوجستيات\",\"logistics\":{\"title\":\"لوجستيات المنتج\"},\"instructions\":{\"title\":\"التعليمات والمحظورات\"},\"applyNow\":\"قدّم الآن\"},\"logistics\":{\"shipping\":\"ستقوم العلامة التجارية بشحن المنتج إليك مجانًا. ستحتاج إلى تقديم عنوانك بعد التوظيف.\",\"digital\":\"لا يلزم وجود منتج مادي لهذه الحملة (مثل تطبيق، خدمة، حدث).\"},\"applyPage\":{\"title\":\"التقديم لـ\",\"backButton\":\"العودة إلى تفاصيل الحملة\",\"alreadyApplied\":{\"title\":\"لقد قدمت طلبًا بالفعل!\",\"description\":\"العلامة التجارية لديها طلبك. سنقوم بإعلامك إذا تم اختيارك.\"},\"form\":{\"tariff\":{\"title\":\"تأكيد تعريفتك\",\"description\":\"الميزانية المقترحة من العلامة التجارية هي {budget} درهم. يمكنك تعديل هذا المبلغ إذا لزم الأمر.\",\"warning\":\"ملاحظة: عرضك أعلى من ميزانية العلامة التجارية.\"},\"coverLetter\":{\"label\":\"لماذا أنت؟ (رسالة تعريفية اختيارية)\",\"placeholder\":\"قدم نفسك واشرح لماذا ستكون مثالياً لهذا التعاون...\"},\"submitButton\":\"إرسال طلبي\",\"submittingButton\":\"جارٍ الإرسال...\"}},\"paymentSuccess\":{\"title\":\"تم الدفع بنجاح!\",\"description\":\"الأموال الآن مؤمنة في الضمان. تم إخطار المبدعين لبدء عملهم.\",\"documentsTitle\":\"المستندات المحاسبية\",\"invoiceButton\":\"تحميل فاتورة الرسوم\",\"receiptButton\":\"تحميل إيصال التفويض\",\"backButton\":\"العودة إلى لوحة التحكم\"},\"checkout\":{\"title\":\"تأمين الأموال (الضمان)\",\"summary\":\"ملخص الطلب\",\"proceedButton\":\"المتابعة إلى الدفع\",\"paymentTo\":\"دفع لـ\",\"subtotal\":\"المجموع الفرعي (مدفوع للمبدعين)\",\"serviceFee\":\"رسوم خدمة VibeMatch (10%)\",\"vat\":\"ضريبة القيمة المضافة على الرسوم (20%)\",\"total\":\"المبلغ الإجمالي للدفع\",\"consent\":{\"title\":\"الموافقة القانونية (إلزامية)\",\"brandMandate\":\"أوافق على شروط الاستخدام وأفوض VibeMatch صراحة بتأمين هذه الأموال في حساب ضمان حتى يتم التحقق من التسليمات. أقر بأن هذا الدفع يبرئ ذمتي من الدين تجاه المبدع.\"},\"cancel\":\"إلغاء\",\"pay\":\"ادفع {total} درهم\",\"processing\":\"جارٍ المعالجة...\",\"processingDescription\":\"محاكاة معاملة آمنة.\",\"toast\":{\"error\":{\"title\":\"فشل الدفع\",\"description\":\"حدث خطأ غير متوقع.\"}}},\"termsPage\":{\"title\":\"شروط الاستخدام العامة\",\"lastUpdated\":\"آخر تحديث: 07 دجنبر 2025\",\"discrepancyNotice\":\"في حالة وجود تعارض، تسود النسخة الفرنسية.\",\"preamble\":{\"title\":\"ديباجة\",\"eligibility\":{\"title\":\"1. الأهلية (تقييد السن)\",\"content\":\"الخدمات مخصصة حصرًا للأشخاص البالغين 18 عامًا أو أكثر ولديهم الأهلية القانونية الكاملة. يُمنع منعًا باتًا تسجيل أي قاصر ما لم يكن مصحوبًا بموافقة خطية من ولي أمره (الولي). تحتفظ VibeMatch بالحق في طلب إثبات السن في أي وقت.\"},\"acceptance\":{\"title\":\"2. القبول (العقد الإلكتروني)\",\"content\":\"يعني الوصول إلى المنصة واستخدامها القبول غير المشروط لهذه الشروط العامة للاستخدام. وفقًا للقانون رقم 53-05 المتعلق بالتبادل الإلكتروني للبيانات القانونية، يشكل النقر على خانة \\\"أوافق\\\" أثناء التسجيل أو الدفع توقيعًا إلكترونيًا صالحًا، يلزم المستخدم بهذه الشروط بنفس القوة القانونية للتوقيع اليدوي.\"}},\"brands\":{\"title\":\"الجزء الأول: شروط خاصة بالعلامات التجارية\",\"legalStatus\":{\"title\":\"الوضع القانوني والوكالة\",\"content\":\"تقر العلامة التجارية بأن VibeMatch تعمل حصريًا كوسيط تقني وطرف موثوق به. بتمويل حملة، تمنح العلامة التجارية لـ VibeMatch وكالة بالدفع وفقًا للفصل 879 وما يليه من قانون الالتزامات والعقود.\",\"item1\":\"تأمين الأموال في حساب مخصص.\",\"item2\":\"الإفراج عن الأموال لصالح صانع المحتوى فقط بعد المصادقة على التسليمات.\"},\"obligations\":{\"title\":\"الالتزامات والمصادقة\",\"brief_b\":\"دفتر التحملات:\",\"brief_t\":\"تلتزم العلامة التجارية بتقديم مواصفات دقيقة. VibeMatch ليست مسؤولة عن عدم الرضا الناتج عن موجز غامض.\",\"validation_b\":\"المصادقة الضمنية:\",\"validation_t\":\"يجب على العلامة التجارية المصادقة على التسليمات في غضون خمسة (5) أيام تقويمية. وإلا، تعتبر مقبولة، مما يؤدي إلى الدفع التلقائي.\"},\"payments\":{\"title\":\"المدفوعات والحجز\",\"liberatory_b\":\"الدفع المبرئ للذمة:\",\"liberatory_t\":\"الدفع لحساب الحجز الخاص بـ VibeMatch يبرئ ذمة العلامة التجارية تجاه صانع المحتوى.\",\"chargebacks_b\":\"استرداد المدفوعات:\",\"chargebacks_t\":\"يعتبر بدء استرداد المبالغ بعد المصادقة احتيالاً وسيؤدي إلى إجراءات تحصيل مع غرامة 20%.\",\"refunds\":{\"title\":\"الاسترداد\",\"preWork\":\"إلغاء قبل العمل: استرداد مبلغ الحجز ناقص 15% رسوم إدارية (دون احتساب الرسوم).\",\"nonDelivery\":\"عدم التسليم: استرداد كامل لمبلغ الحجز.\"}}},\"creators\":{\"title\":\"الجزء الثاني: شروط خاصة بصناع المحتوى\",\"independence\":{\"title\":\"الاستقلالية\",\"content\":\"يعمل صانع المحتوى كمحترف مستقل. هذه الشروط لا تنشئ علاقة عمل. صانع المحتوى هو المسؤول الوحيد عن تصريحاته الضريبية والاجتماعية.\"},\"billingMandate\":{\"title\":\"وكالة الفوترة\",\"content\":\"يمنح صانع المحتوى لـ VibeMatch وكالة بالفوترة من أجل:\",\"item1\":\"إصدار فواتير باسم ونيابة عن صانع المحتوى موجهة للعلامة التجارية، وفقًا لقواعد الفوترة الذاتية المعمول بها في المغرب.\",\"item2\":\"تحصيل الأموال وخصم عمولة 15% (دون احتساب الرسوم) قبل تحويل الرصيد في غضون خمسة (5) أيام عمل.\"},\"ip\":{\"title\":\"الملكية الفكرية\",\"assignment_b\":\"التنازل:\",\"assignment_t\":\"يتنازل صانع المحتوى عن الحقوق المادية (النسخ والتمثيل) للعميل للاستخدام عبر الإنترنت في جميع أنحاء العالم.\",\"personality_b\":\"حقوق الشخصية:\",\"personality_t\":\"يرخص صانع المحتوى للعميل باستخدام اسمه وصورته وصوته للأغراض التجارية للحملة.\",\"adaptation_b\":\"حقوق التعديل:\",\"adaptation_t\":\"يرخص صانع المحتوى بإجراء التعديلات التقنية (القص، تغيير الحجم) اللازمة.\",\"warranty_b\":\"الضمان:\",\"warranty_t\":\"يلتزم صانع المحتوى بتعويض VibeMatch والعلامة التجارية ضد أي مطالبة تتعلق بحقوق الغير.\"},\"confidentiality\":{\"title\":\"السرية\",\"content\":\"يجب على صانع المحتوى الحفاظ على سرية تفاصيل الحملة. أي تسريب هو خطأ جسيم.\"}},\"common\":{\"title\":\"الجزء الثالث: أحكام مشتركة\",\"antiCircumvention\":{\"title\":\"عدم التحايل\",\"content\":\"يوافق المستخدمون على عدم تجاوز VibeMatch للتعاقد مباشرة لمدة اثني عشر (12) شهرًا.\",\"penalty_b\":\"الشرط الجزائي:\",\"penalty_t\":\"يشكل أي انتهاك خسارة تجارية. يوافق الطرف المخالف على دفع تعويض جزافي قدره 10,000 درهم أو 20% من الميزانية المحولة (أيهما أعلى).\"},\"personalData\":{\"title\":\"المعطيات الشخصية\",\"content\":\"تقوم VibeMatch بمعالجة البيانات الشخصية اللازمة لتنفيذ العقد. يقر المستخدمون بأنهم قد قرأوا وقبلوا <PrivacyPolicy>سياسة الخصوصية</PrivacyPolicy> الخاصة بنا، والتي توضح بالتفصيل جمع ومعالجة وحقوق بياناتهم (الوصول، التصحيح، الاعتراض) وفقًا للقانون 09-08 (CNDP).\"},\"liability\":{\"title\":\"المسؤولية والقوة القاهرة\",\"content\":\"تلتزم VibeMatch ببذل العناية. لا يمكن تحميلها المسؤولية عن الانقطاعات التقنية. لا يتحمل أي طرف مسؤولية التأخير الناتج عن القوة القاهرة.\"},\"law\":{\"title\":\"القانون المطبق والاختصاص القضائي\",\"content\":\"تخضع هذه الشروط للقانون المغربي. في حالة النزاع، بعد محاولة التسوية الودية، يُحال النزاع إلى الاختصاص الحصري للمحكمة التجارية بالدار البيضاء.\"},\"survival\":{\"title\":\"بقاء الشروط\",\"content\":\"تبقى الأحكام المتعلقة بالملكية الفكرية، والسرية، وعدم التحايل سارية المفعول بعد إنهاء الحساب.\"},\"severability\":{\"title\":\"قابلية الفصل\",\"content\":\"إذا اعتبر أي حكم من هذه الشروط غير صالح، فإن عدم صلاحية هذا الحكم لن تؤثر على صلاحية الأحكام المتبقية.\"},\"modifications\":{\"title\":\"تعديلات على الشروط\",\"content\":\"تحتفظ VibeMatch بالحق في تعديل هذه الشروط. يشكل الاستمرار في استخدام الخدمة بعد التغييرات قبولًا للشروط الجديدة.\"}}},\"privacyPage\":{\"title\":\"سياسة الخصوصية (قانون 09-08)\",\"lastUpdated\":\"آخر تحديث: 07 دجنبر 2025\",\"sections\":{\"preamble\":{\"title\":\"1. الديباجة ومسؤول المعالجة\",\"p1\":\"حماية بياناتك الشخصية هي أولوية بالنسبة لـ VibeMatch. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لبياناتك وفقًا للقانون رقم 09-08 المتعلق بحماية الأفراد فيما يتعلق بمعالجة البيانات الشخصية.\",\"controller\":{\"title\":\"مسؤول المعالجة:\",\"identity_b\":\"الهوية:\",\"identity_t\":\"[اسم شركتكم أو الاسم الكامل]، الحامل للرقم التعريفي الموحد للمقاولة [أدخل الرقم التعريفي].\",\"hq_b\":\"المقر الرئيسي:\",\"hq_t\":\"الدار البيضاء، المغرب.\",\"contact_b\":\"للتواصل:\",\"contact_t\":\"legal@vibematch.ma\"}},\"data\":{\"title\":\"2. البيانات المجمعة\",\"p1\":\"نقوم بجمع نوعين من البيانات:\",\"direct\":{\"title\":\"2.1. البيانات التي تقدمها مباشرة:\",\"identity_b\":\"الهوية:\",\"identity_t\":\"الاسم، اللقب، بطاقة التعريف الوطنية/جواز السفر (لأغراض التحقق من الهوية)، البريد الإلكتروني، رقم الهاتف.\",\"professional_b\":\"المهنية:\",\"professional_t\":\"السيرة الذاتية، أسماء المستخدمين على وسائل التواصل الاجتماعي (انستغرام، تيك توك)، الأسعار.\",\"financial_b\":\"المالية:\",\"financial_t\":\"رقم الحساب البنكي (لتحويلات الأموال)، عنوان الفوترة. ملاحظة: يتم التعامل مع أرقام بطاقات الائتمان مباشرة من قبل معالج الدفع الآمن لدينا (مثل Stripe/CMI) ولا يتم تخزينها أبدًا على خوادم VibeMatch.\"},\"auto\":{\"title\":\"2.2. البيانات المجمعة تلقائيًا (\\\"نقاط الثقة\\\"):\",\"p1\":\"لتشغيل محرك التحقق لدينا، نقوم بجمع البيانات المتاحة للجمهور من حسابات وسائل التواصل الاجتماعي المرتبطة:\",\"l1\":\"عدد المتابعين، معدلات التفاعل، التركيبة السكانية للجمهور.\",\"l2\":\"هام: لا نصل إلى الرسائل الخاصة أو كلمات المرور.\"},\"technical\":{\"title\":\"2.3. البيانات الفنية:\",\"l1\":\"عنوان IP، نوع المتصفح، الطوابع الزمنية لتسجيل الدخول (مطلوبة لإثبات \\\"التوقيع الإلكتروني\\\" بموجب القانون 53-05).\"}},\"purpose\":{\"title\":\"3. الغرض من المعالجة\",\"p1\":\"نعالج بياناتك للأغراض المحددة التالية:\",\"l1_b\":\"تنفيذ العقد:\",\"l1_t\":\"لإنشاء الحسابات، وإنشاء الفواتير، وتسهيل \\\"التفويض\\\" بين العلامة التجارية والمبدع.\",\"l2_b\":\"الثقة والأمان:\",\"l2_t\":\"لحساب \\\"نقاط الثقة\\\" واكتشاف المتابعين المزيفين أو الملفات الشخصية الاحتيالية.\",\"l3_b\":\"الامتثال المالي:\",\"l3_t\":\"لتنفيذ عمليات الإفراج عن أموال الضمان والامتثال للالتزامات الضريبية.\",\"l4_b\":\"الدفاع القانوني:\",\"l4_t\":\"لتخزين إثبات الموافقة (السجلات) في حالة النزاع.\"},\"sharing\":{\"title\":\"4. مشاركة البيانات والمستلمين\",\"p1\":\"لا تبيع VibeMatch بياناتك الشخصية. تتم مشاركة البيانات فقط مع:\",\"l1_b\":\"الأطراف المقابلة:\",\"l1_t\":\"عندما توظف علامة تجارية مبدعًا، تكون البيانات المهنية الضرورية (الاسم، Portfolio، الإحصائيات) مرئية للعلامة التجارية.\",\"l2_b\":\"مزودو الخدمات:\",\"l2_t\":\"معالجو الدفع الآمنون (المصارف)، ومزودو خدمات الاستضافة السحابية (تخزين البيانات).\",\"l3_b\":\"السلطات:\",\"l3_t\":\"استجابةً لطلب قانوني صالح من السلطات المغربية (الشرطة، إدارة الضرائب، أو CNDP).\"},\"transfers\":{\"title\":\"5. التحويلات الدولية\",\"p1\":\"يتم إعلام المستخدمين بأنه قد يتم استضافة البيانات على خوادم آمنة تقع خارج المغرب (مثل AWS, Google Cloud). تضمن VibeMatch أن هؤلاء المزودين يلتزمون بمعايير أمان صارمة (GDPR/ISO 27001) لضمان مستوى حماية يعادل القانون المغربي.\"},\"rights\":{\"title\":\"6. حقوقك (قانون 09-08)\",\"p1\":\"وفقًا للمواد 7 و 8 و 9 من القانون 09-08، لديك الحقوق التالية:\",\"l1_b\":\"حق الوصول:\",\"l1_t\":\"يمكنك طلب نسخة من جميع البيانات التي نحتفظ بها عنك.\",\"l2_b\":\"حق التصحيح:\",\"l2_t\":\"يمكنك تصحيح البيانات غير الدقيقة أو غير المكتملة.\",\"l3_b\":\"حق المعارضة:\",\"l3_t\":\"يمكنك الاعتراض على معالجة بياناتك لأسباب مشروعة (ما لم تكن البيانات مطلوبة لدفع تعاقدي).\",\"p2\":\"كيفية ممارسة هذه الحقوق: أرسل طلبًا إلى legal@vibematch.ma. سنقوم بالرد في غضون المهلة القانونية.\"},\"retention\":{\"title\":\"7. الاحتفاظ بالبيانات\",\"l1_b\":\"الحسابات النشطة:\",\"l1_t\":\"يتم الاحتفاظ بالبيانات طالما أن الحساب نشط.\",\"l2_b\":\"السجلات المالية:\",\"l2_t\":\"يتم الاحتفاظ بالفواتير وسجلات المعاملات لمدة 10 سنوات (التزام ضريبي).\",\"l3_b\":\"الحسابات غير النشطة:\",\"l3_t\":\"يتم أرشفة بيانات المستخدم أو جعلها مجهولة الهوية بعد 12 شهرًا من إغلاق الحساب، باستثناء الحالات التي يتطلب فيها القانون الاحتفاظ بها لفترة أطول.\"},\"security\":{\"title\":\"8. الأمان\",\"p1\":\"تطبق VibeMatch تدابير فنية وتنظيمية (التشفير، التحكم في الوصول) لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو التغيير.\"},\"cookies\":{\"title\":\"9. ملفات تعريف الارتباط (الكوكيز)\",\"p1\":\"تستخدم منصتنا \\\"ملفات تعريف الارتباط\\\" لتحسين تجربة المستخدم (إدارة الجلسات). يمكنك تكوين متصفحك لرفض ملفات تعريف الارتباط، ولكن قد لا تعمل بعض ميزات المنصة (مثل تسجيل الدخول) بشكل صحيح.\"}}},\"legalNotice\":{\"title\":\"إشعار قانوني\",\"sections\":{\"editor\":{\"title\":\"1. محرر الموقع\",\"companyNameLabel\":\"اسم الشركة / الاسم:\",\"companyName\":\"[اسم الشركة] ش.م.م.\",\"legalStatusLabel\":\"الوضع القانوني:\",\"legalStatus\":\"شركة ذات مسؤولية محدودة\",\"hqLabel\":\"المقر الرئيسي:\",\"hq\":\"الدار البيضاء، المغرب\",\"emailLabel\":\"بريد الاتصال:\",\"email\":\"legal@vibematch.ma\",\"iceLabel\":\"رقم ICE:\",\"ice\":\"[أدخل ICE]\",\"tpLabel\":\"RC:\",\"tp\":\"[أدخل RC]\"},\"hosting\":{\"title\":\"2. الاستضافة\",\"hostLabel\":\"المستضيف:\",\"host\":\"Vercel Inc.\",\"addressLabel\":\"العنوان:\",\"address\":\"San Francisco, USA\"},\"ip\":{\"title\":\"3. الملكية الفكرية\",\"content\":\"جميع العناصر الرسومية، وأكواد المصدر، والشعارات، والنصوص في موقع VibeMatch هي ملكية حصرية للناشر. يُحظر أي استنساخ دون إذن.\"}}},\"deliverableTypes\":{\"Post\":\"{count, plural, one {منشور انستغرام} other {# منشورات انستغرام}}\",\"Story\":\"{count, plural, one {قصة انستغرام} other {# قصص انستغرام}}\",\"Reel\":\"{count, plural, one {ريل انستغرام} other {# ريلات انستغرام}}\",\"Video\":\"{count, plural, one {فيديو تيك توك} other {# فيديوهات تيك توك}}\",\"UGC Video Vertical\":\"{count, plural, one {فيديو UGC (عمودي)} other {# فيديوهات UGC (عمودية)}}\",\"UGC Video Horizontal\":\"{count, plural, one {فيديو UGC (أفقي)} other {# فيديوهات UGC (أفقية)}}\",\"UGC Photo Pack\":\"{count, plural, one {حزمة صور UGC} other {# حزم صور UGC}}\"}}"));}),
"[project]/src/context/language-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$intl$2d$messageformat$2f$lib$2f$src$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/intl-messageformat/lib/src/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$fr$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/fr.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$ar$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/ar.json (json)");
'use client';
;
;
;
;
;
;
const translations = {
    EN: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__["default"],
    FR: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$fr$2e$json__$28$json$29$__["default"],
    AR: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$ar$2e$json__$28$json$29$__["default"]
};
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const messageCache = new Map();
function getNestedTranslation(translations, key) {
    return key.split('.').reduce((obj, k)=>obj && obj[k] !== undefined ? obj[k] : undefined, translations);
}
function formatKey(key) {
    if (!key || typeof key !== 'string') return '';
    const lastPart = key.split('.').pop() || '';
    // Split by uppercase letters or underscores, then join with spaces.
    const words = lastPart.split(/(?=[A-Z])|_/).map((word)=>word.trim()).filter(Boolean);
    return words.map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
const LanguageProvider = ({ children })=>{
    const [language, setLanguageState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('EN');
    const [userInterest, setUserInterestState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedLanguage = localStorage.getItem('vibematch-language');
        if (savedLanguage && [
            'EN',
            'FR',
            'AR'
        ].includes(savedLanguage)) {
            setLanguageState(savedLanguage);
        }
        const savedInterest = localStorage.getItem('userInterest');
        if (savedInterest && [
            'creator',
            'brand'
        ].includes(savedInterest)) {
            setUserInterestState(savedInterest);
        }
    }, []);
    const setLanguage = (lang)=>{
        setLanguageState(lang);
        localStorage.setItem('vibematch-language', lang);
        messageCache.clear(); // Clear cache on language change
    };
    const setUserInterest = (interest)=>{
        setUserInterestState(interest);
        localStorage.setItem('userInterest', interest);
    };
    const dir = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>language === 'AR' ? 'rtl' : 'ltr', [
        language
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.documentElement.lang = language.toLowerCase();
        document.documentElement.dir = dir;
        if (language === 'AR') {
            document.documentElement.style.setProperty('--font-body', "'Tajawal', sans-serif");
            document.documentElement.style.setProperty('--font-headline', "'Tajawal', sans-serif");
        } else {
            document.documentElement.style.setProperty('--font-body', "'Inter', sans-serif");
            document.documentElement.style.setProperty('--font-headline', "'Poppins', sans-serif");
        }
    }, [
        language,
        dir
    ]);
    const t = (key, options)=>{
        const returnObjects = options?.returnObjects;
        const formatOptions = options ? Object.fromEntries(Object.entries(options).filter(([k])=>k !== 'returnObjects')) : {};
        const currentTranslations = translations[language];
        let message = getNestedTranslation(currentTranslations, key);
        if (message === undefined) {
            message = getNestedTranslation(translations['EN'], key);
        }
        if (message === undefined) {
            return formatKey(key);
        }
        if (typeof message === 'object' && returnObjects) {
            return message;
        }
        if (typeof message !== 'string') {
            console.warn(`Translation key "${key}" did not return a string. Fallback to formatted key.`);
            return formatKey(key);
        }
        const hasFormatOptions = Object.keys(formatOptions).length > 0;
        if (hasFormatOptions) {
            const cacheKey = `${key}_${language}`;
            let msgFormat = messageCache.get(cacheKey);
            if (!msgFormat) {
                try {
                    msgFormat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$intl$2d$messageformat$2f$lib$2f$src$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IntlMessageFormat"](message, language);
                    messageCache.set(cacheKey, msgFormat);
                } catch (e) {
                    console.error(`Error compiling message for key "${key}" with message "${message}":`, e);
                    return formatKey(key);
                }
            }
            try {
                const parts = msgFormat.formatToParts(formatOptions);
                return parts.map((part, index)=>{
                    if (part.type === 'literal') {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                            children: part.value
                        }, index, false, {
                            fileName: "[project]/src/context/language-context.tsx",
                            lineNumber: 143,
                            columnNumber: 24
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                    const richTextElement = formatOptions[part.value];
                    if (typeof richTextElement === 'function') {
                        const element = richTextElement(part.value);
                        // Ensure a unique key is passed to the component
                        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isValidElement(element)) {
                            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].cloneElement(element, {
                                key: index
                            });
                        }
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                        children: part.value
                    }, index, false, {
                        fileName: "[project]/src/context/language-context.tsx",
                        lineNumber: 155,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                });
            } catch (e) {
                console.error(`Error formatting message for key "${key}" with options:`, e, formatOptions);
                return formatKey(key);
            }
        }
        return message;
    };
    const value = {
        language,
        setLanguage,
        t,
        dir,
        userInterest,
        setUserInterest
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/language-context.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useLanguage = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
}),
"[project]/src/firebase/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseConfig",
    ()=>firebaseConfig
]);
const firebaseConfig = {
    "projectId": "studio-6015308119-5a7a7",
    "appId": "1:873064732369:web:88435a9d7a70691ee397f0",
    "apiKey": "AIzaSyBlVMUapAJPdRy07Nfjniu5Hdzgqob30kw",
    "authDomain": "studio-6015308119-5a7a7.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "873064732369"
};
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorEmitter",
    ()=>errorEmitter
]);
'use client';
/**
 * A strongly-typed pub/sub event emitter.
 * It uses a generic type T that extends a record of event names to payload types.
 */ function createEventEmitter() {
    // The events object stores arrays of callbacks, keyed by event name.
    // The types ensure that a callback for a specific event matches its payload type.
    const events = {};
    return {
        /**
     * Subscribe to an event.
     * @param eventName The name of the event to subscribe to.
     * @param callback The function to call when the event is emitted.
     */ on (eventName, callback) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName]?.push(callback);
        },
        /**
     * Unsubscribe from an event.
     * @param eventName The name of the event to unsubscribe from.
     * @param callback The specific callback to remove.
     */ off (eventName, callback) {
            if (!events[eventName]) {
                return;
            }
            events[eventName] = events[eventName]?.filter((cb)=>cb !== callback);
        },
        /**
     * Publish an event to all subscribers.
     * @param eventName The name of the event to emit.
     * @param data The data payload that corresponds to the event's type.
     */ emit (eventName, data) {
            if (!events[eventName]) {
                return;
            }
            events[eventName]?.forEach((callback)=>callback(data));
        }
    };
}
const errorEmitter = createEventEmitter();
}),
"[project]/src/features/firebase-errors/components/FirebaseErrorListener.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseErrorListener",
    ()=>FirebaseErrorListener
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
'use client';
;
;
function FirebaseErrorListener() {
    // Use the specific error type for the state for type safety.
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // The callback now expects a strongly-typed error, matching the event payload.
        const handleError = (error)=>{
            // Set error in state to trigger a re-render.
            setError(error);
        };
        // The typed emitter will enforce that the callback for 'permission-error'
        // matches the expected payload type (FirestorePermissionError).
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].on('permission-error', handleError);
        // Unsubscribe on unmount to prevent memory leaks.
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].off('permission-error', handleError);
        };
    }, []);
    // On re-render, if an error exists in state, throw it.
    if (error) {
        throw error;
    }
    // This component renders nothing.
    return null;
}
}),
"[project]/src/firebase/errors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirestorePermissionError",
    ()=>FirestorePermissionError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
'use client';
;
/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */ function buildAuthObject(currentUser) {
    if (!currentUser) {
        return null;
    }
    const token = {
        name: currentUser.displayName,
        email: currentUser.email,
        email_verified: currentUser.emailVerified,
        phone_number: currentUser.phoneNumber,
        sub: currentUser.uid,
        firebase: {
            identities: currentUser.providerData.reduce((acc, p)=>{
                if (p.providerId) {
                    acc[p.providerId] = [
                        p.uid
                    ];
                }
                return acc;
            }, {}),
            sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
            tenant: currentUser.tenantId
        }
    };
    return {
        uid: currentUser.uid,
        token: token
    };
}
/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */ function buildRequestObject(context) {
    let authObject = null;
    try {
        // Safely attempt to get the current user.
        const firebaseAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])();
        const currentUser = firebaseAuth.currentUser;
        if (currentUser) {
            authObject = buildAuthObject(currentUser);
        }
    } catch  {
    // This will catch errors if the Firebase app is not yet initialized.
    // In this case, we'll proceed without auth information.
    }
    return {
        auth: authObject,
        method: context.operation,
        path: `/databases/(default)/documents/${context.path}`,
        resource: context.requestResourceData ? {
            data: context.requestResourceData
        } : undefined
    };
}
/**
 * Builds the final, formatted error message for the LLM.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message and the JSON payload.
 */ function buildErrorMessage(requestObject) {
    return `Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`;
}
class FirestorePermissionError extends Error {
    request;
    constructor(context){
        const requestObject = buildRequestObject(context);
        super(buildErrorMessage(requestObject));
        this.name = 'FirebaseError';
        this.request = requestObject;
    }
}
}),
"[project]/src/firebase/provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseContext",
    ()=>FirebaseContext,
    "FirebaseProvider",
    ()=>FirebaseProvider,
    "useAuth",
    ()=>useAuth,
    "useFirebase",
    ()=>useFirebase,
    "useFirebaseApp",
    ()=>useFirebaseApp,
    "useFirestore",
    ()=>useFirestore,
    "useMemoFirebase",
    ()=>useMemoFirebase,
    "useUser",
    ()=>useUser,
    "useUserProfile",
    ()=>useUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$firebase$2d$errors$2f$components$2f$FirebaseErrorListener$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/firebase-errors/components/FirebaseErrorListener.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const FirebaseContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const FirebaseProvider = ({ children, firebaseApp, firestore, auth })=>{
    const [userAuthState, setUserAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        isUserLoading: true,
        userError: null
    });
    // Effect to subscribe to Firebase auth state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!auth) {
            setUserAuthState({
                user: null,
                isUserLoading: false,
                userError: new Error("Auth service not provided.")
            });
            return;
        }
        setUserAuthState({
            user: null,
            isUserLoading: true,
            userError: null
        }); // Reset on auth instance change
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, (firebaseUser)=>{
            setUserAuthState({
                user: firebaseUser,
                isUserLoading: false,
                userError: null
            });
        }, (error)=>{
            console.error("FirebaseProvider: onAuthStateChanged error:", error);
            setUserAuthState({
                user: null,
                isUserLoading: false,
                userError: error
            });
        });
        return ()=>unsubscribe(); // Cleanup
    }, [
        auth
    ]); // Depends on the auth instance
    // Memoize the context value
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const servicesAvailable = !!(firebaseApp && firestore && auth);
        return {
            areServicesAvailable: servicesAvailable,
            firebaseApp: servicesAvailable ? firebaseApp : null,
            firestore: servicesAvailable ? firestore : null,
            auth: servicesAvailable ? auth : null,
            user: userAuthState.user,
            isUserLoading: userAuthState.isUserLoading,
            userError: userAuthState.userError
        };
    }, [
        firebaseApp,
        firestore,
        auth,
        userAuthState
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FirebaseContext.Provider, {
        value: contextValue,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$firebase$2d$errors$2f$components$2f$FirebaseErrorListener$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseErrorListener"], {}, void 0, false, {
                fileName: "[project]/src/firebase/provider.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/firebase/provider.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useFirebase = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider.');
    }
    if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
        throw new Error('Firebase core services not available. Check FirebaseProvider props.');
    }
    return {
        firebaseApp: context.firebaseApp,
        firestore: context.firestore,
        auth: context.auth,
        user: context.user,
        isUserLoading: context.isUserLoading,
        userError: context.userError
    };
};
const useAuth = ()=>{
    const { auth } = useFirebase();
    return auth;
};
const useFirestore = ()=>{
    const { firestore } = useFirebase();
    return firestore;
};
const useFirebaseApp = ()=>{
    const { firebaseApp } = useFirebase();
    return firebaseApp;
};
function useMemoFirebase(factory, deps) {
    const memoized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(factory, deps);
    if (typeof memoized !== 'object' || memoized === null) return memoized;
    memoized.__memo = true;
    return memoized;
}
const useUser = ()=>{
    const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
    return {
        user,
        isUserLoading,
        userError
    };
};
const useUserProfile = ()=>{
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [profileState, setProfileState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        userProfile: null,
        isLoading: true,
        error: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isUserLoading) {
            setProfileState({
                userProfile: null,
                isLoading: true,
                error: null
            });
            return;
        }
        if (!user) {
            setProfileState({
                userProfile: null,
                isLoading: false,
                error: null
            });
            return;
        }
        setProfileState((prevState)=>({
                ...prevState,
                isLoading: true
            }));
        const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(firestore, 'users', user.uid);
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(userDocRef, (docSnap)=>{
            if (docSnap.exists()) {
                setProfileState({
                    userProfile: docSnap.data(),
                    isLoading: false,
                    error: null
                });
            } else {
                setProfileState({
                    userProfile: null,
                    isLoading: false,
                    error: new Error('User profile not found.')
                });
            }
        }, async (error)=>{
            const contextualError = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
                operation: 'get',
                path: userDocRef.path
            });
            setProfileState({
                userProfile: null,
                isLoading: false,
                error: contextualError
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', contextualError);
        });
        return ()=>unsubscribe();
    }, [
        user,
        isUserLoading,
        firestore
    ]);
    return {
        ...profileState,
        user
    };
};
}),
"[project]/src/firebase/client-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseClientProvider",
    ()=>FirebaseClientProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/firebase/index.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
function FirebaseClientProvider({ children }) {
    const firebaseServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // Initialize Firebase on the client side, once per component mount.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeFirebase"])();
    }, []); // Empty dependency array ensures this runs only once on mount
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseProvider"], {
        firebaseApp: firebaseServices.firebaseApp,
        auth: firebaseServices.auth,
        firestore: firebaseServices.firestore,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/firebase/client-provider.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/firestore/hooks/useCollection.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCollection",
    ()=>useCollection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/errors.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function useCollection(memoizedTargetRefOrQuery) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [key, setKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const mutate = async ()=>{
        if (!memoizedTargetRefOrQuery) return;
        try {
            const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(memoizedTargetRefOrQuery);
            const results = [];
            for (const doc of snapshot.docs){
                results.push({
                    ...doc.data(),
                    id: doc.id
                });
            }
            setData(results);
        } catch (e) {
            console.error("Mutation failed:", e);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!memoizedTargetRefOrQuery) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        // Directly use memoizedTargetRefOrQuery as it's assumed to be the final query
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(memoizedTargetRefOrQuery, (snapshot)=>{
            const results = [];
            for (const doc of snapshot.docs){
                results.push({
                    ...doc.data(),
                    id: doc.id
                });
            }
            setData(results);
            setError(null);
            setIsLoading(false);
        }, async (error)=>{
            // This logic extracts the path from either a ref or a query
            const path = memoizedTargetRefOrQuery.type === 'collection' ? memoizedTargetRefOrQuery.path : memoizedTargetRefOrQuery._query?.path?.canonicalString() || 'unknown_path';
            const contextualError = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
                operation: 'list',
                path
            });
            setError(contextualError);
            setData(null);
            setIsLoading(false);
            // trigger global error propagation
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', contextualError);
        });
        return ()=>unsubscribe();
    }, [
        memoizedTargetRefOrQuery,
        key
    ]); // Re-run if the target query/reference changes.
    return {
        data,
        isLoading,
        error,
        mutate
    };
}
}),
"[project]/src/features/firestore/hooks/useDoc.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDoc",
    ()=>useDoc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/errors.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function useDoc(memoizedDocRef) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [key, setKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const mutate = ()=>setKey((prev)=>prev + 1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!memoizedDocRef) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(memoizedDocRef, (snapshot)=>{
            if (snapshot.exists()) {
                setData({
                    ...snapshot.data(),
                    id: snapshot.id
                });
            } else {
                // Document does not exist
                setData(null);
            }
            setError(null);
            setIsLoading(false);
        }, async (error)=>{
            const contextualError = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
                operation: 'get',
                path: memoizedDocRef.path
            });
            setError(contextualError);
            setData(null);
            setIsLoading(false);
            // trigger global error propagation
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', contextualError);
        });
        return ()=>unsubscribe();
    }, [
        memoizedDocRef,
        key
    ]); // Re-run if the memoizedDocRef changes or mutate is called
    return {
        data,
        isLoading,
        error,
        mutate
    };
}
}),
"[project]/src/features/firestore/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$firestore$2f$hooks$2f$useCollection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/firestore/hooks/useCollection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$firestore$2f$hooks$2f$useDoc$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/firestore/hooks/useDoc.tsx [app-ssr] (ecmascript)");
;
;
}),
"[project]/src/firebase/non-blocking-updates.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addDocumentNonBlocking",
    ()=>addDocumentNonBlocking,
    "deleteDocumentNonBlocking",
    ()=>deleteDocumentNonBlocking,
    "setDocumentNonBlocking",
    ()=>setDocumentNonBlocking,
    "updateDocumentNonBlocking",
    ()=>updateDocumentNonBlocking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/errors.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function setDocumentNonBlocking(docRef, data, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])(docRef, data, options).catch((error)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
            path: docRef.path,
            operation: 'write',
            requestResourceData: data
        }));
    });
// Execution continues immediately
}
function addDocumentNonBlocking(colRef, data) {
    const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])(colRef, data).catch((error)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data
        }));
    });
    return promise;
}
function updateDocumentNonBlocking(docRef, data) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(docRef, data).catch((error)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data
        }));
    });
}
function deleteDocumentNonBlocking(docRef) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteDoc"])(docRef).catch((error)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["errorEmitter"].emit('permission-error', new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirestorePermissionError"]({
            path: docRef.path,
            operation: 'delete'
        }));
    });
}
}),
"[project]/src/firebase/non-blocking-login.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initiateAnonymousSignIn",
    ()=>initiateAnonymousSignIn,
    "initiateEmailSignIn",
    ()=>initiateEmailSignIn,
    "initiateEmailSignUp",
    ()=>initiateEmailSignUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
'use client';
;
function initiateAnonymousSignIn(authInstance) {
    // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInAnonymously"])(authInstance);
// Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
function initiateEmailSignUp(authInstance, email, password) {
    // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(authInstance, email, password);
// Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
function initiateEmailSignIn(authInstance, email, password) {
    // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(authInstance, email, password);
// Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
}),
"[project]/src/firebase/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSdks",
    ()=>getSdks,
    "initializeFirebase",
    ()=>initializeFirebase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$client$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/client-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$firestore$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/firestore/index.ts [app-ssr] (ecmascript) <locals>"); // New import for useCollection and useDoc
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$non$2d$blocking$2d$updates$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/non-blocking-updates.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$non$2d$blocking$2d$login$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/non-blocking-login.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$error$2d$emitter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/error-emitter.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function initializeFirebase() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])().length) {
        // Important! initializeApp() is called without any arguments because Firebase App Hosting
        // integrates with the initializeApp() function to provide the environment variables needed to
        // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
        // without arguments.
        let firebaseApp;
        try {
            // Attempt to initialize via Firebase App Hosting environment variables
            firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseConfig"]);
        } catch (e) {
            // Only warn in production because it's normal to use the firebaseConfig to initialize
            // during development
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseConfig"]);
        }
        return getSdks(firebaseApp);
    }
    // If already initialized, return the SDKs with the already initialized App
    return getSdks((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApp"])());
}
function getSdks(firebaseApp) {
    return {
        firebaseApp,
        auth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp),
        firestore: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(firebaseApp)
    };
}
;
;
;
;
;
;
;
}),
"[project]/src/components/ui/progress.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Progress",
    ()=>Progress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-progress/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const Progress = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, value, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Indicator"], {
            className: "h-full w-full flex-1 bg-primary transition-all",
            style: {
                transform: `translateX(-${100 - (value || 0)}%)`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/ui/progress.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/progress.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Progress.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
;
}),
"[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            gradient: "gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 47,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/src/components/ui/skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/skeleton.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/profile-completion-banner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfileCompletionBanner",
    ()=>ProfileCompletionBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/firebase/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/progress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-ssr] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-ssr] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/language-context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function ProfileCompletionBanner() {
    const { userProfile, isLoading: isProfileLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserProfile"])();
    const { t, dir } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [motivationalTip, setMotivationalTip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const Arrow = dir === 'rtl' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const tips = t('creatorProfile.completionTips', {
            returnObjects: true
        });
        if (tips && tips.length > 0) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            setMotivationalTip(tips[randomIndex]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        t
    ]);
    const { percentage, nextStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!userProfile) return {
            percentage: 30,
            nextStep: {
                text: t('creatorProfile.steps.completeProfile'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
            }
        };
        const fields = [
            {
                key: 'photoURL',
                present: !!userProfile.photoURL,
                text: t('creatorProfile.steps.addPicture'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"]
            },
            {
                key: 'displayName',
                present: !!userProfile.displayName,
                text: t('creatorProfile.steps.addName'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
            },
            {
                key: 'location',
                present: !!userProfile.location,
                text: t('creatorProfile.steps.addLocation'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"]
            },
            {
                key: 'tags',
                present: userProfile.tags && userProfile.tags.length > 0,
                text: t('creatorProfile.steps.addTag'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"]
            },
            {
                key: 'bio',
                present: !!userProfile.bio,
                text: t('creatorProfile.steps.addBio'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"]
            }
        ];
        const completedFields = fields.filter((f)=>f.present).length;
        const totalFields = fields.length;
        const percentage = 30 + Math.round(completedFields / totalFields * 70);
        const firstIncompleteStep = fields.find((f)=>!f.present);
        const nextStep = firstIncompleteStep || {
            text: t('creatorProfile.steps.complete'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
        };
        return {
            percentage,
            nextStep
        };
    }, [
        userProfile,
        t
    ]);
    if (isProfileLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-muted border-b px-6 py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-8 w-1/2 mx-auto"
            }, void 0, false, {
                fileName: "[project]/src/components/profile-completion-banner.tsx",
                lineNumber: 53,
                columnNumber: 15
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile-completion-banner.tsx",
            lineNumber: 52,
            columnNumber: 11
        }, this);
    }
    if (percentage >= 100) {
        return null; // Don't show the banner if profile is complete
    }
    const NextStepIcon = nextStep.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-secondary/50 border-b border-primary/20 px-4 sm:px-6 py-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-7xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-grow flex flex-col gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-primary whitespace-nowrap",
                                        children: [
                                            percentage,
                                            "% ",
                                            t('creatorProfile.steps.complete')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                                        lineNumber: 70,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Progress"], {
                                        value: percentage,
                                        className: "h-2 w-full max-w-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                                        lineNumber: 71,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                lineNumber: 69,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-muted-foreground hidden md:flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NextStepIcon, {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                                lineNumber: 75,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    t('creatorProfile.nextStepLabel'),
                                                    ": ",
                                                    nextStep.text
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                                lineNumber: 76,
                                                columnNumber: 22
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                                        lineNumber: 74,
                                        columnNumber: 20
                                    }, this),
                                    motivationalTip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 border-l pl-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                className: "h-3 w-3 text-primary/80"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                                lineNumber: 80,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: motivationalTip
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                                lineNumber: 81,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                                        lineNumber: 79,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile-completion-banner.tsx",
                                lineNumber: 73,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        asChild: true,
                        size: "sm",
                        className: "rounded-full gradient-bg text-black font-semibold h-8 flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/profile",
                            children: [
                                t('creatorProfile.completeProfileButton'),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Arrow, {
                                    className: "h-4 w-4 ml-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile-completion-banner.tsx",
                                    lineNumber: 88,
                                    columnNumber: 59
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile-completion-banner.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile-completion-banner.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile-completion-banner.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile-completion-banner.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile-completion-banner.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toaster$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toaster.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/language-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/firebase/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$client$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/client-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase/provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2d$completion$2d$banner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile-completion-banner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const AppContent = ({ children })=>{
    const { user, isUserLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const { userProfile, isLoading: isProfileLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserProfile"])();
    const showCompletionBanner = user && !isUserLoading && userProfile && !isProfileLoading && userProfile.role === 'creator';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showCompletionBanner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2d$completion$2d$banner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProfileCompletionBanner"], {}, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 20,
                columnNumber: 32
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true);
};
const AppFooter = ()=>{
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "px-4 md:px-10 lg:px-20 py-8 border-t",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col md:flex-row justify-between items-center gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-center md:text-left text-foreground/60",
                    children: t('footer.copyright')
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 31,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            className: "text-sm text-foreground/60 hover:text-primary",
                            href: "/terms",
                            children: t('footer.terms')
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 35,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            className: "text-sm text-foreground/60 hover:text-primary",
                            href: "/privacy",
                            children: t('footer.privacy')
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 41,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            className: "text-sm text-foreground/60 hover:text-primary",
                            href: "/legal-notice",
                            children: t('footer.legal')
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 47,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 34,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 30,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 29,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        suppressHydrationWarning: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2f$client$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseClientProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                        className: `bg-background text-foreground/90 antialiased selection:bg-primary/20 flex flex-col min-h-screen`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-grow",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContent, {
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/src/app/layout.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppFooter, {}, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toaster$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8ce060cb._.js.map