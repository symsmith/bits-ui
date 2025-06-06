import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it } from "vitest";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";
import { getTestKbd } from "../utils";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: NavigationMenuTestProps = {}) {
	const user = userEvent.setup();
	const returned = render(NavigationMenuTest, { ...props });

	return { user, ...returned };
}

it("should have no accessibility violations", async () => {
	const { container } = render(NavigationMenuTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should open viewport when hovering trigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	expect(queryByTestId("viewport")).toBeNull();
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	expect(queryByTestId("viewport")).toContainElement(queryByTestId("group-item-content"));
});

it("should toggle viewport when pressing enter on focused trigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	getByTestId("sub-group-item-trigger").focus();
	expect(queryByTestId("viewport")).toBeNull();
	await user.keyboard(kbd.ENTER);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	expect(queryByTestId("viewport")).toContainElement(queryByTestId("sub-group-item-content"));
	await user.keyboard(kbd.ENTER);
	await waitFor(() => expect(queryByTestId("viewport")).toBeNull());
});

it("should show initial submenu items on trigger hover", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("sub-group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	const visibleSubContent = queryByTestId("sub-group-item-sub-item1-content");
	expect(visibleSubContent).not.toBeNull();
	expect(queryByTestId("sub-group-item-sub-item2-content")).toBeNull();
	expect(queryByTestId("sub-group-item-sub-viewport")).toContainElement(visibleSubContent);
});

it("should show submenu items on subtrigger hover", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("sub-group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	const subTrigger = getByTestId("sub-group-item-sub-item2-trigger");
	await user.hover(subTrigger);
	await waitFor(() => expect(queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(queryByTestId("sub-group-item-sub-item1-content")).toBeNull();
	expect(queryByTestId("sub-group-item-sub-viewport")).toContainElement(
		queryByTestId("sub-group-item-sub-item2-content")
	);
});

it("should open submenu viewport when pressing enter on focused subtrigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	getByTestId("sub-group-item-trigger").focus();
	await user.keyboard(kbd.ENTER);
	await waitFor(() => expect(queryByTestId("sub-group-item-sub-item2-trigger")).not.toBeNull());
	getByTestId("sub-group-item-sub-item2-trigger").focus();
	await user.keyboard(kbd.ENTER);
	await waitFor(() => expect(queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(getByTestId("sub-group-item-sub-viewport")).toContainElement(
		getByTestId("sub-group-item-sub-item2-content")
	);
});

it("should show indicator when hovering trigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("indicator")).not.toBeNull());
});

it("should receive focus on the first item", async () => {
	const { user, getByTestId } = setup();
	getByTestId("previous-button").focus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("group-item-trigger")).toHaveFocus();
});

it("should focus next item with right arrow or down arrow, and previous with left or up", async () => {
	const { user, getByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	trigger.focus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("sub-group-item-trigger")).toHaveFocus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next item with tab", async () => {
	const { user, getByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	trigger.focus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("sub-group-item-trigger")).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next sub-item with right arrow, and previous with left", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("sub-group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("sub-group-item-sub-viewport")).not.toBeNull());
	const subTrigger = getByTestId("sub-group-item-sub-item1-trigger");
	subTrigger.focus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("sub-group-item-sub-item2-trigger")).toHaveFocus();
	await user.keyboard(kbd.ARROW_LEFT);
	expect(getByTestId("sub-group-item-sub-item1-trigger")).toHaveFocus();
});

it("should focus next content item with right arrow or down arrow, and previous with left or up", async () => {
	const { user, getByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	trigger.focus();
	await user.keyboard(kbd.ENTER);
	getByTestId("group-item-content-button1").focus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("group-item-content-button2")).toHaveFocus();
	await user.keyboard(kbd.ARROW_LEFT);
	expect(getByTestId("group-item-content-button1")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("group-item-content-button2")).toHaveFocus();
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with tab when opened", async () => {
	const { user, getByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	trigger.focus();
	await user.keyboard(kbd.ENTER);
	await user.keyboard(kbd.TAB);
	expect(getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with down arrow when opened", async () => {
	const { user, getByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	trigger.focus();
	await user.keyboard(kbd.ENTER);
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("group-item-content-button1")).toHaveFocus();
});
