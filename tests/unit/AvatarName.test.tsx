import AvatarName from '../../src/components/common/AvatarName'
import { render, screen } from '@testing-library/react'

test('renders avatar with name', () => {
  let data = {
    avatar: 'https://res.cloudinary.com/dgeksii7s/image/upload/v1661524439/react-upload/oq0qvn7jdsrcohz1yvji.jpg',
    name: 'dez',
    undername: 'Popular',
  }
  render(<AvatarName avatar={data.avatar} name={data.name} undername={data.undername} />)

  expect(screen.getByText(data.name)).toBeInTheDocument()
  expect(screen.getByText(data.undername)).toBeInTheDocument()
})
