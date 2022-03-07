import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/dist/utils/testing';
import Posts, { getStaticProps } from '../../pages/posts'
import { Client } from "../../services/prismicHelper"

jest.mock('@prismicio/client');
jest.mock('../../services/prismicHelper');

describe('Posts page tests', () => {
  const posts = [
    {
      slug: 'new-post',
      title: 'This is the new Post',
      excerpt: 'Lorem ipsum dolor sit amet',
      updatedAt: '20 de Fevereiro de 2022',
    }
  ]

  it('Title renders properly', () => {
    render(<Posts posts={posts} />)
    expect(screen.getByText('This is the new Post')).toBeInTheDocument();
  })

  it('getStaticProps render properly', async () => {
    const mockedPrismicClient = mocked(Client)

    mockedPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading1', text: 'This is the new Post' }
              ],
              content: [
                { type: 'paragraph', text: 'Lorem ipsum dolor sit amet' }
              ],
            },
            last_publication_date: '20 de Fevereiro de 2022',
          }
        ]
      })
    } as any)
    const response = await getStaticProps({});
    render(<Posts posts={posts} />)

    console.log(response);
    expect(response).toEqual(
      expect.objectContaining({

      })
    )
  })
})