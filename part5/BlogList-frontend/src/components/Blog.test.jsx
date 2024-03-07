import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

    let container

    const mockLikeHandler = vi.fn() 

    beforeEach(() => {
        container = render(<Blog blog={
            {
                title: 'test_blog_title',
                author: 'test_blog_author',
                utl: 'test_blog_url',
                likes: 0,
                user: {
                    name: 'test_user_name',
                }
            } }
            handleLike={mockLikeHandler}
            handleDelete={() => {}}
            showDeleteButton={true}
         />).container
    })

    test('By default the blog title and author are rendered', () => {
        
        // test that title and author appear in the same element
        const titleElement = screen.getByText('test_blog_title', {exact: false})
        expect(titleElement).toBeDefined()
        expect(titleElement).not.toHaveStyle('display: none')
        
        const authorElement = screen.getByText('test_blog_author', {exact: false})
        expect(authorElement).toBeDefined()
        expect(authorElement).not.toHaveStyle('display: none')
        expect(titleElement).toBe(authorElement)
    
        // blogInfoBasic class should be visible
        const basicInfo = container.querySelector('.blogInfoBasic')
        expect(basicInfo).not.toHaveStyle('display: none')
    
        // blogInfoExtended class should be hidden
        const extendedInfo = container.querySelector('.blogInfoExtended')
        expect(extendedInfo).toHaveStyle('display: none')
    
    })
    
    test('Clicking the Show button shows extended blog info', async () => {
    
        const user = userEvent.setup()
        const button = screen.getByText('Show')
        await user.click(button)
    
        const extendedInfo = container.querySelector('.blogInfoExtended')
        expect(extendedInfo).not.toHaveStyle('display: none')
    })

    test('Clicking the Like button twice calls likeButtonHandler twice', async () => {
        const user = userEvent.setup()
        const likeButton = screen.getByText('Like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })

})

