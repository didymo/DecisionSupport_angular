// import { ProcessList } from './process-list';
//
// describe('ProcessList', () => {
//   it('should create an instance', () => {
//     expect(new ProcessList()).toBeTruthy();
//   });
// });


// process-list.spec.ts
import { ProcessList } from './process-list';

describe('ProcessList', () => {
  let processList: ProcessList;

  beforeEach(() => {
    processList = new ProcessList(
      'Test Process',
      123,
      '2024-01-01T00:00:00Z',
      'published',
      '2024-01-01T00:00:00Z',
      '2024-01-02T00:00:00Z',
      true
    );
  });

  it('should create an instance', () => {
    expect(processList).toBeTruthy();
  });

  it('should have correct property values', () => {
    expect(processList.label).toBe('Test Process');
    expect(processList.entityId).toBe(123);
    expect(processList.revisionCreationTime).toBe('2024-01-01T00:00:00Z');
    expect(processList.revisionStatus).toBe('published');
    expect(processList.createdTime).toBe('2024-01-01T00:00:00Z');
    expect(processList.updatedTime).toBe('2024-01-02T00:00:00Z');
    expect(processList.enabled).toBe(true);
  });
});
