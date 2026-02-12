// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sign in heading', () => {
  render(<App />);
  // Look for the "Sign In" heading text instead of "learn react"
  const headingElement = screen.getByRole('heading', { name: /Sign In/i });
  expect(headingElement).toBeInTheDocument();
});

