import { ComponentMeta, ComponentStory } from '@storybook/react'
import Button from './Button'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    isLoading: {
      description: 'Hiển thị icon loading'
    },
    children: {
      description: 'Nội dung button'
    }
  }
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (props) => <Button {...props} />

export const Primary = Template.bind({})

Primary.args = {
  children: 'Login',
  className: 'flex w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600',
  isLoading: true
}

export const Secondary = Template.bind({})

Secondary.args = {
  children: 'Register',
  className: 'w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600',
  isLoading: true,
  disabled: true
}
