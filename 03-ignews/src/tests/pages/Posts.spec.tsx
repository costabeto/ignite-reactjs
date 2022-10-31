import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts = [
	{
		slug: "fake-post",
		title: "Fake Post",
		excerpt: "Fake post excerpt",
		updatedAt: "01 de abril",
	},
];

describe("Posts page", () => {
	it("renders correctly", () => {
		render(<Posts posts={posts} />);

		expect(screen.getByText("Fake Post")).toBeInTheDocument();
	});

	it("loads inital data", async () => {
		const getPrismicClientMocked = mocked(getPrismicClient);

		getPrismicClientMocked.mockReturnValueOnce({
			query: jest.fn().mockResolvedValueOnce({
				results: [
					{
						uid: "fake-post",
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
						},
						last_publication_date: "04-01-2021",
					},
				],
			}),
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					posts: [
						{
							slug: "fake-post",
							title: "Fake Post Title",
							excerpt: "Fake post excerpt",
							updatedAt: "01 de abril de 2021",
						},
					],
				},
			})
		);
	});
});
