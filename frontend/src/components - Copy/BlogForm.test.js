import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import blogService from "../services/blogs";

jest.mock('../services/blogs', () => ({
    __esModule: true,
    default: { create: () => ({}) }
}));


test('5.16 - the form calls the event handler with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const spyCreateBS = jest.spyOn(blogService, 'create');

    render(<BlogForm setBlogs={jest.fn()} setMessage={jest.fn()} setVisible={jest.fn()}  />)

    const inputs = screen.getAllByRole('textbox')
    const saveButton = screen.getByText('save')

    await user.type(inputs[0], 'testing a form...')
    await user.type(inputs[1], 'Mackein')
    await user.click(saveButton)

    expect(spyCreateBS).toBeCalledTimes(1)
    expect(spyCreateBS).toBeCalledWith({ title: 'testing a form...', author: 'Mackein', url: '' });
})
