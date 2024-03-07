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
                url: 'test_blog_url',
                likes: 'test_blog_likes',
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
        
        // The elements containing the title and author should not be hidden
        const titleElement = screen.getByText('test_blog_title', {exact: false})
        expect(titleElement).toBeDefined()
        expect(titleElement).toBeVisible()

        const authorElement = screen.getByText('test_blog_author', {exact: false})
        expect(authorElement).toBeDefined()
        expect(authorElement).toBeVisible()

        // likes, user name and url should be hidden
        const userElement = screen.getByText('test_user_name', {exact: false})
        expect(userElement).toBeDefined()
        expect(userElement).not.toBeVisible()

        const likesElement = screen.getByText('test_blog_likes', {exact: false})
        expect(likesElement).toBeDefined()
        expect(likesElement).not.toBeVisible()

        const urlElement = screen.getByText('test_blog_url', {exact: false})
        expect(urlElement).toBeDefined()
        expect(urlElement).not.toBeVisible()

        // blogInfoBasic class should be visible
        const basicInfo = container.querySelector('.blogInfoBasic')
        expect(basicInfo).not.toHaveStyle('display: none')
        expect(basicInfo).toBeVisible()
    
        // blogInfoExtended class should be hidden
        const extendedInfo = container.querySelector('.blogInfoExtended')
        expect(extendedInfo).toHaveStyle('display: none')
        expect(extendedInfo).not.toBeVisible()

    })
    
    test('Clicking the Show button shows extended blog info', async () => {
    
        // click Show button
        const user = userEvent.setup()
        const button = screen.getByText('Show')
        await user.click(button)

        // Everything should be visible
        const titleElement = screen.getByText('test_blog_title', {exact: false})
        expect(titleElement).toBeDefined()
        expect(titleElement).toBeVisible()

        const authorElement = screen.getByText('test_blog_author', {exact: false})
        expect(authorElement).toBeDefined()
        expect(authorElement).toBeVisible()

        const userElement = screen.getByText('test_user_name', {exact: false})
        expect(userElement).toBeDefined()
        expect(userElement).toBeVisible()

        const likesElement = screen.getByText('test_blog_likes', {exact: false})
        expect(likesElement).toBeDefined()
        expect(likesElement).toBeVisible()

        const urlElement = screen.getByText('test_blog_url', {exact: false})
        expect(urlElement).toBeDefined()
        expect(urlElement).toBeVisible()

        const basicInfo = container.querySelector('.blogInfoBasic')
        expect(basicInfo).not.toHaveStyle('display: none')
        expect(basicInfo).toBeVisible()
    
        const extendedInfo = container.querySelector('.blogInfoExtended')
        expect(extendedInfo).not.toHaveStyle('display: none')
        expect(extendedInfo).toBeVisible()

    })

    test('Clicking the Like button twice calls likeButtonHandler twice', async () => {
        const user = userEvent.setup()
        const likeButton = screen.getByText('Like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })

})

