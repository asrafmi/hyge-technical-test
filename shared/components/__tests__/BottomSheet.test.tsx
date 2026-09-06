import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BottomSheet } from '@/shared/components/BottomSheet';

describe('BottomSheet', () => {
  it('renders its children when visible', async () => {
    await render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Sheet content</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Sheet content')).toBeTruthy();
  });

  it('does not render its children when visible=false', async () => {
    await render(
      <BottomSheet visible={false} onClose={jest.fn()}>
        <Text>Sheet content</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText('Sheet content')).toBeNull();
  });

  it('calls onClose when the backdrop is pressed', async () => {
    const onClose = jest.fn();
    await render(
      <BottomSheet visible onClose={onClose}>
        <Text>Sheet content</Text>
      </BottomSheet>,
    );

    const [backdropPressable] = screen.root!.queryAll(
      (el) => Boolean(el.props.accessible) && Boolean(el.props.focusable),
    );
    await fireEvent.press(backdropPressable);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
