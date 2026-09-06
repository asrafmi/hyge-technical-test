import { render, screen } from '@testing-library/react-native';

import { Slider } from '@/shared/components/Slider';

describe('Slider', () => {
  it.each([
    ['a value within range', 50],
    ['the value at the minimum bound', 0],
    ['the value at the maximum bound', 100],
  ])('renders without crashing for %s', async (_label, value) => {
    await render(<Slider min={0} max={100} value={value} onChange={jest.fn()} />);

    expect(screen.toJSON()).toBeTruthy();
  });

  it('does not call onChange on render alone', async () => {
    const onChange = jest.fn();
    await render(<Slider min={0} max={100} value={50} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });
});
