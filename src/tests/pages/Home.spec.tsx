import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/dist/utils/testing";
import Home, { getStaticProps } from "../../pages"
import stripe from '../../services/stripe'

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return{
        data: null, status: 'unauthenticated'
      }
    }
  }
});
jest.mock('next/router');

jest.mock('../../services/stripe');


describe('Home Page', () => {
  
  it('home page renders properly', () => {
    
    render(<Home product= {{productId: 'fake.id', amount: '$10.00'}}/>)
    expect(screen.getByText('$10.00')).toBeInTheDocument();

  })

  it('gets static props properly', async () => {
    const productProps = {
      productId: 'fake.id.price',
      amount: '$10.00'
    }
    const mockedStripePricesRetrieve =  mocked(stripe.prices.retrieve)
    mockedStripePricesRetrieve.mockResolvedValueOnce({
      id: 'fake.id',
      unit_amount: 1000
    } as any)
    const response = await getStaticProps({});
    console.log(response);

    render(<Home product={productProps}/>)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake.id',
            amount: '$10.00'
          }
        }
      })
    )

  })
})