import { fireEvent, render, screen } from "@testing-library/react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { mocked } from "ts-jest/dist/utils/testing"
import SubscribeButton from "."

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscribeButton Tests', () => {
  it('renders correctly ', () => {

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<SubscribeButton />)
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  })

  //test to signin page
  it('redirects user to signin page', () => {
    const signInMocked = mocked(signIn)

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<SubscribeButton />)
    const subsButton = screen.getByText('Subscribe now');

    fireEvent.click(subsButton);
    expect(signInMocked).toHaveBeenCalled();
  })


  // test to page posts
  it('redirects to page posts when user is logged', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMocked = jest.fn();
    
    const Session = {
      user: {
        id:'123',
        name: 'Jhon Doe',
        email: 'emailaleatorio@outlook.com',

      },
      expires: 'fake-expire',
      
    }
    useSessionMocked.mockReturnValueOnce({
      data: Session, status: 'authenticated'} )

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked, 
    } as any)

    
    render(<SubscribeButton />)
    const subsButton = screen.getByRole('button', {name: /Subscribe now/i})
    screen.logTestingPlaygroundURL();

    fireEvent.click(subsButton);
    expect(pushMocked).toHaveBeenCalledWith('/posts');


  })
})