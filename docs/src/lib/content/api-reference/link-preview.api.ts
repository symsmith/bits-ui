import type {
	LinkPreviewArrowPropsWithoutHTML,
	LinkPreviewContentPropsWithoutHTML,
	LinkPreviewContentStaticPropsWithoutHTML,
	LinkPreviewPortalPropsWithoutHTML,
	LinkPreviewRootPropsWithoutHTML,
	LinkPreviewTriggerPropsWithoutHTML,
} from "bits-ui";
import { OnOpenChangeProp, OpenClosedProp } from "./extended-types/shared/index.js";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createFunctionProp,
	createNumberProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	portalProps,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const openClosedDataAttr = createEnumDataAttr({
	name: "state",
	description: "Whether the accordion item is open or closed.",
	options: ["open", "closed"],
	definition: OpenClosedProp,
});

export const root = createApiSchema<LinkPreviewRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: {
		open: createBooleanProp({
			default: "false",
			description: "The open state of the link preview component.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that fires when the open state changes.",
			stringDefinition: "(open: boolean) => void",
		}),
		openDelay: createNumberProp({
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger.",
		}),
		closeDelay: createNumberProp({
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the link preview is disabled.",
		}),
		ignoreNonKeyboardFocus: createBooleanProp({
			default: C.FALSE,
			description: "Whether the link preview should ignore non-keyboard focus.",
		}),
		children: childrenSnippet(),
	},
});

export const trigger = createApiSchema<LinkPreviewTriggerPropsWithoutHTML>({
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = createApiSchema<LinkPreviewContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: {
		...floatingProps(),
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-link-preview-content-transform-origin",
			description: "The transform origin of the link preview content element.",
		}),
		createCSSVarSchema({
			name: "--bits-link-preview-content-available-width",
			description: "The available width of the link preview content element.",
		}),
		createCSSVarSchema({
			name: "--bits-link-preview-content-available-height",
			description: "The available height of the link preview content element.",
		}),
		createCSSVarSchema({
			name: "--bits-link-preview-anchor-width",
			description: "The width of the link preview trigger element.",
		}),
		createCSSVarSchema({
			name: "--bits-link-preview-anchor-height",
			description: "The height of the link preview trigger element.",
		}),
	],
});

export const contentStatic = createApiSchema<LinkPreviewContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the link preview which are displayed when the preview is open. (Static/No Floating UI)",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
});

export const arrow = createApiSchema<LinkPreviewArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: arrowProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "link-preview-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

const portal = createApiSchema<LinkPreviewPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the link preview content into the body or custom `to` element when open",
	props: portalProps,
});

export const linkPreview = [root, trigger, content, contentStatic, arrow, portal];
