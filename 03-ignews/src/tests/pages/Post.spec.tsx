import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

const post = {
	slug: "fake-post",
	title: "Fake Post",
	content: "<p>Fake post excerpt</p>",
	updatedAt: "01 de abril",
};

describe("Post page", () => {
	it("renders correctly", () => {
		render(<Post post={post} />);

		expect(screen.getByText("Fake Post")).toBeInTheDocument();
		expect(screen.getByText("Fake post excerpt")).toBeInTheDocument();
	});

	it("redirects user if no subscription is found", async () => {
		const getSessionMocked = mocked(getSession);

		getSessionMocked.mockResolvedValueOnce(null);

		const response = await getServerSideProps({
			params: {
				slug: "fake-post",
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				redirect: expect.objectContaining({
					destination: "/",
				}),
			})
		);
	});

	it("loads initial data", async () => {
		const getSessionMocked = mocked(getSession);
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

		getSessionMocked.mockResolvedValueOnce({
			activeSubscription: "fake-active-subscription",
		} as any);

		const response = await getServerSideProps({
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
