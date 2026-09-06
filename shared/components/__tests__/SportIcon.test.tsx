import { render, screen } from '@testing-library/react-native';

import { SportIcon } from '@/shared/components/SportIcon';

describe('SportIcon', () => {
  it('renders an Ionicon (not the image asset) for a known ionicon sport', async () => {
    await render(<SportIcon sport="basketball" color="#000" />);

    expect(screen.toJSON()?.type).not.toMatch(/ExpoImage/);
  });

  it('renders the badminton image asset for badminton', async () => {
    await render(<SportIcon sport="badminton" color="#000" />);

    expect(screen.toJSON()?.type).toMatch(/ExpoImage/);
  });

  it('is case insensitive when matching the sport', async () => {
    await render(<SportIcon sport="BADMINTON" color="#000" />);

    expect(screen.toJSON()?.type).toMatch(/ExpoImage/);
  });

  it('falls back to the default icon for an unknown sport', async () => {
    await render(<SportIcon sport="chess" color="#000" />);

    expect(screen.toJSON()?.type).not.toMatch(/ExpoImage/);
  });

  it('applies the given size to the badminton image', async () => {
    await render(<SportIcon sport="badminton" color="#000" size={32} />);

    const json = screen.toJSON();
    expect(json?.props.style).toMatchObject({ width: 32, height: 32 });
  });
});
