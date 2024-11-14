// import { DecisionSupportList } from '../_components/decision-support-list';

// import {DecisionSupportList} from "./decision-support-list";
//
// describe('DecisionSupportList', () => {
//   it('should create an instance', () => {
//     expect(new DecisionSupportList()).toBeTruthy();
//   });
// });


// decision-support-list.spec.ts
import { DecisionSupportList } from './decision-support-list';

describe('DecisionSupportList', () => {
  let decisionSupportList: DecisionSupportList;
  const currentDate = new Date().toISOString();

  beforeEach(() => {
    decisionSupportList = new DecisionSupportList(
      'Test List Item',
      1,
      currentDate,
      100,
      currentDate
    );
  });

  it('should create an instance', () => {
    expect(decisionSupportList).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(decisionSupportList.label).toBe('Test List Item');
    expect(decisionSupportList.entityId).toBe(1);
    expect(decisionSupportList.revisionCreationTime).toBe(currentDate);
    expect(decisionSupportList.processId).toBe(100);
    expect(decisionSupportList.createdTime).toBe(currentDate);
  });

  it('should handle time string formats correctly', () => {
    const timeString = '2024-01-01T00:00:00Z';
    const listWithTime = new DecisionSupportList(
      'Test',
      1,
      timeString,
      100,
      timeString
    );
    expect(listWithTime.revisionCreationTime).toBe(timeString);
    expect(listWithTime.createdTime).toBe(timeString);
  });
});
