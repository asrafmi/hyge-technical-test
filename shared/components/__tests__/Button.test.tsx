import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '@/shared/components/Button';
import { colors } from '@/shared/constants/theme';

describe('Button', () => {
  it('renders the label', async () => {
    await render(<Button label="Book now" onPress={jest.fn()} />);

    expect(screen.getByText('Book now')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continue" onPress={onPress} />);

    await fireEvent.press(screen.getByText('Continue'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continue" onPress={onPress} disabled />);

    await fireEvent.press(screen.getByText('Continue'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continue" onPress={onPress} loading />);

    expect(screen.queryByText('Continue')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows an activity indicator instead of the label while loading', async () => {
    await render(<Button label="Continue" onPress={jest.fn()} loading />);

    expect(screen.queryByText('Continue')).toBeNull();
  });

  it('applies the danger variant background color', async () => {
    await render(<Button label="Delete" onPress={jest.fn()} variant="danger" />);

    const pressable = screen.getByText('Delete').parent?.parent;
    const flatStyle = Array.isArray(pressable?.props.style)
      ? Object.assign({}, ...pressable.props.style.flat(Infinity))
      : pressable?.props.style;

    expect(flatStyle.backgroundColor).toBe(colors.danger);
  });
});
