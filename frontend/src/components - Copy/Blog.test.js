import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from "../services/blogs";


const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Sam Goodman',
    url: 'www.somesite.com',
    likes: 0,
    user: { name: 'Mike', username: 'miketyson' }
}

jest.mock('../services/blogs', () => ({
    __esModule: true,
    default: { update: () => blog }
}));


test('5.13 - renders content', () => {

    const { container } = render(<Blog blog={blog} user={blog.user} />)
    // const element = screen.getByText('Component testing is done with react-testing-library')
    // screen.debug(element)
    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent('Component testing is done with react-testing-library Sam Goodman')
    expect(div).not.toHaveTextContent('likes')
    expect(div).not.toHaveTextContent('www.somesite.com')

})

test('5.14 - clicking the button shows additional info', async () => {

    const { container } = render(<Blog blog={blog} user={blog.user} />)
    const div = container.querySelector('.blog')

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)
    // screen.debug()
    expect(div).toHaveTextContent('likes')
    expect(div).toHaveTextContent('www.somesite.com')
})

test('5.15 - clicking the like button twice calls the event handler twice', async () => {
    const spyUpdateBS = jest.spyOn(blogService, 'update')

    render(<Blog blog={blog} user={blog.user} setMessage={jest.fn()} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)


    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // expect(blogService.update).toHaveBeenCalledTimes(2);
    expect(spyUpdateBS).toHaveBeenCalledTimes(2);
})
