import { render, screen } from "@testing-library/react";
import AddBlogForm from "./AddBlogForm";
import { userEvent } from "@testing-library/user-event";

describe('<AddBlogForm />', () => {

    test('<AddBlogForm /> calls addBlogListEntry with correct info', async () => {
        const user = userEvent.setup()
        const mockAddBlog = vi.fn()
        
        const container = render(<AddBlogForm addBlogListEntry={mockAddBlog} />).container

        const titleInput = container.querySelector(`input[name=title]`)
        const authorInput = container.querySelector(`input[name=author]`)
        const urlInput = container.querySelector(`input[name=url]`)
        
        const addButton = screen.getByText('Add Blog')

        await user.type(titleInput, 'test title')
        await user.type(authorInput, 'test author')
        await user.type(urlInput, 'test url')
        await user.click(addButton)

        expect(mockAddBlog.mock.calls).toHaveLength(1)
        const createdObject = mockAddBlog.mock.calls[0][0]
        expect(createdObject.title).toBe('test title')
        expect(createdObject.author).toBe('test author')
        expect(createdObject.url).toBe('test url')
        
    })
})