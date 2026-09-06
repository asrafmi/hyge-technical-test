import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from '@/shared/components/TextField';

describe('TextField', () => {
  it('renders the label', async () => {
    await render(<TextField label="Email" value="" onChangeText={jest.fn()} />);

    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('calls onChangeText as the user types', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Email" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByDisplayValue(''), 'user@example.com');

    expect(onChangeText).toHaveBeenCalledWith('user@example.com');
  });

  it('shows the error message when provided', async () => {
    await render(<TextField label="Email" value="" onChangeText={jest.fn()} error="Email is required" />);

    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('does not render an error message by default', async () => {
    await render(<TextField label="Email" value="" onChangeText={jest.fn()} />);

    expect(screen.queryByText(/required/i)).toBeNull();
  });

  it('masks input by default when isPassword is set', async () => {
    await render(<TextField label="Password" value="secret" onChangeText={jest.fn()} isPassword />);

    expect(screen.getByDisplayValue('secret').props.secureTextEntry).toBe(true);
  });

  it('toggles visibility when the eye icon is pressed', async () => {
    await render(<TextField label="Password" value="secret" onChangeText={jest.fn()} isPassword />);

    expect(screen.getByDisplayValue('secret').props.secureTextEntry).toBe(true);

    const [eyeToggle] = screen.root!.queryAll((el) => el.props.hitSlop === 10);
    await fireEvent.press(eyeToggle);

    expect(screen.getByDisplayValue('secret').props.secureTextEntry).toBe(false);
  });
});
