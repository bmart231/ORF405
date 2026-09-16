import Mnr from './mnr.mdx'
import Glm from './glm.mdx'

export const topics = [
  { slug: 'mnr', number: 1, title: 'Multiple & Nonparametric Regression', status: 'ready', Component: Mnr },
  { slug: 'glm', number: 2, title: 'Generalized Linear Models', status: 'ready', Component: Glm },
  { slug: 'msr', number: 3, title: 'Model Selection & Regularization', status: 'pending' },
  { slug: 'cls', number: 4, title: 'Classification & Supervised Learning', status: 'pending' },
  { slug: 'dl', number: 5, title: 'Introduction to Deep Learning', status: 'pending' },
  { slug: 'uns', number: 6, title: 'Unsupervised Learning', status: 'pending' },
  { slug: 'sts', number: 7, title: 'Stationary Time Series & Martingales', status: 'pending' },
  { slug: 'lts', number: 8, title: 'Linear Time Series', status: 'pending' },
  { slug: 'vol', number: 9, title: 'Discrete-Time Volatility Models', status: 'pending' },
]
