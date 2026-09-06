import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Text } from 'react-native';

import { PressableScale } from '@/shared/components/PressableScale';

describe('PressableScale', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders its children', async () => {
    await render(
      <PressableScale onPress={jest.fn()}>
        <Text>Tap me</Text>
      </PressableScale>,
    );

    expect(screen.getByText('Tap me')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(
      <PressableScale onPress={onPress}>
        <Text>Tap me</Text>
      </PressableScale>,
    );

    await fireEvent.press(screen.getByText('Tap me'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('fires light haptic feedback on press in by default', async () => {
    await render(
      <PressableScale onPress={jest.fn()}>
        <Text>Tap me</Text>
      </PressableScale>,
    );

    await fireEvent(screen.getByText('Tap me'), 'pressIn');

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('fires medium haptic feedback when haptic="medium"', async () => {
    await render(
      <PressableScale onPress={jest.fn()} haptic="medium">
        <Text>Tap me</Text>
      </PressableScale>,
    );

    await fireEvent(screen.getByText('Tap me'), 'pressIn');

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('does not fire haptics when haptic="none"', async () => {
    await render(
      <PressableScale onPress={jest.fn()} haptic="none">
        <Text>Tap me</Text>
      </PressableScale>,
    );

    await fireEvent(screen.getByText('Tap me'), 'pressIn');

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not fire haptics when disabled', async () => {
    await render(
      <PressableScale onPress={jest.fn()} disabled>
        <Text>Tap me</Text>
      </PressableScale>,
    );

    await fireEvent(screen.getByText('Tap me'), 'pressIn');

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
