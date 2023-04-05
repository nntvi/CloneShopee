import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CartHeader from './CartHeader'

export default {
  title: 'Components/CartHeader',
  component: CartHeader
} as ComponentMeta<typeof CartHeader>

const Template: ComponentStory<typeof CartHeader> = () => <CartHeader />

export const Primary = Template.bind({})
