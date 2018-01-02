import { render } from '@stencil/core/testing';
import { ReinApp } from './rein-app';

describe('rein-app', () => {
  it('should build', () => {
    expect(new ReinApp()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [ReinApp],
        html: '<rein-app></rein-app>'
      });
    });
  });
});
