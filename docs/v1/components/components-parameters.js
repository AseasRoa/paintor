import { component } from 'paintor'
import { ProfileCard } from './ProfileCard.js'

// Directly paint the imported component
ProfileCard('Robert', 33).paint('#oneCard')

// Or, compose your main component
component(
  ProfileCard('John', 31),
  ProfileCard('Jane', 28)
).paint('#manyCards')

