import { render, screen } from '@testing-library/react-native';

import { Skeleton } from '@/shared/components/Skeleton';
import { colors, radius } from '@/shared/constants/theme';

describe('Skeleton', () => {
  it('renders with default width, height, and border radius', async () => {
    await render(<Skeleton />);

    const json = screen.toJSON();
    const flatStyle = Object.assign({}, ...[json?.props.style].flat(Infinity));

    expect(flatStyle).toMatchObject({
      width: '100%',
      height: 16,
      borderRadius: radius.xs,
      backgroundColor: colors.skeleton,
    });
  });

  it('applies custom dimensions', async () => {
    await render(<Skeleton width={120} height={40} borderRadius={8} />);

    const json = screen.toJSON();
    const flatStyle = Object.assign({}, ...[json?.props.style].flat(Infinity));

    expect(flatStyle).toMatchObject({ width: 120, height: 40, borderRadius: 8 });
  });
});
