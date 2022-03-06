import { render } from "@testing-library/react";
import ActiveLink from ".";


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink Component', () => {
  


it(' should activelink renders correctly ', () => {
  const { getByText } = render(
    <ActiveLink href="/" activeClassName="active">
      <a>Home</a>
    </ActiveLink>
  )
 expect(getByText('Home')).toBeInTheDocument();
})

it('should class activeLink be active', () => {
  const {getByText} = render (
    <ActiveLink href="/" activeClassName="active">
      <a >Home</a>
    </ActiveLink>
  )
  expect(getByText('Home')).toHaveClass("active")
})
})