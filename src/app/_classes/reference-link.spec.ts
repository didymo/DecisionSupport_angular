import {ReferenceLink} from './reference-link';

describe('ReferenceLink', () => {

  it('should construct with all five arguments', () => {
    const ref = new ReferenceLink(
      'https://docs.example.com/how-to',
      'How‑to guide',
      'Step‑by‑step tutorial',
      'section-42',
      'help'
    );

    expect(ref.url).toBe('https://docs.example.com/how-to');
    expect(ref.label).toBe('How‑to guide');
    expect(ref.description).toBe('Step‑by‑step tutorial');
    expect(ref.sectionId).toBe('section-42');
    expect(ref.icon).toBe('help');
  });

  it('should allow property mutation through setters', () => {
    const ref = new ReferenceLink('', '', '', '', '');

    ref.url = '/new';
    ref.label = 'New';
    ref.description = 'Something new';
    ref.sectionId = 'intro';
    ref.icon = 'new_releases';

    expect(ref.url).toBe('/new');
    expect(ref.label).toBe('New');
    expect(ref.description).toBe('Something new');
    expect(ref.sectionId).toBe('intro');
    expect(ref.icon).toBe('new_releases');
  });

});
