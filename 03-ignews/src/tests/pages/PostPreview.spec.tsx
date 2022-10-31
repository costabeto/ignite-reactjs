import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
jest.mock("next/router");

const post = {
	slug: "fake-post",
	title: "Fake Post",
	content: "<p>Fake post excerpt</p>",
	updatedAt: "01 de abril",
};

describe("Post Preview page", () => {
	it("renders correctly", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: "unauthenticated",
		});

		render(<Post post={post} />);

		expect(screen.getByText("Fake Post")).toBeInTheDocument();
		expect(screen.getByText("Fake post excerpt")).toBeInTheDocument();
		expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
	});

	it("redirects user to full post when it is subscribed", async () => {
		const useSessionMocked = mocked(useSession);
		const useRouterMocked = mocked(useRouter);

		const pushMock = jest.fn();

		useSessionMocked.mockReturnValueOnce({
			data: {
				activeSubscription: "fake-active-subscription",
			},
		} as any);

		useRouterMocked.mockReturnValueOnce({
			push: pushMock,
		} as any);

		render(<Post post={post} />);

		expect(pushMock).toHaveBeenCalledWith("/posts/fake-post");
	});

	it("loads initial data", async () => {
		const getPrismicClientMocked = mocked(getPrismicClient);

		getPrismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce({
				data: {
					title: [
						{
							type: "heading",
							text: "Fake Post Title",
						},
					],
					content: [
						{
							type: "paragraph",
							text: "Fake post excerpt",
						},
					],
					last_publication_date: "04-01-2021",
				},
			}),
		} as any);

		const response = await getStaticProps({
			params: {
				slug: "fake-post",
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post: {
						slug: "fake-post",
						title: "Fake Post Title",
						content: "<p>Fake post excerpt</p>",
						updatedAt: "01 de abril de 2021",
					},
				},
			})
		);
	});
});
