import AvatarName from '../../src/components/common/AvatarName'
import { render, screen } from '@testing-library/react'

test('renders avatar with name and undername', () => {
  let data = {
    avatar: 'https://res.cloudinary.com/dgeksii7s/image/upload/v1661524439/react-upload/oq0qvn7jdsrcohz1yvji.jpg',
    name: 'dez',
    undername: 'Popular',
  }
  render(<AvatarName avatar={data.avatar} name={data.name} undername={data.undername} />)

  const name = screen.getByText(data.name)
  const avatar = screen.getByAltText(data.name)
  const undername = screen.getByText(data.undername)

  expect(name).toBeInTheDocument()
  expect(avatar).toBeInTheDocument()
  expect(undername).toBeInTheDocument()
})
